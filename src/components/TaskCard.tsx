"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/types/types";
import { Trash2, Calendar } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none" as const,
  };

  const handleDelete = async () => {
    if (confirm("Delete this task?")) {
      await deleteDoc(doc(db, "tasks", task.id));
    }
  };

  // Format the due date if present
  let dateObj: Date | null = null;
  if (task.dueDate instanceof Timestamp) {
    dateObj = task.dueDate.toDate();
  } else if (task.dueDate instanceof Date) {
    dateObj = task.dueDate;
  }
  const dueDateLabel = dateObj ? format(dateObj, "dd/MM/yyyy") : null;

  const priLabel = task.priority
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    : "";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={clsx("relative group bg-white", "dark:bg-slate-700")}
      {...attributes}
      {...listeners}
    >
      {/* Delete */}
      <button
        onClick={handleDelete}
        aria-label="Delete task"
        className="absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition bg-white dark:bg-slate-700"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>

      <CardContent className="space-y-1 p-3">
        {/* Title + Priority */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">{task.title}</span>
          {task.priority && (
            <span
              className={clsx(
                "text-xs font-medium px-2 py-0.5 rounded",
                task.priority === "high" && "bg-red-100 text-red-800",
                task.priority === "medium" && "bg-yellow-100 text-yellow-800",
                task.priority === "low" && "bg-green-100 text-green-800"
              )}
            >
              {priLabel}
            </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {dueDateLabel && (
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Due: {dueDateLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
