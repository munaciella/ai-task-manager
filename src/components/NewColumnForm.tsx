'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewColumnForm() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [title, setTitle]     = useState('');
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const q = query(
      collection(db, 'columns'),
      where('ownerId', '==', user.id),
      orderBy('position', 'asc')
    );
    return onSnapshot(q, snap => setPosition(snap.size));
  }, [isLoaded, isSignedIn, user]);

  const handleAdd = async () => {
    if (!title.trim() || !isSignedIn || !user) return;
    await addDoc(collection(db, 'columns'), {
      title:     title.trim(),
      position,
      ownerId:   user.id,
      createdAt: serverTimestamp(),
    });
    setTitle('');
  };

  return (
    <div className="flex space-x-2 items-center">
      <Input
        placeholder="New column name"
        className="max-w-xs"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button size="sm" onClick={handleAdd} disabled={!title.trim()}>
        Add Column
      </Button>
    </div>
  );
}
