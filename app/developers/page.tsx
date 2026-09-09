import type { Metadata } from "next";

import { developers } from "@/data/developer";
import { DeveloperCard } from "@/components/developers/developer-card";

export const metadata: Metadata = {
  title: "Developers",
  description: "Meet the team behind MediMind.",
};

export default function DevelopersPage() {
  /*
   * Leader first.
   * Everyone else keeps their existing order.
   */
  const sortedDevelopers = [...developers].sort((a, b) => {
    if (a.role === "Team Leader") return -1;
    if (b.role === "Team Leader") return 1;

    return 0;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="
              text-sm font-medium
              uppercase tracking-[0.2em]
              text-primary
            "
          >
            Meet the team
          </p>

          <h1
            className="
              mt-4
              text-4xl font-bold
              tracking-tight
              sm:text-5xl
            "
          >
            The people behind MediMind
          </h1>

          <p
            className="
              mx-auto mt-5
              max-w-xl
              text-base leading-7
              text-muted-foreground
            "
          >
            MediMind is built by a team of people who believe technology
            can make medical learning and clinical case analysis better.
          </p>
        </div>
      </section>

      {/* Everyone together */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {sortedDevelopers.map((developer) => (
            <DeveloperCard
              key={developer.name}
              developer={developer}
              isLeader={developer.role === "Team Leader"}
            />
          ))}
        </div>
      </section>
    </main>
  );
}