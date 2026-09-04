import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Gauge,
  KeyRound,
  Layers3,
  Lock,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { Reveal } from "@/components/landing/reveal";

const FEATURES = [
  {
    icon: Layers3,
    title: "Feature catalog with a lifecycle",
    body: "Every feature moves through Draft → Active → Released → Archived with guarded state transitions, so your roadmap and reality never drift apart.",
  },
  {
    icon: Activity,
    title: "Event definitions",
    body: "Define the events that matter per project — a shared, versioned vocabulary your web, mobile and backend code all speak.",
  },
  {
    icon: Radio,
    title: "Typed event sources",
    body: "Register WEB, MOBILE or BACKEND sources per environment and see exactly where your product signal originates.",
  },
  {
    icon: KeyRound,
    title: "Hashed API keys",
    body: "Per-source keys are shown once, stored only as a hash, and revocable in a click. Prefixes stay visible for auditing.",
  },
  {
    icon: Gauge,
    title: "Instrumentation coverage",
    body: "A server-side aggregation shows how much of your feature catalog is actually wired to events — and which events go unused.",
  },
  {
    icon: BarChart3,
    title: "Weekly activity",
    body: "An 8-week time series of feature creation, computed with a single MongoDB aggregation pipeline. No warehouse required.",
  },
];

const STEPS = [
  {
    title: "Create an organization & project",
    body: "Multi-tenant from the first screen. Invite teammates with OWNER, ADMIN, MEMBER or VIEWER roles — every route is authorization-checked.",
  },
  {
    title: "Model features and events",
    body: "Add features, define the events they emit, and link them together. FeaturePulse tracks the mapping as first-class data.",
  },
  {
    title: "Watch coverage and activity",
    body: "The analytics overview turns raw catalog data into instrumentation coverage, status breakdowns and shipping cadence.",
  },
];

const FAQ = [
  {
    q: "Is this a full analytics warehouse?",
    a: "No — and that is deliberate. FeaturePulse focuses on feature intelligence: the catalog, its lifecycle, event definitions and how well they are instrumented. Metrics are computed with MongoDB aggregation pipelines, which keeps operational cost near zero.",
  },
  {
    q: "How does authentication work?",
    a: "JWT access and refresh tokens delivered as HTTP-only, Secure cookies with a double-submit CSRF token. Tokens are never stored in client-side JavaScript or local state.",
  },
  {
    q: "How is multi-tenancy enforced?",
    a: "Every resource is scoped to an organization and project. A membership-role middleware runs on each route, and services re-check ownership before touching the database.",
  },
  {
    q: "What does it cost to run?",
    a: "It is built to sit on free tiers: a serverless API, a managed MongoDB cluster and a static frontend. See the deployment guide in the repository for a full cost breakdown.",
  },
];

const AUDIENCE = [
  "Product engineers",
  "Platform teams",
  "Growth engineers",
  "Founding teams",
  "DX teams",
  "Solo builders",
];

