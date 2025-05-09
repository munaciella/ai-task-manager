"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import NewTaskForm from "@/components/NewTaskForm";
import NewColumnForm from "@/components/NewColumnForm";
import Board from "@/components/Board";

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  return (
    <div className="p-6 md:pt-6 pt-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">
          Welcome to your Task Board, {userName}!
        </h1>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>+ New Task</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md p-2">
              <SheetHeader>
                <SheetTitle>New Task</SheetTitle>
                <SheetDescription>Fill in the details below.</SheetDescription>
              </SheetHeader>
              <NewTaskForm onSuccess={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <NewColumnForm />
        </div>
      </div>

      {/* Search + Priority Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search tasks…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={priorityFilter}
          onValueChange={(v: "all" | "low" | "medium" | "high") =>
            setPriorityFilter(v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Board
        searchTerm={searchTerm}
        priorityFilter={priorityFilter} 
      />
    </div>
  );
}
