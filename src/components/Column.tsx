'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskCard from './TaskCard';
import type { Column, Task } from '@/types/types';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface ColumnProps {
  column: Column;
  tasks: Task[];
}

const PROTECTED_IDS = new Set(['todo', 'inprogress', 'done']);

export default function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const isDynamic = !PROTECTED_IDS.has(column.id);

  const handleDelete = async () => {
    if (!isDynamic) return;
    if (confirm(`Delete column “${column.title}”? All its tasks will remain uncategorized.`)) {
      await deleteDoc(doc(db, 'columns', column.id));
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'w-80 h-full flex flex-col bg-white/80 dark:bg-slate-800/80 rounded p-2 flex-shrink-0 touch-pan-y transition-shadow',
        isOver && 'ring-2 ring-blue-400 shadow-lg'
      )}
    >
      {/* Header with optional delete */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">{column.title}</h2>
        {isDynamic && (
          <button
            onClick={handleDelete}
            aria-label={`Delete column ${column.title}`}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>

      {/* Sortable list */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col flex-grow space-y-2 overflow-auto">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