export const metadata = {
  title: "FeaturePulse — Feature intelligence for engineering teams",
  description:
    "FeaturePulse is a multi-tenant feature intelligence platform: track feature lifecycle, define events, manage sources and API keys, and measure instrumentation coverage.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-aurora absolute -top-40 left-1/2 h-[520px] w-[min(820px,150vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_62%)] blur-3xl" />
        <div className="animate-aurora absolute right-0 top-[420px] h-[420px] w-[min(520px,90vw)] translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_60%)] blur-3xl [animation-delay:-6s]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
          }}
        />
      </div>

      <LandingHeader />

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
              <Sparkles size={13} className="text-violet-400" />
              Feature intelligence, without the data warehouse
            </div>

            <h1 className="animate-fade-up mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl [animation-delay:80ms]">
              Know exactly how your
              <span className="relative mx-2 inline-block">
                <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  features
                </span>
                <span className="absolute -inset-x-1 bottom-1 -z-10 h-3 rounded-full bg-violet-500/20 blur-md" />
              </span>
              are instrumented.
            </h1>

            <p className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg [animation-delay:160ms]">
              A multi-tenant platform for the feature lifecycle, event
              definitions, sources and API keys — with server-computed
              instrumentation coverage and shipping cadence.
            </p>

            <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]">
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Create your workspace
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 sm:w-auto"
              >
                Sign in
              </Link>
            </div>

            <p className="animate-fade-in mt-4 text-xs text-zinc-500 [animation-delay:320ms]">
              No credit card. Runs on free infrastructure tiers.
            </p>
          </div>

          {/* Product preview */}
          <Reveal className="mt-16 sm:mt-20" delay={80}>
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-x-0 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-violet-500/20 to-transparent blur-2xl" />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-3 text-xs text-zinc-500">
                    featurepulse · analytics / overview
                  </span>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-4 sm:p-6">
                  {[
                    { label: "Total features", value: "48" },
                    { label: "Instrumentation", value: "73%" },
                    { label: "Event definitions", value: "26" },
                    { label: "Active sources", value: "5" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-6 sm:px-6">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-300">
                        Features created / week
                      </p>
                      <span className="text-xs text-zinc-500">last 8 weeks</span>
                    </div>
                    <div className="mt-5 flex items-end gap-2.5">
                      {[24, 40, 32, 58, 46, 70, 52, 88].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-md bg-gradient-to-t from-violet-500/40 to-violet-400/80"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Audience marquee */}
        <section className="border-y border-white/10 bg-white/[0.02] py-6">
          <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-zinc-600">
            Built for teams who ship
          </p>
          <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
              {[...AUDIENCE, ...AUDIENCE].map((name, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap text-sm font-medium text-zinc-500"
                >
                  {name}
                </span>
              ))}
            </div>
            <div
              className="animate-marquee flex shrink-0 items-center gap-12 pr-12"
              aria-hidden="true"
            >
              {[...AUDIENCE, ...AUDIENCE].map((name, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap text-sm font-medium text-zinc-500"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything the feature lifecycle needs
            </h2>
            <p className="mt-4 text-zinc-400">
              Each capability below is backed by a real API module, validation
              layer and role-based authorization.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={i * 60}>
                  <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-violet-400/30 hover:bg-white/[0.05]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-transform group-hover:scale-105">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {feature.body}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-white/10 bg-white/[0.02] py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                From zero to coverage in three steps
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-white/10 bg-[#09090b] p-6">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-violet-300">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics highlight */}
        <section id="analytics" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Coverage is a metric, not a guess
              </h2>
              <p className="mt-4 text-zinc-400">
                FeaturePulse joins your feature catalog against the events linked
                to it and returns a single overview payload — computed entirely
                in the database.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Instrumented vs. uninstrumented features, with a coverage rate",
                  "Events linked to features vs. events defined but unused",
                  "Feature status breakdown and 30-day created / released counts",
                  "8-week feature-creation time series, zero-filled and ordered",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-300">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-300">
                    Instrumentation coverage
                  </span>
                  <span className="text-2xl font-semibold text-white">73%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[73%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { label: "Events linked", value: "19" },
                    { label: "Events unused", value: "7" },
                    { label: "Feature ↔ event links", value: "34" },
                    { label: "Avg events / feature", value: "1.9" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Security band */}
        <section className="border-y border-white/10 bg-white/[0.02] py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-3 sm:px-8">
            {[
              {
                icon: Lock,
                title: "HTTP-only cookie auth",
                body: "Access and refresh JWTs never touch client JavaScript.",
              },
              {
                icon: ShieldCheck,
                title: "Role-based access",
                body: "Membership roles enforced on every organization route.",
              },
              {
                icon: KeyRound,
                title: "Hashed secrets",
                body: "API keys stored as hashes; shown in full exactly once.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title}>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-white">
                  {item.q}
                  <span className="text-zinc-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-10 text-center sm:p-16">
              <div className="animate-aurora pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3),transparent_60%)] blur-2xl" />
              <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
                Start measuring feature coverage today
              </h2>
              <p className="relative mx-auto mt-4 max-w-lg text-zinc-400">
                Spin up an organization, add your first project and see your
                instrumentation coverage in minutes.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 sm:w-auto"
                >
                  Get started free
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 sm:w-auto"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
              FP
            </span>
            <span className="text-sm font-semibold text-white">FeaturePulse</span>
          </div>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} FeaturePulse. Built as a
            production-quality engineering portfolio project.
          </p>
          <div className="flex items-center gap-5 text-xs text-zinc-500">
            <Link href="/login" className="transition-colors hover:text-white">
              Sign in
            </Link>
            <Link href="/register" className="transition-colors hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
