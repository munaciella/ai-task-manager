// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import NewTaskForm from '@/components/NewTaskForm';
import Board from '@/components/Board';

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>+ New Task</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-md p-2">
            <SheetHeader>
              <SheetTitle>New Task</SheetTitle>
              <SheetDescription>Fill in the details below.</SheetDescription>
            </SheetHeader>

            {/* ← Here’s our new form */}
            <NewTaskForm onSuccess={() => setOpen(false)} />

          </SheetContent>
        </Sheet>
      </div>

      {/* Your Kanban board */}
      <Board />
    </div>
  );
}
