"use client";

import { useQuery } from "@tanstack/react-query";

import type { Case } from "@/types/case";

export function useCases() {
  return useQuery<Case[]>({
    queryKey: ["cases"],

    queryFn: async () => {
      const response = await fetch(
        "/api/cases"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch cases"
        );
      }

      return response.json();
    },
  });
}             

async function fetchCase(id: string) {
  const response = await fetch(`/api/cases/${id}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error || "Unable to fetch case"
    );
  }

  return response.json();
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ["case", id],
    queryFn: () => fetchCase(id),
    enabled: Boolean(id),
  });
}