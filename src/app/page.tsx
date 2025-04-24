import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">AI Task Manager</h1>
      <Button variant='destructive' className="mt-4">
        Get Started
      </Button>
    </main>
  )
}
