import Link from "next/link";

import { ArrowUpRight, Boxes, MoreHorizontal } from "lucide-react";

import type { Project } from "@/types/project.types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/60"
    >
      {/* Decorative background */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-violet-100 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-lg shadow-zinc-900/20">
            <Boxes size={20} />
          </div>

          <button
            onClick={(event) => {
              event.preventDefault();
            }}
            className="rounded-lg p-2 text-zinc-400 opacity-0 transition hover:bg-zinc-100 hover:text-zinc-950 group-hover:opacity-100"
            aria-label="Project options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
            {project.name}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500">
            {project.description ||
              "A product workspace ready for feature intelligence."}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-5">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Active
          </div>

          <div className="flex items-center gap-1 text-sm font-medium text-zinc-950">
            Open
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
