// 'use client';

// import { useRef } from 'react';
// import { useDrag, useDrop } from 'react-dnd';
// import { Card, CardContent } from '@/components/ui/card';
// import type { ColumnId, Task } from '@/types/types';

// interface TaskCardProps {
//   task: Task;
//   index: number;
//   moveTask: (id: string, toStatus: ColumnId, toIndex: number) => void;
// }

// export default function TaskCard({ task, index, moveTask }: TaskCardProps) {
//   const ref = useRef<HTMLDivElement>(null);

//   // drop to reorder within same column
//   const [, drop] = useDrop<{
//     id: string;
//     index: number;
//     status: ColumnId;
//     }>({
//     accept: 'TASK',
//     hover(item) {
//         if (!ref.current || item.id === task.id) return;
//         if (item.status === task.status && item.index !== index) {
//           moveTask(item.id, task.status, index);
//           item.index = index;
//         }
//       },
//     });
  
//     const [{ isDragging }, drag] = useDrag<{
//       id: string;
//       index: number;
//       status: ColumnId;
//     }, unknown, { isDragging: boolean }>({
//       type: 'TASK',
//       item: { id: task.id, index, status: task.status },
//       collect: (monitor): { isDragging: boolean } => ({ isDragging: monitor.isDragging() }),
//     });
  
//     drag(drop(ref));

//   return (
//     <Card
//       ref={ref}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//       className="cursor-grab"
//     >
//       <CardContent>{task.title}</CardContent>
//     </Card>
//   );
// }


// components/TaskCard.tsx
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
