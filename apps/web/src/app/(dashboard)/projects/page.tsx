"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FolderKanban, Loader2, RefreshCw } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsToolbar } from "@/components/projects/projects-toolbar";
import { ApiError } from "@/lib/api/api-error";
import { projectService } from "@/lib/api/project.service";
import { useAuthStore } from "@/store/auth.store";
import type { CreateProjectInput, Project } from "@/types/project.types";

export default function ProjectsPage() {
  const organization = useAuthStore((state) => state.organization);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadProjects = async () => {
    if (!organization?.id) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectService.getProjects(organization.id);
      setProjects(response.projects);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load projects. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, [organization?.id]);

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return projects;
    }
    return projects.filter((project) =>
      [project.name, project.description, project.slug]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }, [projects, search]);

  const handleCreateProject = async (data: CreateProjectInput) => {
    if (!organization?.id) {
      return;
    }
    try {
      const project = await projectService.createProject(organization.id, data);
      setProjects((currentProjects) => [project, ...currentProjects]);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Unable to create project. Please try again.");
    }
  };

  if (isLoading) {
    return <ProjectsLoadingState />;
  }

  if (error) {
    return <ProjectsErrorState message={error} onRetry={loadProjects} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <ProjectsHeader onCreateProject={() => setIsCreateDialogOpen(true)} />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Total projects</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            {projects.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-500">Active projects</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            {projects.filter((project) => project.status === "ACTIVE").length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <p className="text-sm font-medium text-zinc-500">
            Ready for insights
          </p>
          <p className="mt-3 text-lg font-semibold tracking-tight text-zinc-950">
            {projects.length > 0
              ? "Connect an event source"
              : "Create your first project"}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <ProjectsToolbar search={search} onSearchChange={setSearch} />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <ProjectsEmptyState
          hasProjects={projects.length > 0}
          onCreateProject={() => setIsCreateDialogOpen(true)}
        />
      )}

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}

function ProjectsLoadingState() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={28} className="animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading your projects...</p>
        </div>
      </div>
    </div>
  );
}

function ProjectsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center">
      <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertCircle size={26} />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-zinc-950">
          Unable to load projects
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
}

function ProjectsEmptyState({
  hasProjects,
  onCreateProject,
}: {
  hasProjects: boolean;
  onCreateProject: () => void;
}) {
  return (
    <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
        <FolderKanban size={24} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-zinc-950">
        {hasProjects ? "No matching projects" : "No projects yet"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        {hasProjects
          ? "Try adjusting your search to find the project you're looking for."
          : "Create your first project and start tracking how users interact with your product."}
      </p>
      {!hasProjects && (
        <button
          type="button"
          onClick={onCreateProject}
          className="mt-6 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Create your first project
        </button>
      )}
    </div>
  );
}
