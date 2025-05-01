"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Column } from "@/types/types";

const staticColumns: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

interface NewTaskFormProps {
  onSuccess: () => void;
}

export default function NewTaskForm({ onSuccess }: NewTaskFormProps) {
  const { user, isLoaded, isSignedIn } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [status, setStatus] = useState<string>("todo");
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const [dynCols, setDynCols] = useState<Column[]>([]);
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const colQ = query(
      collection(db, "columns"),
      where("ownerId", "==", user.id),
      orderBy("position", "asc")
    );
    const unsub = onSnapshot(colQ, (snap) => {
      setDynCols(
        snap.docs.map((d) => ({
          id: d.id,
          title: d.data().title as string,
        }))
      );
    });
    return unsub;
  }, [isLoaded, isSignedIn, user]);

  const columns = useMemo(() => [...staticColumns, ...dynCols], [dynCols]);

  useEffect(() => {
    if (!columns.find((c) => c.id === status)) {
      setStatus(columns[0]?.id || "todo");
    }
  }, [columns, status]);

  const handleSuggest = async () => {
    if (!title.trim()) {
      toast.warning("Enter a title first", {
        description: "AI needs a title to suggest a due date & priority",
        style: { backgroundColor: "#EAB308", color: "black" },
      });
      return;
    }
    setSuggesting(true);
    try {
      const res = await fetch("/api/task-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        const { dueDate: d, priority: p } = await res.json();
        setDueDate(d);
        setPriority(p);
        toast.success("Suggestion applied!", {
          description: `Due: ${d}, Priority: ${p}`,
          style: { backgroundColor: "#16A34A", color: "white" },
        });
      } else {
        toast.error("AI suggestion failed", {
          description: "Please try again later.",
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      }
    } catch {
      toast.error("Network error during suggestion", {
        description: "Please check your connection and try again.",
        style: { backgroundColor: "#DC2626", color: "white" },
      });
    } finally {
      setSuggesting(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Title is required", {
        description: "Please enter a title for the task.",
        style: { backgroundColor: "#EAB308", color: "black" },
      });
      return;
    }
    if (!isLoaded || !isSignedIn || !user) {
      toast.warning("You must sign in to create tasks", {
        description: "Please sign in to continue.",
        style: { backgroundColor: "#EAB308", color: "black" },
      });
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status,
        createdAt: serverTimestamp(),
        ownerId: user.id,
      });
      toast.success("Task created!", {
        description: `"${title}" added to ${
          columns.find((c) => c.id === status)?.title
        }`,
        style: { backgroundColor: "#16A34A", color: "white" },
      });
      onSuccess();
    } catch {
      toast.error("Failed to save task", {
        description: "Please try again later.",
        style: { backgroundColor: "#DC2626", color: "white" },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving || suggesting}
          className="mt-1"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving || suggesting}
          className="mt-1"
        />
      </div>

      {/* AI Suggest */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={suggesting || !title.trim()}
        >
          {suggesting ? "Thinking…" : "Suggest Date & Priority"}
        </Button>
      </div>

      {/* Due Date */}
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={saving || suggesting}
          className="mt-1"
        />
      </div>

      {/* Priority */}
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priority}
          onValueChange={(v: "low" | "medium" | "high") => setPriority(v)}
          disabled={saving || suggesting}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Column selector */}
      <div>
        <Label htmlFor="column">Column</Label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v)}
          disabled={saving}
        >
          <SelectTrigger id="column">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                {col.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="secondary"
          onClick={onSuccess}
          disabled={saving || suggesting}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || suggesting}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
