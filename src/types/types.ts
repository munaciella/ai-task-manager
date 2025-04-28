import type { Timestamp } from 'firebase/firestore';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority?: 'low' | 'medium' | 'high';
  status: string;
  ownerId?: string;
  createdAt?: Timestamp;
}

export interface Column {
  id: string;
  title: string;
}
