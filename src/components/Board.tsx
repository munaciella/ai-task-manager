// 'use client';

// import { useState } from 'react';
// import { DndProvider } from 'react-dnd-multi-backend';
// import { HTML5toTouch } from 'rdndmb-html5-to-touch';
// import Column from './Column';
// import type { ColumnId, Task } from '@/types/types';

// const initialColumns: Record<ColumnId, { id: ColumnId; title: string }> = {
//   todo:       { id: 'todo',       title: 'To Do' },
//   inprogress: { id: 'inprogress', title: 'In Progress' },
//   done:       { id: 'done',       title: 'Done' },
// };

// const initialTasks: Task[] = [
//   { id: '1', title: 'Set up Clerk auth',   status: 'done'       },
//   { id: '2', title: 'Wire up Firebase',     status: 'inprogress' },
//   { id: '3', title: 'Add drag & drop UI',   status: 'todo'       },
// ];

// export default function Board() {
//   const [tasks, setTasks] = useState<Task[]>(initialTasks);

//   // change status & reorder
//   const moveTask = (taskId: string, toStatus: ColumnId, toIndex: number) => {
//     setTasks(prev => {
//       const task     = prev.find(t => t.id === taskId)!;
//       const others   = prev.filter(t => t.id !== taskId);
//       task.status    = toStatus;
//       others.splice(toIndex, 0, task);
//       return others;
//     });
//   };

//   return (
//     <DndProvider 
//       options={HTML5toTouch}
//       >
//       <div
//         className="flex space-x-4 h-[calc(100vh-4rem)] p-4 overflow-x-auto"
//         style={{
//           backgroundImage: "url('/your-background.png')",
//           backgroundSize: 'cover',
//         }}
//       >
//         {Object.values(initialColumns).map(col => (
//           <Column
//             key={col.id}
//             column={col}
//             tasks={tasks.filter(t => t.status === col.id)}
//             moveTask={moveTask}
//           />
//         ))}
//       </div>
//     </DndProvider>
//   );
// }


// components/Board.tsx
'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column';
import type { ColumnId, Task } from '@/types/types';

// 1) Re-declare these here (or import from a shared file)
const initialColumns: Record<ColumnId, { id: ColumnId; title: string }> = {
  todo:       { id: 'todo',       title: 'To Do' },
  inprogress: { id: 'inprogress', title: 'In Progress' },
  done:       { id: 'done',       title: 'Done' },
};

const initialTasks: Task[] = [
  { id: '1', title: 'Set up Clerk auth', status: 'done'       },
  { id: '2', title: 'Wire up Firebase',  status: 'inprogress' },
  { id: '3', title: 'Add drag & drop UI',status: 'todo'       },
];

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
        activationConstraint: { distance: 10 }, 
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId   = over.id.toString();

    setTasks(prev => {
      // 2) If you dropped on a column (empty or not), move into it
      if (Object.keys(initialColumns).includes(overId)) {
        return prev.map(t =>
          t.id === activeId ? { ...t, status: overId as ColumnId } : t
        );
      }

      // 3) Otherwise you dropped on another task
      const activeTask = prev.find(t => t.id === activeId)!;
      const overTask   = prev.find(t => t.id === overId)!;

      // a) If changing columns
      if (activeTask.status !== overTask.status) {
        return prev.map(t =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        );
      }

      // b) Otherwise same‐column reordering
      const sameColIds = prev
        .filter(t => t.status === activeTask.status)
        .map(t => t.id);

      const oldIndex = sameColIds.indexOf(activeId);
      const newIndex = sameColIds.indexOf(overId);

      const updated = [...prev];
      const [moved] = updated.splice(
        updated.findIndex(t => t.id === activeId), 1
      );
      updated.splice(
        updated.findIndex(t => t.id === overId) + (oldIndex < newIndex ? 1 : 0),
        0,
        moved
      );
      return updated;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex space-x-4 h-[calc(100vh-4rem)] p-4 overflow-x-auto touch-pan-y"
        style={{
          backgroundImage: "url('/your-background.png')",
          backgroundSize: 'cover',
        }}
      >
        {Object.values(initialColumns).map(col => {
          const tasksForColumn = tasks.filter(t => t.status === col.id);
          const itemIds        = tasksForColumn.map(t => t.id);

          return (
            <SortableContext
              key={col.id}
              items={itemIds}
              strategy={verticalListSortingStrategy}
            >
              <Column column={col} tasks={tasksForColumn} />
            </SortableContext>
          );
        })}
      </div>
    </DndContext>
  );
}

