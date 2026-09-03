"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Plus, ChevronRight, AlertCircle } from "lucide-react";
import { eventSourceService } from "@/lib/api/event-source.service";
import { EventSourceTypeIcon, getEnvironmentColor } from "./event-source-utils";
import type { EventSource } from "@/types/event-source.types";

interface EventSourcesListProps {
  organizationId: string;
  projectId: string;
}

export function EventSourcesList({
  organizationId,
  projectId,
}: EventSourcesListProps) {
  const [sources, setSources] = useState<EventSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadSources = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await eventSourceService.getEventSources(
          organizationId,
          projectId,
          page,
          10,
        );
        setSources(result.eventSources);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event sources",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, [organizationId, projectId, page]);

  const filteredSources = sources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading event sources...</p>
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
              Failed to load event sources
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

  if (sources.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-200">
          <Plus size={24} className="text-zinc-600" />
        </div>
        <h3 className="mt-4 font-semibold text-zinc-950">
          No event sources yet
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Connect an event source to start collecting data.
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
          placeholder="Search sources by name or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="space-y-2">
        {filteredSources.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center">
            <p className="text-sm text-zinc-500">
              No sources match your search.
            </p>
          </div>
        ) : (
          filteredSources.map((source) => (
            <Link
              key={source._id}
              href={`/projects/${projectId}/event-sources/${source._id}`}
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                  <EventSourceTypeIcon type={source.type} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-950 group-hover:text-violet-600">
                      {source.name}
                    </h3>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getEnvironmentColor(source.environment)}`}
                    >
                      {source.environment}
                    </span>
                    {!source.isActive && (
                      <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {source.slug} • {source.type}
                  </p>
                </div>
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
