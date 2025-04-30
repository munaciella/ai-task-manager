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
import NewColumnForm from '@/components/NewColumnForm';
import Board from '@/components/Board';

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 pt-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Welcome to Task Manager board, {userName}!
        </h1>
        <div className="flex items-center space-x-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>+ New Task</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md p-2">
              <SheetHeader>
                <SheetTitle>New Task</SheetTitle>
                <SheetDescription>
                  Fill in the details below.
                </SheetDescription>
              </SheetHeader>
              <NewTaskForm onSuccess={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <NewColumnForm />
        </div>
      </div>

      <Board />
    </div>
  );
}
