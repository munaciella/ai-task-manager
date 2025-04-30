"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface NewTaskFormProps {
  onSuccess: () => void;
}

export default function NewTaskForm({ onSuccess }: NewTaskFormProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggest = async () => {
    if (!title.trim()) {
      toast.warning('Enter a title first', {
        description: 'AI needs a title to suggest a due date & priority',
        style: { backgroundColor: "#EAB308", color: "black"}
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
          description: `Due date: ${d}, Priority: ${p}`,
          style: { backgroundColor: "#16A34A", color: "white"}
        });
      } else {
        const errText = await res.text();
        console.error('Suggest failed', errText);
        toast.error('Failed to get suggestion', {
          description: 'Please try again.',
          style: { backgroundColor: "#DC2626", color: "white"}
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error during suggestion', {
        description: 'Please try again.',
        style: { backgroundColor: "#DC2626", color: "white"}
      });
    } finally {
      setSuggesting(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning('Title is required');
      return;
    }
    if (!isLoaded || !isSignedIn || !user) {
      toast.warning('You need to be signed in to save tasks', {
        description: 'Redirecting to sign-in…',
        style: { backgroundColor: "#EAB308", color: "black"}
      });
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title:       title.trim(),
        description: description.trim(),
        dueDate:     dueDate ? new Date(dueDate) : null,
        priority,
        status:      'todo',
        createdAt:   serverTimestamp(),
        ownerId:     user.id,
      });
      toast.success('Task created!', {
        description: 'Your new task has been saved.',
        style: { backgroundColor: "#16A34A", color: "white"}
      });
      onSuccess();
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Failed to save task', {
        description: 'Please try again.',
        style: { backgroundColor: "#DC2626", color: "white"}
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome task"
          disabled={saving || suggesting}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more context…"
          disabled={saving || suggesting}
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

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={saving || suggesting}
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priority}
          onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}
          disabled={saving || suggesting}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="secondary"
          onClick={onSuccess}
          disabled={saving || suggesting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !isSignedIn || suggesting || !title.trim()}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
