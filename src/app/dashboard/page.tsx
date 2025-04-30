import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized – please sign in.");
  }

  const name = user.firstName ?? "Task Manager User";
  return <DashboardClient userName={name} />;
}
