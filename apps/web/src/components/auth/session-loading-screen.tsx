export function SessionLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 shadow-xl">
          <div className="h-5 w-5 animate-pulse rounded-md border-2 border-white" />
        </div>

        <div className="space-y-1 text-center">
          <p className="font-semibold text-zinc-900">FeaturePulse</p>

          <p className="text-sm text-zinc-500">Preparing your workspace...</p>
        </div>
      </div>
    </div>
  );
}
