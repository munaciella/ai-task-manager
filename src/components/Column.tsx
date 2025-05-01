'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

import { db } from '@/lib/firebase';
import TaskCard from './TaskCard';
import type { Column, Task } from '@/types/types';
import { Button } from '@/components/ui/button';
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

interface ColumnProps {
  column: Column;
  tasks: Task[];
  allColumns: Column[];
}

const PROTECTED_IDS = new Set(['todo', 'inprogress', 'done']);

export default function Column({ column, tasks, allColumns }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const isDynamic = !PROTECTED_IDS.has(column.id);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setOpen(false);
    try {
      await deleteDoc(doc(db, 'columns', column.id));

      const tasksQuery = query(
        collection(db, 'tasks'),
        where('status', '==', column.id)
      );
      const snap = await getDocs(tasksQuery);

      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();

      const count = snap.size;
      toast.success(`Deleted “${column.title}” and ${count} task${count !== 1 ? 's' : ''}`, {
        description: 'This action cannot be undone.',
        style: { backgroundColor: '#16A34A', color: 'white' },
      });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete “${column.title}”`, {
        description: 'Please try again later.',
        style: { backgroundColor: '#DC2626', color: 'white' },
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'w-80 h-full flex flex-col bg-white/50 dark:bg-slate-800/50 rounded p-2 flex-shrink-0 touch-pan-y transition-shadow',
        isOver && 'ring-2 ring-blue-400 shadow-lg'
      )}
    >
      {/* Header with optional delete */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">{column.title}</h2>

        {isDynamic && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                aria-label={`Delete column ${column.title}`}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Column</DialogTitle>
                <DialogDescription>
                  This will permanently delete the column “{column.title}” and all{' '}
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} inside.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="space-x-2">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete Column
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Sortable list */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col flex-grow space-y-2 overflow-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} allColumns={allColumns}/>
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
