import { Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

export function ProjectsHeader({ onCreateProject }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-500" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Workspace
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Projects
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
          Create and organize the products you want to understand through
          FeaturePulse.
        </p>
      </div>

      <button
        onClick={onCreateProject}
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl"
      >
        <Plus
          size={18}
          className="transition-transform group-hover:rotate-90"
        />
        New Project
      </button>
    </div>
  );
}
