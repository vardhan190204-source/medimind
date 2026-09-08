
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useCases } from "@/hooks/use-cases";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATUS_PRIORITY: Record<string, number> = {
  IN_PROGRESS: 1,
  OPEN: 2,
  COMPLETED: 3,
  ARCHIVED: 4,
};

type CaseItem = {
  id: string;
  title: string;
  patientAge: number | null;
  patientGender: string | null;
  status: string;
  createdAt: string;
};

export default function DashboardClient() {
  const queryClient = useQueryClient();

  const {
    data: cases = [],
    isLoading,
    isError,
  } = useCases();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return [...cases]
      .filter((item) => {
        const matchesSearch =
          !searchValue ||
          item.id.toLowerCase().includes(searchValue) ||
          item.title.toLowerCase().includes(searchValue);

        const matchesStatus =
          status === "ALL" ||
          item.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const statusDifference =
          (STATUS_PRIORITY[a.status] ?? 99) -
          (STATUS_PRIORITY[b.status] ?? 99);

        if (statusDifference !== 0) {
          return statusDifference;
        }

        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      });
  }, [cases, search, status]);

  async function handleDelete(caseId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this case? This action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeletingId(caseId);

    const response = await fetch(`/api/cases/${caseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const text = await response.text();

      let message = "Unable to delete case";

      if (text) {
        try {
          const data = JSON.parse(text);
          message = data.error || message;
        } catch {
          message = text;
        }
      }

      throw new Error(message);
    }

    await queryClient.invalidateQueries({
      queryKey: ["cases"],
    });
  } catch (error) {
    console.error("DELETE CASE ERROR:", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "Unable to delete case"
    );
  } finally {
    setDeletingId(null);
  }
}

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f6] p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-zinc-200" />

          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-zinc-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6]">
        <p className="text-zinc-500">
          Unable to load cases.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <header className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">
              Clinical workspace
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
              Cases
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Manage and review your clinical cases.
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-3xl font-semibold">
              {cases.length}
            </p>

            <p className="text-xs uppercase tracking-wider text-zinc-400">
              Total cases
            </p>
          </div>
        </header>

        {/* Filters */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search by case ID or title..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="h-12 rounded-xl bg-white sm:max-w-sm"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
          >
            <option value="ALL">
              All statuses
            </option>

            <option value="IN_PROGRESS">
              In progress
            </option>

            <option value="OPEN">
              Open
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </div>

        {/* Cases */}
        <section className="mt-6">
          {filteredCases.length === 0 ? (
            <EmptyState
              hasCases={cases.length > 0}
            />
          ) : (
            <div className="space-y-3">
              {filteredCases.map((item) => (
                <CaseRow
                  key={item.id}
                  item={item}
                  deleting={deletingId === item.id}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Floating Add */}
      <Link href="/dashboard/cases/new">
        <Button className="fixed bottom-8 right-8 h-14 rounded-full px-6 shadow-xl">
          <span className="mr-2 text-xl">
            +
          </span>

          New case
        </Button>
      </Link>
    </main>
  );
}

function CaseRow({
  item,
  deleting,
  onDelete,
}: {
  item: CaseItem;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200/80 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-lg">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_100px_110px_150px_auto]">

        {/* Case */}
        <Link
          href={`/dashboard/cases/${item.id}`}
          className="group min-w-0"
        >
          <p className="truncate text-xs font-mono text-zinc-400">
            {item.id}
          </p>

          <h2 className="mt-1 truncate font-semibold tracking-tight group-hover:underline">
            {item.title}
          </h2>
        </Link>

        {/* Age */}
        <div>
          <p className="text-xs text-zinc-400">
            Age
          </p>

          <p className="mt-1 text-sm font-medium">
            {item.patientAge ?? "—"}
          </p>
        </div>

        {/* Gender */}
        <div>
          <p className="text-xs text-zinc-400">
            Gender
          </p>

          <p className="mt-1 text-sm font-medium">
            {item.patientGender ?? "—"}
          </p>
        </div>

        {/* Status */}
        <div>
          <StatusBadge status={item.status} />

          <p className="mt-2 text-xs text-zinc-400">
            {new Date(
              item.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        {/* Delete */}
        <Button
          type="button"
          variant="outline"
          disabled={deleting}
          onClick={() => onDelete(item.id)}
          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>

      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const label =
    status === "IN_PROGRESS"
      ? "In progress"
      : status.charAt(0) +
        status.slice(1).toLowerCase();

  return (
    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium">
      <span className="mr-2">
        ●
      </span>

      {label}
    </span>
  );
}

function EmptyState({
  hasCases,
}: {
  hasCases: boolean;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-6 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-2xl text-white shadow-lg">
        +
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight">
        {hasCases
          ? "No matching cases"
          : "Your workspace is empty"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {hasCases
          ? "Try changing your search or status filter."
          : "Create your first clinical case to begin organizing patient information and medical documents."}
      </p>

      {!hasCases && (
        <Link
          href="/dashboard/cases/new"
          className="mt-6"
        >
          <Button className="rounded-xl">
            Create your first case
          </Button>
        </Link>
      )}
    </div>
  );
}

