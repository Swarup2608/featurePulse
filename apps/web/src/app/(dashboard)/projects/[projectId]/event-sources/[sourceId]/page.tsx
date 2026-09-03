"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { eventSourceService } from "@/lib/api/event-source.service";
import {
  EventSourceTypeIcon,
  getEnvironmentColor,
} from "@/components/event-sources/event-source-utils";
import type { EventSource } from "@/types/event-source.types";

export default function EventSourceDetailsPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const sourceId = params.sourceId as string;
  const [source, setSource] = useState<EventSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!organization?.id) return;

    const loadSource = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventSourceService.getEventSourceById(
          organization.id,
          projectId,
          sourceId,
        );
        setSource(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event source",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSource();
  }, [organization?.id, projectId, sourceId]);

  const handleCopySlug = () => {
    if (source) {
      navigator.clipboard.writeText(source.slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-red-600" />
            <div className="text-left">
              <h2 className="font-semibold text-red-950">
                Unable to load event source
              </h2>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Link
            href={`/projects/${projectId}/event-sources`}
            className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to sources
          </Link>
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href={`/projects/${projectId}/event-sources`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to sources
      </Link>

      <section className="relative mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <EventSourceTypeIcon type={source.type} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                  {source.name}
                </h1>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getEnvironmentColor(source.environment)}`}
                >
                  {source.environment}
                </span>
                {!source.isActive && (
                  <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-zinc-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Created
              </p>
              <p className="mt-2 font-medium text-zinc-950">
                {new Date(source.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(source.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-zinc-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Last updated
              </p>
              <p className="mt-2 font-medium text-zinc-950">
                {new Date(source.updatedAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(source.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-950">Source Details</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-sm text-zinc-600">Source Type</span>
            <span className="font-medium text-zinc-950">{source.type}</span>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-sm text-zinc-600">Source ID</span>
            <button
              onClick={handleCopySlug}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm text-zinc-950 transition hover:bg-zinc-100"
            >
              {source.slug}
              {copied ? (
                <Check size={16} className="text-emerald-600" />
              ) : (
                <Copy size={16} className="text-zinc-400" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600">Status</span>
            <span className="font-medium text-zinc-950">
              {source.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-600">
          SDK integration and event routing configuration coming soon
        </p>
      </section>
    </div>
  );
}
