"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Activity,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Database,
  Layers3,
  Loader2,
  Settings,
  Zap,
} from "lucide-react";

import { projectService } from "@/services/project.service";
import { useAuthStore } from "@/store/auth.store";

import type { Project } from "@/types/project.types";

interface ProjectDetailsProps {
  projectId: string;
}

const navigationItems = [
  {
    label: "Overview",
    description: "Project intelligence at a glance",
    href: "",
    icon: Activity,
  },
  {
    label: "Features",
    description: "Manage and track product features",
    href: "/features",
    icon: Layers3,
  },
  {
    label: "Events",
    description: "Explore product activity",
    href: "/events",
    icon: Zap,
  },
  {
    label: "Sources",
    description: "Configure event ingestion",
    href: "/sources",
    icon: Database,
  },
  {
    label: "Settings",
    description: "Project configuration",
    href: "/settings",
    icon: Settings,
  },
];

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const organization = useAuthStore((state) => state.organization);

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!organization?.id) {
      return;
    }

    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await projectService.getById(organization.id, projectId);

        setProject(data.project);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load this project.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [organization?.id, projectId]);

  /*
    Important:
    Wait for AuthInitializer to restore Zustand
    after a browser refresh.
  */
  if (!organization && isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={28} className="animate-spin text-zinc-400" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading project workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-zinc-950">
            Unable to load project
          </h2>

          <p className="mt-2 text-sm text-zinc-500">{error}</p>

          <Link
            href="/projects"
            className="mt-5 inline-flex rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Back to projects
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
      {/* Back navigation */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      {/* Project hero */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl shadow-zinc-900/15">
                  <Boxes size={26} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>

                    <span className="text-sm font-medium text-zinc-500">
                      {project.status === "ARCHIVED"
                        ? "Archived project"
                        : "Active project"}
                    </span>
                  </div>

                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                    {project.name}
                  </h1>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-500">
                {project.description ||
                  "This project is ready for feature intelligence and event-driven analytics."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Project Key
                </p>

                <p className="mt-2 font-mono text-sm font-medium text-zinc-700">
                  {project.slug}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence summary */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total features"
          value="—"
          description="Feature tracking begins here"
        />

        <SummaryCard
          label="Events tracked"
          value="—"
          description="Waiting for event sources"
        />

        <SummaryCard
          label="Event sources"
          value="—"
          description="No sources connected"
        />

        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
          <p className="text-sm font-medium text-zinc-500">
            Intelligence status
          </p>

          <div className="mt-3 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-violet-600" />

            <p className="font-semibold text-zinc-950">Ready to configure</p>
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            Connect features and events
          </p>
        </div>
      </section>

      {/* Workspace navigation */}
      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold text-zinc-950">
            Project workspace
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Manage everything related to this project.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const href = `/projects/${projectId}${item.href}`;

            return (
              <Link
                key={item.label}
                href={href}
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/60"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-zinc-950">
                      {item.label}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-950"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  description: string;
}

function SummaryCard({ label, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-400">{description}</p>
    </div>
  );
}
