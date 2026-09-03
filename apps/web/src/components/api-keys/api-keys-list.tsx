"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { apiKeyService } from "@/lib/api/api-key.service";
import type { ApiKey } from "@/types/api-key.types";

interface ApiKeysListProps {
  organizationId: string;
  projectId: string;
  sourceId: string;
}

export function ApiKeysList({
  organizationId,
  projectId,
  sourceId,
}: ApiKeysListProps) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadKeys = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiKeyService.getApiKeys(
          organizationId,
          projectId,
          sourceId,
        );
        setKeys(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load API keys",
        );
      } finally {
        setLoading(false);
      }
    };

    loadKeys();
  }, [organizationId, projectId, sourceId]);

  const filtered = keys.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-950">
              Failed to load API keys
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
        <p className="text-sm text-zinc-600">
          No API keys yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-3 text-zinc-400" />
        <input
          type="text"
          placeholder="Search keys by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center">
            <p className="text-xs text-zinc-500">No keys match your search</p>
          </div>
        ) : (
          filtered.map((key) => (
            <Link
              key={key._id}
              href={`/projects/${projectId}/event-sources/${sourceId}/api-keys/${key._id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-zinc-950">{key.name}</h3>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {key.keyPrefix}
                  ***
                </p>
              </div>
              <div className="ml-4 flex items-center gap-3">
                <div className="text-right text-xs">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 font-medium ${key.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}
                  >
                    {key.status}
                  </span>
                  {key.lastUsedAt && (
                    <p className="mt-1 text-zinc-500">
                      Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
