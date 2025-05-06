'use client';

import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  UsersIcon,
  ZapIcon,
  MoveHorizontalIcon,
  ColumnsIcon,
  DatabaseIcon,
  MoonIcon,
} from 'lucide-react';

const features = [
  {
    name: 'Real-time Collaboration',
    description:
      'Work together with your team, see changes instantly, no refresh needed.',
    icon: UsersIcon,
  },
  {
    name: 'AI-Powered Suggestions',
    description:
      'Let AI propose due dates and priorities so you stay on track automatically.',
    icon: ZapIcon,
  },
  {
    name: 'Drag & Drop Kanban',
    description:
      'Organise tasks visually with Trello-style boards and intuitive drag-and-drop.',
    icon: MoveHorizontalIcon,
  },
  {
    name: 'Custom Columns & Filters',
    description:
      'Create, rename, or delete columns and filter tasks by priority or date.',
    icon: ColumnsIcon,
  },
  {
    name: 'Persistent Database Storage',
    description:
      'All your data is saved and synced in real-time, so you never lose a task.',
    icon: DatabaseIcon,
  },
  {
    name: 'Dark & Light Themes',
    description:
      'Switch between dark and light modes for maximum comfort in any setting.',
    icon: MoonIcon,
  },
];

export default function Home() {
  const { isSignedIn } = useAuth();

  const handleClick = () => {
    if (isSignedIn) {
      toast.info('Redirecting to dashboard...', {
        style: { backgroundColor: '#2563EB', color: 'white' },
      });
    } else {
      toast.warning('You need to be signed in to get started.', {
        description: 'Redirecting to sign in page...',
        style: { backgroundColor: '#EAB308', color: 'black' },
      });
      localStorage.setItem('showSignInToast', 'true');
    }
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 600);
  };

  return (
    <main className="flex-1 overflow-scroll text-foreground">
      <div className="py-4 md:py-10 rounded-md shadow-lg">
      <div className="absolute top-5 right-5"></div>

<div className="flex flex-col items-center mx-auto max-w-7xl px-6 lg:px-8">
  <div className="mx-auto max-w-2xl text-center space-y-6 px-6 lg:px-8">
    <p
      role="alert"
      className="inline-block bg-red-100 dark:bg-red-900 px-4 py-2 rounded-md text-red-700 dark:text-red-300 font-medium text-md"
    >
      <span className="mr-1">⚠️</span>
      <strong>Demo Notice:</strong>{" "}
      <span className="font-light">
        This live demo is provided solely for testing and development
        purposes. Functionality may be limited, unstable, or subject to
        sudden service restrictions. Use at your own risk;
        production-grade reliability is not guaranteed.
      </span>
    </p>

          <h2 className="text-lg font-semibold leading-7 mt-6">
            AI Task Manager
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Organise & Automate Your Workflow
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Create, prioritise, and collaborate on tasks in real time, powered by
            AI. Whether you&apos;re a team or an individual, our tool adapts to your
            needs, making task management effortless and efficient.
          </p>
          </div>

          <Button
            onClick={handleClick}
            className="mt-10 px-6 py-4 text-lg cursor-pointer"
          >
            Get Started
          </Button>
        </div>

        {/* Features grid */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 text-base text-gray-600 dark:text-gray-300">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-10">
                <feature.icon className="absolute left-0 top-1 h-6 w-6" />
                <dt className="font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </dt>
                <dd className="mt-2">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
