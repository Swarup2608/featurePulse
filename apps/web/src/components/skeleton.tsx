import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-zinc-200", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
