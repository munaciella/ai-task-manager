// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   doc,
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import Column from './Column';
// import type { ColumnId, Task } from '@/types/types';

// // Define your columns here (or import from a shared file)
// const initialColumns: Record<ColumnId, { id: ColumnId; title: string }> = {
//   todo:       { id: 'todo',       title: 'To Do' },
//   inprogress: { id: 'inprogress', title: 'In Progress' },
//   done:       { id: 'done',       title: 'Done' },
// };

// export default function Board() {
//   const [tasks, setTasks] = useState<Task[]>([]);

//   // 1) Real-time listener: load all tasks ordered by createdAt
//   useEffect(() => {
//     const q = query(
//       collection(db, 'tasks'),
//       orderBy('createdAt', 'asc')
//     );
//     const unsubscribe = onSnapshot(q, snapshot => {
//       setTasks(
//         snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Task, 'id'>),
//         }))
//       );
//     });
//     return unsubscribe;
//   }, []);

//   // 2) Set up pointer sensor (works on mouse & touch)
//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: { distance: 5 },
//     })
//   );

//   // 3) Handle drag end
//   const handleDragEnd = async (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeId = active.id.toString();
//     const overId   = over.id.toString();

//     let newTasks = [...tasks];
//     let newStatus: ColumnId | null = null;

//     // a) Dropped on a column (empty or not)
//     if (Object.keys(initialColumns).includes(overId)) {
//       newStatus = overId as ColumnId;
//       newTasks = newTasks.map(t =>
//         t.id === activeId ? { ...t, status: newStatus! } : t
//       );

//     } else {
//       // b) Dropped on another task
//       const activeTask = tasks.find(t => t.id === activeId)!;
//       const overTask   = tasks.find(t => t.id === overId)!;

//       // b1) Changed column
//       if (activeTask.status !== overTask.status) {
//         newStatus = overTask.status;
//         newTasks = tasks.map(t =>
//           t.id === activeId ? { ...t, status: newStatus! } : t
//         );

//       } else {
//         // b2) Reordering within the same column
//         const sameColumnIds = tasks
//           .filter(t => t.status === activeTask.status)
//           .map(t => t.id);
//         const oldIndex = sameColumnIds.indexOf(activeId);
//         const newIndex = sameColumnIds.indexOf(overId);

//         // remove and reinsert at newIndex
//         const updated = [...tasks];
//         const [moved] = updated.splice(
//           updated.findIndex(t => t.id === activeId),
//           1
//         );
//         updated.splice(
//           updated.findIndex(t => t.id === overId) + (oldIndex < newIndex ? 1 : 0),
//           0,
//           moved
//         );
//         newTasks = updated;
//       }
//     }

//     // 4) Apply optimistic local update
//     setTasks(newTasks);

//     // 5) If status changed, persist it
//     if (newStatus) {
//       await updateDoc(doc(db, 'tasks', activeId), {
//         status: newStatus,
//       });
//     }
//   };

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//     >
//       <div
//         className="flex space-x-4 h-[calc(100vh-4rem)] p-4 overflow-x-auto touch-pan-y"
//         style={{
//           backgroundImage: "url('/your-background.png')",
//           backgroundSize: 'cover',
//         }}
//       >
//         {Object.values(initialColumns).map(col => {
//           // Tasks for this column
//           const columnTasks = tasks.filter(t => t.status === col.id);
//           const itemIds     = columnTasks.map(t => t.id);

//           return (
//             <SortableContext
//               key={col.id}
//               items={itemIds}
//               strategy={verticalListSortingStrategy}
//             >
//               <Column column={col} tasks={columnTasks} />
//             </SortableContext>
//           );
//         })}
//       </div>
//     </DndContext>
//   );
// }


// components/Board.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
import type { Column as ColumnType, Task } from '@/types/types';

// Your three built-in columns
const staticColumns: ColumnType[] = [
  { id: 'todo',       title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done',       title: 'Done' },
];

export default function Board() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [dynCols, setDynCols]     = useState<ColumnType[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');

  // 1) Load dynamic columns from Firestore
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const colQ = query(
      collection(db, 'columns'),
      where('ownerId', '==', user.id),
      orderBy('position', 'asc')
    );
    const unsubCols = onSnapshot(colQ, snap => {
      setDynCols(
        snap.docs.map(d => ({
          id:    d.id,
          title: d.data().title as string,
        }))
      );
    });
    return unsubCols;
  }, [isLoaded, isSignedIn, user]);

  // 2) Load tasks for this user, sorted by createdAt
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const taskQ = query(
      collection(db, 'tasks'),
      where('ownerId', '==', user.id),
      orderBy('createdAt', sortOrder)
    );
    const unsubTasks = onSnapshot(taskQ, snap => {
      setTasks(
        snap.docs.map(d => ({
          id:    d.id,
          ...(d.data() as Omit<Task, 'id'>),
        }))
      );
    });
    return unsubTasks;
  }, [isLoaded, isSignedIn, user, sortOrder]);

  // 3) DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 4) Combine static + dynamic columns
  const columns = [...staticColumns, ...dynCols];
  const colIds  = new Set(columns.map(c => c.id));

  // 5) Drag end handler (unchanged)
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId   = over.id.toString();

    let newTasks = [...tasks];
    let newStatus: string | null = null;

    if (colIds.has(overId)) {
      // dropped on a column
      newStatus = overId;
      newTasks = newTasks.map(t =>
        t.id === activeId ? { ...t, status: newStatus! } : t
      );
    } else {
      // dropped on another task
      const a = tasks.find(t => t.id === activeId)!;
      const b = tasks.find(t => t.id === overId)!;

      if (a.status !== b.status) {
        newStatus = b.status;
        newTasks  = tasks.map(t =>
          t.id === activeId ? { ...t, status: newStatus! } : t
        );
      } else {
        // reorder within same column
        const same = tasks
          .filter(t => t.status === a.status)
          .map(t => t.id);
        const oldIndex = same.indexOf(activeId);
        const newIndex = same.indexOf(overId);

        const updated = [...tasks];
        const [moved] = updated.splice(
          updated.findIndex(t => t.id === activeId),
          1
        );
        updated.splice(
          updated.findIndex(t => t.id === overId) + (oldIndex < newIndex ? 1 : 0),
          0,
          moved
        );
        newTasks = updated;
      }
    }

    // Optimistic update
    setTasks(newTasks);

    // Persist any status change
    if (newStatus) {
      await updateDoc(doc(db, 'tasks', activeId), { status: newStatus });
    }
  };

  return (
    <>
      {/* Sort control (optional) */}
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="sort" className="text-sm font-medium">
          Sort:
        </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'asc'|'desc')}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="asc">Oldest first</option>
          <option value="desc">Newest first</option>
        </select>
      </div>

      {/* Kanban Board */}
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
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            const ids      = colTasks.map(t => t.id);

            return (
              <SortableContext
                key={col.id}
                items={ids}
                strategy={verticalListSortingStrategy}
              >
                <Column column={col} tasks={colTasks} />
              </SortableContext>
            );
          })}
        </div>
      </DndContext>
    </>
  );
}
