// "use client";

// import { useDrop } from "react-dnd";
// import TaskCard from "./TaskCard";
// import type { ColumnId, Task } from "@/types/types";
// import React from "react";

// interface ColumnProps {
//   column: { id: ColumnId; title: string };
//   tasks: Task[];
//   moveTask: (id: string, toStatus: ColumnId, toIndex: number) => void;
// }

// export default function Column({ column, tasks, moveTask }: ColumnProps) {
//   const ref = React.useRef<HTMLDivElement>(null);
//   const [, drop] = useDrop<{
//     id: string;
//     index: number;
//     status: ColumnId;
//   }, 
//   void,
//   // TODO: Fix this type, possibly add object only
//     unknown
//   >(
//     () => ({
//       accept: 'TASK',
//       hover(item) {
//         if (item.status !== column.id && tasks.length === 0) {
//           moveTask(item.id, column.id, 0);
//           item.status = column.id;
//           item.index = 0;
//         }
//       },
//     }),
//     [column.id, tasks]
//   );

//   drop(ref);

//   return (
//     <div
//       ref={ref}
//       className="w-80 bg-white/50 dark:bg-slate-800/50 rounded p-2 flex-shrink-0"
//     >
//       <h2 className="font-semibold mb-2">{column.title}</h2>
//       <div className="space-y-2">
//         {tasks.map((task, idx) => (
//           <TaskCard key={task.id} task={task} index={idx} moveTask={moveTask} />
//         ))}
//       </div>
//     </div>
//   );
// }


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


