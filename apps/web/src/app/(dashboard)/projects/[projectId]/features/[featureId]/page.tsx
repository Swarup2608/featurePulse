"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, AlertCircle, Calendar, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { featureService } from "@/lib/api/feature.service";
import { FeatureStatusBadge } from "@/components/features/feature-status-badge";
import type { Feature } from "@/types/feature.types";

export default function FeatureDetailsPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const featureId = params.featureId as string;
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organization?.id) return;

    const loadFeature = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await featureService.getFeatureById(
          organization.id,
          projectId,
          featureId,
        );
        setFeature(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load feature");
      } finally {
        setLoading(false);
      }
    };

    loadFeature();
  }, [organization?.id, projectId, featureId]);

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
                Unable to load feature
              </h2>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Link
            href={`/projects/${projectId}/features`}
            className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to features
          </Link>
        </div>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href={`/projects/${projectId}/features`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to features
      </Link>

      <section className="relative mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          <div className="mb-6">
            <FeatureStatusBadge status={feature.status} size="md" />
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
              {feature.name}
            </h1>
            <p className="mt-2 text-sm font-mono text-zinc-500">
              {feature.slug}
            </p>
            {feature.description && (
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
                {feature.description}
              </p>
            )}
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
                {new Date(feature.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(feature.createdAt).toLocaleTimeString()}
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
                {new Date(feature.updatedAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(feature.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-950">
          Feature Information
        </h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-sm text-zinc-600">Status</span>
            <FeatureStatusBadge status={feature.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600">Feature ID</span>
            <span className="font-mono text-sm text-zinc-950">
              {feature._id}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-600">
          Event tracking and analytics coming soon
        </p>
      </section>
    </div>
  );
}
