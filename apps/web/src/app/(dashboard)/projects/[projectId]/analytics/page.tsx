"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { projectService } from "@/services/project.service";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import type { Project } from "@/types/project.types";

export default function AnalyticsPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organization?.id) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getById(organization.id, projectId);
        setProject(data.project);
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-zinc-950">
            Unable to load analytics
          </h2>
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

  return (
    <div className="mx-auto w-full max-w-7xl">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to project
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Project intelligence and metrics for {project.name}
        </p>
      </div>

      <section className="mt-8">
        <AnalyticsDashboard
          organizationId={organization!.id}
          projectId={projectId}
        />
      </section>
    </div>
  );
}
