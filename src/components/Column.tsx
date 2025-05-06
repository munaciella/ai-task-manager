'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import type { Column as ColumnType, Task } from '@/types/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  allColumns: ColumnType[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Column({
  column,
  tasks,
  allColumns,
  collapsed,
  onToggleCollapse,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'w-80 h-full flex flex-col bg-white/80 dark:bg-slate-800/80 rounded p-2 flex-shrink-0 touch-pan-y transition-shadow',
        isOver && 'ring-2 ring-blue-400 shadow-lg'
      )}
    >
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <h2 className="font-semibold text-lg">{column.title}</h2>
        </div>
        {/* ...you can still put column-level menu/buttons here... */}
      </div>

      {/* Only render the task list if not collapsed */}
      {!collapsed && (
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                allColumns={allColumns}
              />
            ))}
          </div>
        </SortableContext>
      )}

      {/* Optionally show a count or “collapsed” indicator here */}
      {collapsed && (
        <div className="text-sm text-gray-500 italic">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} hidden
        </div>
      )}
    </div>
  );
}
