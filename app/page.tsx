import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/login-form";
import { getSession } from "@/lib/auth";

import {
  HeroAnimation,
  FadeIn,
  FloatingCard,
  AnimatedPlus,
  PulseDot,
  HoverCard,
} from "@/components/home/home-animations";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f6] text-zinc-950">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-zinc-950
                text-sm font-bold text-white
                transition-transform duration-300
                group-hover:rotate-6
              "
            >
              M
            </div>

            <span className="text-xl font-semibold tracking-tight">
              MediMind
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-500 sm:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-zinc-950"
            >
              Features
            </Link>

            <Link
              href="/developers"
              className="transition-colors hover:text-zinc-950"
            >
              Developers
            </Link>

            <Link
              href="#about"
              className="transition-colors hover:text-zinc-950"
            >
              About
            </Link>
          </nav>

          <Link
            href="/register"
            className="
              rounded-full
              bg-zinc-950
              px-5 py-2.5
              text-sm font-medium
              text-white
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-zinc-800
              hover:shadow-lg
            "
          >
            Get started
          </Link>
        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section className="relative">
        {/* Background decoration */}
        <div
          className="
            pointer-events-none absolute
            left-1/2 top-20
            h-[500px] w-[500px]
            -translate-x-1/2
            rounded-full
            bg-white
            opacity-70
            blur-3xl
          "
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40 lg:pb-32 lg:pt-44">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* LEFT */}
            <div>
              <HeroAnimation>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm text-zinc-500 backdrop-blur">
                  <PulseDot />

                  <span>
                    Intelligent clinical workspace
                  </span>
                </div>
              </HeroAnimation>

              <HeroAnimation delay={0.1}>
                <h1
                  className="
                    max-w-2xl
                    text-5xl font-semibold
                    leading-[1.05]
                    tracking-[-0.05em]
                    sm:text-6xl
                    lg:text-7xl
                  "
                >
                  Think deeper.
                  <br />

                  <span className="text-zinc-400">
                    Understand better.
                  </span>
                </h1>
              </HeroAnimation>

              <HeroAnimation delay={0.2}>
                <p
                  className="
                    mt-7 max-w-xl
                    text-lg leading-8
                    text-zinc-500
                    sm:text-xl
                  "
                >
                  Organize clinical cases, patient information
                  and medical documents in one intelligent
                  workspace built for better clinical reasoning.
                </p>
              </HeroAnimation>

              <HeroAnimation delay={0.3}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href="/register"
                    className="
                      rounded-full
                      bg-zinc-950
                      px-6 py-3.5
                      text-sm font-medium
                      text-white
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:bg-zinc-800
                      hover:shadow-xl
                    "
                  >
                    Create your workspace
                  </Link>

                  <Link
                    href="#features"
                    className="
                      rounded-full
                      border border-zinc-200
                      bg-white/70
                      px-6 py-3.5
                      text-sm font-medium
                      text-zinc-700
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-zinc-300
                      hover:bg-white
                    "
                  >
                    Explore MediMind
                  </Link>
                </div>
              </HeroAnimation>

              <HeroAnimation delay={0.4}>
                <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
                  <span>Clinical cases</span>
                  <span>•</span>
                  <span>Medical documents</span>
                  <span>•</span>
                  <span>AI-assisted analysis</span>
                </div>
              </HeroAnimation>
            </div>

            {/* RIGHT — PRODUCT PREVIEW */}
            <HeroAnimation delay={0.25}>
              <FloatingCard>
                <div className="relative">
                  {/* Main window */}
                  <div
                    className="
                      rounded-[2rem]
                      border border-zinc-200
                      bg-white
                      p-4
                      shadow-[0_30px_100px_rgba(0,0,0,0.10)]
                      sm:p-6
                    "
                  >
                    {/* Window header */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                      </div>

                      <div className="text-xs text-zinc-400">
                        MediMind
                      </div>
                    </div>

                    {/* Case heading */}
                    <div className="rounded-2xl bg-[#f7f8f6] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                            Clinical Case
                          </p>

                          <h3 className="mt-2 text-lg font-semibold">
                            Persistent Chest Pain
                          </h3>

                          <p className="mt-1 text-sm text-zinc-400">
                            Patient · 42 years
                          </p>
                        </div>

                        <AnimatedPlus />
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Symptoms
                        </span>

                        <span className="text-xs text-zinc-400">
                          4 recorded
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[
                          "Chest pain",
                          "Fatigue",
                          "Shortness of breath",
                          "Dizziness",
                        ].map((symptom) => (
                          <span
                            key={symptom}
                            className="
                              rounded-full
                              bg-zinc-100
                              px-3 py-1.5
                              text-xs text-zinc-500
                            "
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI analysis */}
                    <div
                      className="
                        mt-5 rounded-2xl
                        border border-zinc-200
                        bg-white
                        p-5
                      "
                    >
                      <div className="flex items-center gap-2">
                        <PulseDot />

                        <span className="text-sm font-medium">
                          AI analysis
                        </span>

                        <span className="ml-auto text-xs text-zinc-400">
                          Ready
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded-full bg-zinc-100" />
                        <div className="h-2 w-4/5 rounded-full bg-zinc-100" />
                        <div className="h-2 w-3/5 rounded-full bg-zinc-100" />
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-xs text-zinc-400">
                        Updated moments ago
                      </div>

                      <div className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white">
                        View case
                      </div>
                    </div>
                  </div>

                  {/* Floating AI badge */}
                  <div
                    className="
                      absolute -bottom-5 -left-5
                      hidden rounded-2xl
                      border border-zinc-200
                      bg-white
                      px-4 py-3
                      shadow-xl
                      sm:block
                    "
                  >
                    <div className="flex items-center gap-3">
                      <PulseDot />

                      <div>
                        <p className="text-xs font-medium">
                          Analysis ready
                        </p>

                        <p className="mt-0.5 text-[11px] text-zinc-400">
                          Clinical reasoning support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </HeroAnimation>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section
        id="features"
        className="border-t border-zinc-200/70 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                What MediMind does
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Everything around the case.
              </h2>

              <p className="mt-5 text-lg leading-8 text-zinc-500">
                Keep your clinical information organized and
                make the reasoning process easier to follow.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {/* Feature 1 */}
            <FadeIn delay={0.05}>
              <HoverCard className="h-full">
                <div
                  className="
                    h-full rounded-3xl
                    border border-zinc-200
                    bg-[#f7f8f6]
                    p-7
                  "
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    +
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    Organize cases
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    Keep patient information, symptoms,
                    clinical notes and medical documents
                    together in one place.
                  </p>
                </div>
              </HoverCard>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn delay={0.12}>
              <HoverCard className="h-full">
                <div
                  className="
                    h-full rounded-3xl
                    border border-zinc-200
                    bg-[#f7f8f6]
                    p-7
                  "
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <PulseDot />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    AI-assisted reasoning
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    Use AI to explore clinical information
                    and generate structured analysis to
                    support your reasoning.
                  </p>
                </div>
              </HoverCard>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn delay={0.19}>
              <HoverCard className="h-full">
                <div
                  className="
                    h-full rounded-3xl
                    border border-zinc-200
                    bg-[#f7f8f6]
                    p-7
                  "
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold shadow-sm">
                    AI
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    Learn from every case
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    Turn individual cases into a clearer,
                    more organized clinical learning
                    experience.
                  </p>
                </div>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT / WORKFLOW
      ========================== */}
      <section
        id="about"
        className="bg-[#f7f8f6]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <FadeIn>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                  A simpler workflow
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  From information
                  <br />
                  to understanding.
                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-500">
                  Add a case, collect the relevant information,
                  analyze the evidence and review the reasoning
                  in one continuous workspace.
                </p>

                <Link
                  href="/register"
                  className="
                    mt-8 inline-flex
                    rounded-full
                    bg-zinc-950
                    px-6 py-3.5
                    text-sm font-medium
                    text-white
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:bg-zinc-800
                    hover:shadow-xl
                  "
                >
                  Start with a case
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-4">
                {[
                  {
                    number: "01",
                    title: "Create a case",
                    description:
                      "Enter the basic patient and clinical information.",
                  },
                  {
                    number: "02",
                    title: "Add evidence",
                    description:
                      "Attach clinical notes and relevant medical documents.",
                  },
                  {
                    number: "03",
                    title: "Analyze",
                    description:
                      "Use AI-assisted analysis to explore the case.",
                  },
                  {
                    number: "04",
                    title: "Review",
                    description:
                      "Understand the generated reasoning and findings.",
                  },
                ].map((item) => (
                  <HoverCard key={item.number}>
                    <div
                      className="
                        flex items-center gap-5
                        rounded-2xl
                        border border-zinc-200
                        bg-white
                        p-5
                      "
                    >
                      <div
                        className="
                          flex h-11 w-11 shrink-0
                          items-center justify-center
                          rounded-xl
                          bg-[#f7f8f6]
                          text-xs font-semibold
                          text-zinc-400
                        "
                      >
                        {item.number}
                      </div>

                      <div>
                        <h3 className="font-medium">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </HoverCard>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =========================
          DEVELOPERS CTA
      ========================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <FadeIn>
            <div
              className="
                relative overflow-hidden
                rounded-[2rem]
                bg-zinc-950
                px-7 py-12
                text-white
                sm:px-12 sm:py-16
              "
            >
              {/* Decoration */}
              <div
                className="
                  pointer-events-none absolute
                  -right-24 -top-24
                  h-64 w-64
                  rounded-full
                  bg-white/[0.04]
                  blur-2xl
                "
              />

              <div
                className="
                  pointer-events-none absolute
                  -bottom-32 -left-20
                  h-72 w-72
                  rounded-full
                  bg-white/[0.03]
                  blur-3xl
                "
              />

              <div className="relative flex flex-col justify-between gap-10 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Built by people
                  </p>

                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    Meet the people
                    <br />
                    behind MediMind.
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
                    MediMind is a project built by a team
                    exploring the intersection of technology,
                    healthcare and intelligent systems.
                  </p>
                </div>

                <Link
                  href="/developers"
                  className="
                    shrink-0 rounded-full
                    bg-white
                    px-6 py-3.5
                    text-sm font-medium
                    text-zinc-950
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:bg-zinc-100
                    hover:shadow-xl
                  "
                >
                  Meet the developers →
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =========================
          LOGIN
      ========================== */}
      <section
        id="login"
        className="border-t border-zinc-200/70 bg-[#f7f8f6]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Login intro */}
            <FadeIn>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Your workspace
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Ready when
                  <br />
                  you are.
                </h2>

                <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-500">
                  Sign in to continue working with your
                  clinical cases and analysis.
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm text-zinc-400">
                  <PulseDot />

                  <span>
                    Your workspace is waiting
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Login card */}
            <FadeIn delay={0.15}>
              <div className="mx-auto w-full max-w-md">
                <div
                  className="
                    rounded-[2rem]
                    border border-zinc-200
                    bg-white
                    p-7
                    shadow-[0_20px_70px_rgba(0,0,0,0.06)]
                    sm:p-8
                  "
                >
                  <div className="mb-8">
                    <p className="mb-2 text-sm font-medium text-zinc-400">
                      Welcome back
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight">
                      Sign in
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Enter your credentials to access
                      MediMind.
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

                <p className="mt-5 text-center text-xs text-zinc-400">
                  MediMind Clinical Workspace
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
              M
            </div>

            <span className="text-sm font-medium">
              MediMind
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400">
            <Link
              href="/developers"
              className="transition-colors hover:text-zinc-950"
            >
              Developers
            </Link>

            <Link
              href="/register"
              className="transition-colors hover:text-zinc-950"
            >
              Get started
            </Link>

            <span>© {new Date().getFullYear()} MediMind</span>
          </div>
        </div>
      </footer>
    </main>
  );
}