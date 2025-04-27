'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '@/types/types';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' as const, // prevent browser gestures
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab select-none"
      {...attributes}
      {...listeners}
    >
      <CardContent>{task.title}</CardContent>
    </Card>
  );
}
