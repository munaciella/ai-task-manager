'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import type { ColumnId, Task } from '@/types/types';
import clsx from 'clsx';

interface ColumnProps {
  column: { id: ColumnId; title: string };
  tasks: Task[];
}

export default function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'w-80 h-full flex flex-col bg-white/80 dark:bg-slate-800/80 rounded p-2 flex-shrink-0 touch-pan-y transition-shadow',
        isOver && 'ring-2 ring-blue-400 shadow-lg'
      )}
    >
      <h2 className="font-semibold mb-2">{column.title}</h2>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col flex-grow space-y-2 overflow-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}


