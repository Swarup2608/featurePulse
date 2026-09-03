"use client";

import { useMemo, useState } from "react";

import { FolderKanban } from "lucide-react";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsToolbar } from "@/components/projects/projects-toolbar";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

import type { Project } from "@/types/project.types";

/*
  Temporary data.

  We will replace this with projectService.getAll()
  when connecting the selected organization.
*/
const temporaryProjects: Project[] = [
  {
    id: "1",
    name: "FeaturePulse",
    key: "FP",
    description: "Feature intelligence and product analytics platform.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mobile Platform",
    key: "MOBILE",
    description: "Customer-facing mobile application and feature ecosystem.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Developer Portal",
    key: "DEV",
    description: "Tools, APIs, and developer experience infrastructure.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const projects = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return temporaryProjects;
    }

    return temporaryProjects.filter((project) =>
      [project.name, project.description, project.key]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }, [search]);

  const handleCreateProject = async (data: {
    name: string;
    description: string;
  }) => {
    console.log("Creating project:", data);
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <ProjectsHeader onCreateProject={() => setIsCreateDialogOpen(true)} />

      {/* Project Intelligence Summary */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Total projects</p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            {temporaryProjects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">
            Active environments
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            {temporaryProjects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <p className="text-sm font-medium text-zinc-500">
            Ready for insights
          </p>

          <p className="mt-3 text-lg font-semibold tracking-tight text-zinc-950">
            Connect an event source
          </p>
        </div>
      </div>

      <div className="mt-10">
        <ProjectsToolbar search={search} onSearchChange={setSearch} />
      </div>

      {projects.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
            <FolderKanban size={24} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">No projects found</h2>

          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            We couldn't find any projects matching your search.
          </p>
        </div>
      )}

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
