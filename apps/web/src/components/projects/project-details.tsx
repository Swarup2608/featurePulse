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
  TrendingUp,
  Zap,
} from "lucide-react";

import { projectService } from "@/services/project.service";
import { featureService } from "@/lib/api/feature.service";
import { eventService } from "@/lib/api/event.service";
import { eventSourceService } from "@/lib/api/event-source.service";
import { useAuthStore } from "@/store/auth.store";

import type { Project } from "@/types/project.types";

interface ProjectDetailsProps {
  projectId: string;
}

const tabs = [
  { label: "Overview", icon: Activity },
  { label: "Features", icon: Layers3 },
  { label: "Events", icon: Zap },
  { label: "Sources", icon: Database },
  { label: "Analytics", icon: TrendingUp },
  { label: "Settings", icon: Settings },
];

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const organization = useAuthStore((state) => state.organization);

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [featureCount, setFeatureCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [sourceCount, setSourceCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);

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

  useEffect(() => {
    if (!organization?.id || activeTab === "Settings") {
      return;
    }

    const loadStats = async () => {
      try {
        setStatsLoading(true);

        if (activeTab === "Overview") {
          const [features, events, sources] = await Promise.all([
            featureService
              .getFeatures(organization.id, projectId, 1, 1)
              .then((r) => r.pagination.total),
            eventService
              .getEvents(organization.id, projectId, 1, 1)
              .then((r) => r.pagination.total),
            eventSourceService
              .getEventSources(organization.id, projectId, 1, 1)
              .then((r) => r.pagination.total),
          ]);
          setFeatureCount(features);
          setEventCount(events);
          setSourceCount(sources);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [organization?.id, projectId, activeTab]);

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
      {activeTab === "Overview" && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total features"
            value={statsLoading ? "—" : featureCount.toString()}
            description={
              featureCount === 0
                ? "Feature tracking begins here"
                : `${featureCount} features defined`
            }
          />

          <SummaryCard
            label="Events tracked"
            value={statsLoading ? "—" : eventCount.toString()}
            description={
              eventCount === 0
                ? "Waiting for event sources"
                : `${eventCount} events defined`
            }
          />

          <SummaryCard
            label="Event sources"
            value={statsLoading ? "—" : sourceCount.toString()}
            description={
              sourceCount === 0
                ? "No sources connected"
                : `${sourceCount} sources active`
            }
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
      )}

      {/* Workspace navigation with tabs */}
      <section className="mt-10">
        <div className="mb-6 flex items-center gap-2 overflow-x-auto border-b border-zinc-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-violet-600 text-violet-600"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "Overview" && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-zinc-950">Quick access</p>
            <p className="mt-1 text-sm text-zinc-500">
              Jump to any section to manage your project.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {["Features", "Events", "Sources", "Analytics"].map((tab) => {
                const tabConfig = tabs.find((t) => t.label === tab);
                if (!tabConfig) return null;
                const Icon = tabConfig.icon;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
                        <Icon size={20} />
                      </div>
                      <div className="text-left">
                        <h2 className="font-semibold text-zinc-950">{tab}</h2>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-600"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Features" && (
          <div>
            <p className="text-base font-medium text-zinc-950">
              Manage product features
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Define, track, and release features with built-in event tracking.
            </p>
            <Link
              href={`/projects/${projectId}/features`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Go to Features
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {activeTab === "Events" && (
          <div>
            <p className="text-base font-medium text-zinc-950">
              Manage product events
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Define custom events to track user interactions and behavior.
            </p>
            <Link
              href={`/projects/${projectId}/events`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Go to Events
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {activeTab === "Sources" && (
          <div>
            <p className="text-base font-medium text-zinc-950">
              Configure event sources
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Connect web, mobile, and backend event sources.
            </p>
            <Link
              href={`/projects/${projectId}/event-sources`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Go to Sources
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {activeTab === "Analytics" && (
          <div>
            <p className="text-base font-medium text-zinc-950">
              Project analytics and metrics
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              View feature adoption, event tracking, and intelligence metrics.
            </p>
            <Link
              href={`/projects/${projectId}/analytics`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              View Analytics
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {activeTab === "Settings" && (
          <div>
            <p className="text-base font-medium text-zinc-950">
              Project settings
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Configure project properties and integrations.
            </p>
            <p className="mt-5 text-sm text-zinc-400">
              Settings page coming soon
            </p>
          </div>
        )}
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
