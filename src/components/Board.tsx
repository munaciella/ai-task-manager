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

interface BoardProps {
  searchTerm: string;
  priorityFilter: 'all'|'low'|'medium'|'high';
};

const staticColumns: ColumnType[] = [
  { id: 'todo',       title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done',       title: 'Done' },
];

export default function Board({
  searchTerm,
  priorityFilter,
}: BoardProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [dynCols, setDynCols]     = useState<ColumnType[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');
  const [collapsed, setCollapsed] = useState<Record<string,boolean>>({});

  // Load dynamic columns
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

  // Load tasks
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

  // Drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Combine static + dynamic columns
  const columns = [...staticColumns, ...dynCols];
  const colIds  = new Set(columns.map(c => c.id));

  // Toggle collapsed state
  const toggleCollapse = (colId: string) =>
    setCollapsed(c => ({ ...c, [colId]: !c[colId] }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId   = String(over.id);

    let newTasks = [...tasks];
    let newStatus: string | null = null;

    if (colIds.has(overId)) {
      newStatus = overId;
      newTasks = newTasks.map(t =>
        t.id === activeId ? { ...t, status: newStatus! } : t
      );
    } else {
      const a = tasks.find(t => t.id === activeId)!;
      const b = tasks.find(t => t.id === overId)!;

      if (a.status !== b.status) {
        newStatus = b.status;
        newTasks  = tasks.map(t =>
          t.id === activeId ? { ...t, status: newStatus! } : t
        );
      } else {
        const same = tasks.filter(t => t.status === a.status).map(t => t.id);
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

    setTasks(newTasks);

    if (newStatus) {
      await updateDoc(doc(db, 'tasks', activeId), { status: newStatus });
    }
  };

  return (
    <>
      {/* Sort control */}
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="sort" className="text-sm font-medium">Sort:</label>
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
            backgroundImage: "url('/bg.jpg')",
            backgroundSize: 'cover',
          }}
        >
          {columns.map(col => {
            // 1) Only tasks in this column
            // 2) Then filter by searchTerm
            // 3) Then filter by priorityFilter
            const colTasks = tasks
              .filter(t => t.status === col.id)
              .filter(t =>
                t.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .filter(t =>
                priorityFilter === 'all'
                  ? true
                  : t.priority === priorityFilter
              );

            const ids = colTasks.map(t => t.id);

            return (
              <SortableContext
                key={col.id}
                items={ids}
                strategy={verticalListSortingStrategy}
              >
                <Column
                  column={col}
                  tasks={colTasks}
                  allColumns={columns}
                  collapsed={!!collapsed[col.id]}
                  onToggleCollapse={() => toggleCollapse(col.id)}
                />
              </SortableContext>
            );
          })}
        </div>
      </DndContext>
    </>
  );
}
