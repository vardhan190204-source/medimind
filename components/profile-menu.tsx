"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

type ProfileMenuProps = {
  name: string;
  username: string;
};

export default function ProfileMenu({
  name,
  username,
}: ProfileMenuProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const text = await response.text();

        let message = "Unable to logout";

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

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to logout"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative p-6">
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
      >
        <User className="h-5 w-5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white p-2 shadow-lg">
          {/* User info */}
          <div className="border-b px-3 py-3">
            <p className="font-semibold">
              {name}
            </p>

            <p className="text-sm text-gray-500">
              @{username}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />

            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}

