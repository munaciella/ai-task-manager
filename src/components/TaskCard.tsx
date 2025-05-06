'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  MoreHorizontal,
  Calendar,
} from 'lucide-react';
import clsx from 'clsx';

import { db } from '@/lib/firebase';
import type { Task, Column } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  allColumns: Column[];
}

export default function TaskCard({ task, allColumns }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle]           = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate]       = useState(() => {
    if (task.dueDate instanceof Timestamp) {
      return format(task.dueDate.toDate(), 'yyyy-MM-dd');
    } else if (task.dueDate instanceof Date) {
      return format(task.dueDate, 'yyyy-MM-dd');
    }
    return '';
  });
  const [priority, setPriority]     = useState(task.priority ?? 'low');
  const [status, setStatus]         = useState(task.status);

  const displayDate = dueDate ? format(new Date(dueDate), 'dd/MM/yyyy') : null;
  const priLabel    = priority.charAt(0).toUpperCase() + priority.slice(1);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      toast.success('Task deleted', {
        description: `“${task.title}” has been removed.`,
        style: { backgroundColor: '#16A34A', color: 'white' },
      });
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete task', {
        description: 'Please try again.',
        style: { backgroundColor: '#DC2626', color: 'white' },
      });
    } finally {
      setDeleteOpen(false);
    }
  };

  const handleSave = async () => {
    try {
      const data: Partial<Task> = {
        title,
        description,
        priority,
        status,
        dueDate: dueDate
          ? Timestamp.fromDate(new Date(dueDate))
          : null,
      };
      await updateDoc(doc(db, 'tasks', task.id), data);
      toast.success('Task updated', {
        description: `“${title}” has been updated.`,
        style: { backgroundColor: '#16A34A', color: 'white' },
      });
      setEditOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update task', {
        description: 'Please try again.',
        style: { backgroundColor: '#DC2626', color: 'white' },
      });
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          touchAction: 'none',
        }}
        className={clsx('relative group bg-white dark:bg-slate-700')}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-3">
          {/* Title + Options Menu */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{task.title}</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600"
                  aria-label="Task options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setEditOpen(true);
                  }}
                >
                  Edit Task…
                </DropdownMenuItem>

                {/* Delete opens the delete-confirm dialog */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setDeleteOpen(true);
                      }}
                    >
                      Delete Task
                    </DropdownMenuItem>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Task</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete “{task.title}”? This cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="space-x-2">
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          )}

          {/* Priority & Due Date */}
          <div className="mt-2 flex items-center space-x-3">
            <span
              className={clsx(
                'text-xs font-medium px-2 py-0.5 rounded',
                priority === 'high' && 'bg-red-100 text-red-800',
                priority === 'medium' && 'bg-yellow-100 text-yellow-800',
                priority === 'low' && 'bg-green-100 text-green-800'
              )}
            >
              {priLabel}
            </span>
            {displayDate && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Due {displayDate}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <Select
                value={priority}
                onValueChange={(v: 'low'|'medium'|'high') => setPriority(v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Move to Column */}
            <div>
              <label className="block text-sm font-medium">Move to Column</label>
              <Select
                value={status}
                onValueChange={(v: string) => setStatus(v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}