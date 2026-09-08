import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import ProfileMenu from "@/components/profile-menu";
import DashboardClient from "./dashboard-client";
export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      name: true,
      username: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold p-6">
          MediMind
        </h1>

        <ProfileMenu
          name={user.name}
          username={user.username}
        />
      </header>
      <DashboardClient/>
      {/* rest of dashboard */}
    </div>
  );
}