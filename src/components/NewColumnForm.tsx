"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewColumnForm() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const q = query(
      collection(db, "columns"),
      where("ownerId", "==", user.id),
      orderBy("position", "asc")
    );
    return onSnapshot(q, (snap) => setPosition(snap.size));
  }, [isLoaded, isSignedIn, user]);

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.warning("Column name cannot be empty", {
        description: "Please enter a valid column name.",
        style: { backgroundColor: "#EAB308", color: "black" },
      });
      return;
    }
    if (!isLoaded || !isSignedIn || !user) {
      toast.error("You must be signed in to add a column", {
        description: "Please sign in to create a new column.",
        style: { backgroundColor: "#DC2626", color: "white" },
      });
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "columns"), {
        title: title.trim(),
        position,
        ownerId: user.id,
        createdAt: serverTimestamp(),
      });
      toast.success("Column created", {
        description: "Your new column has been created successfully.",
        style: { backgroundColor: "#16A34A", color: "white" },
      });
      setTitle("");
    } catch (err) {
      console.error("Failed to add column", err);
      toast.error("Failed to create column", {
        description: "Please try again later.",
        style: { backgroundColor: "#DC2626", color: "white" },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex flex-col         
        space-y-2             
        md:flex-row           
        md:space-y-0          
        md:space-x-2          
        items-start           
        md:items-center
        p-2"
    >
      <Input
        placeholder="New column name"
        className="max-w-xs w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={saving}
      />
      <Button
        size="sm"
        onClick={handleAdd}
        disabled={!title.trim() || saving}
        className="w-full md:w-auto"
      >
        {saving ? "Adding…" : "Add Column"}
      </Button>
    </div>
  );
}
