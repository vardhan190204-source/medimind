import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] px-6 py-12">

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">

        <div className="w-full">

          <Link
            href="/"
            className="mb-10 block text-xl font-semibold tracking-tight"
          >
            MediMind
          </Link>

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">

            <div className="mb-8">
              <p className="mb-2 text-sm text-zinc-400">
                Get started
              </p>

              <h1 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Create your private MediMind workspace.
              </p>
            </div>

            <RegisterForm/>

            <div className="my-6 h-px bg-zinc-100" />

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-medium text-zinc-950 hover:underline"
              >
                Sign in
              </Link>
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}