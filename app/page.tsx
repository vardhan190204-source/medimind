
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/login-form";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-16 lg:grid-cols-2">

          {/* Brand */}
          <section className="hidden flex-col justify-center lg:flex">
            <div className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  M
                </div>

                <span className="text-xl font-semibold tracking-tight">
                  Medi-Mind
                </span>
              </div>

              <h1 className="max-w-xl text-6xl font-semibold tracking-[-0.05em]">
                Clinical thinking,
                <br />

                <span className="text-zinc-400">
                  made intelligent.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-500">
                Organize clinical cases, patient information and
                medical documents in one intelligent workspace.
              </p>
            </div>

            <div className="flex gap-3 text-sm text-zinc-400">
              <span>Secure workspace</span>
              <span>•</span>
              <span>Clinical cases</span>
              <span>•</span>
              <span>AI-ready</span>
            </div>
          </section>

          {/* Login */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-md">

              <div className="mb-8 lg:hidden">
                <div className="text-2xl font-semibold">
                  MediMind
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">

                <div className="mb-8">
                  <p className="mb-2 text-sm font-medium text-zinc-400">
                    Welcome back
                  </p>

                  <h2 className="text-3xl font-semibold tracking-tight">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    Enter your credentials to access MediMind.
                  </p>
                </div>

                <LoginForm />

                <div className="my-6 h-px bg-zinc-100" />

                <p className="text-center text-sm text-zinc-500">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-zinc-950 hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-zinc-400">
                MediMind Clinical Workspace
              </p>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

