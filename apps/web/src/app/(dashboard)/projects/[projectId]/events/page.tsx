"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { projectService } from "@/lib/api/project.service";
import { EventsList } from "@/components/events/events-list";
import { CreateEventDialog } from "@/components/events/create-event-dialog";
import type { Project } from "@/types/project.types";

export default function EventsPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!organization?.id) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getProjectById(organization.id, projectId);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [organization?.id, projectId]);

  if (!organization && authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={28} className="animate-spin text-zinc-400" />
          <p className="mt-4 text-sm text-zinc-500">Restoring session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-zinc-950">Unable to load project</h2>
          <p className="mt-2 text-sm text-zinc-500">{error}</p>
          <Link
            href={`/projects/${projectId}`}
            className="mt-5 inline-flex rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to project
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Events
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage all events for {project.name}
          </p>
        </div>
        <CreateEventDialog
          organizationId={organization!.id}
          projectId={projectId}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      <section className="mt-8">
        <EventsList
          key={refreshKey}
          organizationId={organization!.id}
          projectId={projectId}
        />
      </section>
    </div>
  );
}
