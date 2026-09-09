import type { Developer } from "@/data/developer";

interface DeveloperCardProps {
  developer: Developer;
  isLeader?: boolean;
}

export function DeveloperCard({
  developer,
  isLeader = false,
}: DeveloperCardProps) {
  const initials = developer.name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article
      className={`
        group relative flex flex-col items-center
        rounded-3xl border
        px-6 py-8 text-center
        transition-all duration-300
        hover:-translate-y-1
        ${
          isLeader
            ? `
              border-primary/30
              bg-primary/[0.04]
              shadow-lg shadow-primary/5
            `
            : `
              border-border/60
              bg-card
              hover:border-primary/20
              hover:shadow-lg
            `
        }
      `}
    >
      {/* Small leader indicator */}
      {isLeader && (
        <div
          className="
            absolute right-4 top-4
            rounded-full
            bg-primary/10
            px-3 py-1
            text-xs font-medium
            text-primary
          "
        >
          ★ Leader
        </div>
      )}

      {/* Circular image */}
      <div
        className={`
          relative
          h-32 w-32
          overflow-hidden
          rounded-full
          border-4
          transition-transform duration-300
          group-hover:scale-105
          ${
            isLeader
              ? "border-primary/40 shadow-lg shadow-primary/10"
              : "border-border"
          }
        `}
      >
        {developer.imageUrl ? (
          /*
           * Use <img>, not next/image.
           * This allows animated GIF URLs to keep playing.
           */
          <img
            src={developer.imageUrl}
            alt={developer.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="
              flex h-full w-full
              items-center justify-center
              bg-muted
              text-2xl font-semibold
              text-muted-foreground
            "
          >
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <h2
        className="
          mt-5
          text-lg font-semibold
          tracking-tight
        "
      >
        {developer.name}
      </h2>

      {/* Course */}
      <p
        className="
          mt-1
          text-sm
          text-muted-foreground
        "
      >
        {developer.course}
      </p>

      {/* Role */}
      <div className="mt-4">
        <span
          className={`
            inline-flex
            rounded-full
            px-3 py-1
            text-xs font-medium
            ${
              isLeader
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          {isLeader ? "Team Leader" : "Team Member"}
        </span>
      </div>
    </article>
  );
}