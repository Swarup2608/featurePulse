export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>

        <p className="mt-2 text-sm text-zinc-500">
          Monitor how your product features are performing.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-500">Total Features</p>

          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-500">Active Events</p>

          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-500">Event Sources</p>

          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-500">Events Recorded</p>

          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Getting Started</h2>

        <p className="mt-2 text-sm text-zinc-500">
          Create a project, define features, and connect an event source to
          start tracking product usage.
        </p>
      </div>
    </div>
  );
}
