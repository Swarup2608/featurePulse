"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Plus, ChevronRight, AlertCircle } from "lucide-react";
import { featureService } from "@/lib/api/feature.service";
import type { Feature, FeaturesResponse } from "@/types/feature.types";

interface FeaturesListProps {
  organizationId: string;
  projectId: string;
}

export function FeaturesList({ organizationId, projectId }: FeaturesListProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await featureService.getFeatures(
          organizationId,
          projectId,
          page,
          10,
        );
        setFeatures(result.features);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load features",
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, [organizationId, projectId, page]);

  const filteredFeatures = features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading features...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle size={20} className="mt-0.5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-950">
              Failed to load features
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-200">
          <Plus size={24} className="text-zinc-600" />
        </div>
        <h3 className="mt-4 font-semibold text-zinc-950">No features yet</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Create your first feature to start tracking product intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search features by name or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="space-y-2">
        {filteredFeatures.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center">
            <p className="text-sm text-zinc-500">
              No features match your search.
            </p>
          </div>
        ) : (
          filteredFeatures.map((feature) => (
            <Link
              key={feature._id}
              href={`/projects/${projectId}/features/${feature._id}`}
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-zinc-950 group-hover:text-violet-600">
                    {feature.name}
                  </h3>
                  <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                    {feature.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {feature.slug} • Created{" "}
                  {new Date(feature.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-600"
              />
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50 hover:bg-zinc-50"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50 hover:bg-zinc-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
