"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const router = useRouter();

  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      username: string;
      password: string;
      confirmPassword: string;
    }) => {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.fieldErrors?.username?.[0] ?? result.error ?? "Something went wrong");
      }

      return result;
    },

    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },

    onError: (error) => {
      setError(error.message);
    },
  });

  function handleSubmit( event:  React.SubmitEvent<HTMLFormElement>) 
  {
    event.preventDefault();

    setError("");

    const formData = new FormData(
      event.currentTarget
    );

    mutation.mutate({
      name: String(formData.get("name")),
      username: String(
        formData.get("username")
      ),
      password: String(
        formData.get("password")
      ),
      confirmPassword: String(
        formData.get("confirmPassword")
      ),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Full name
        </Label>

        <Input
          id="name"
          name="name"
          placeholder="Your full name"
          required
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">
          Username
        </Label>

        <Input
          id="username"
          name="username"
          placeholder="Username"
          required
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm password
        </Label>

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          className="h-12 rounded-xl"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="h-12 w-full rounded-xl"
      >
        {mutation.isPending
          ? "Creating account..."
          : "Create account"}
      </Button>
    </form>
  );
}