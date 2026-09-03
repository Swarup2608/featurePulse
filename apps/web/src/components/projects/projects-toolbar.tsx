import { Grid2X2, List, Search } from "lucide-react";

interface ProjectsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ProjectsToolbar({
  search,
  onSearchChange,
}: ProjectsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects..."
          className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </div>

      <div className="flex rounded-xl border border-zinc-200 bg-white p-1">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950"
          aria-label="Grid view"
        >
          <Grid2X2 size={17} />
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:text-zinc-950"
          aria-label="List view"
        >
          <List size={17} />
        </button>
      </div>
    </div>
  );
}
