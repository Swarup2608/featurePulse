"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { eventSourceService } from "@/lib/api/event-source.service";
import { ApiKeysList } from "@/components/api-keys/api-keys-list";
import { CreateApiKeyDialog } from "@/components/api-keys/create-api-key-dialog";
import type { EventSource } from "@/types/event-source.types";

export default function ApiKeysPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const sourceId = params.sourceId as string;
  const [source, setSource] = useState<EventSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  if (error || !source) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-zinc-950">
            Unable to load event source
          </h2>
          <p className="mt-2 text-sm text-zinc-500">{error}</p>
          <Link
            href={`/projects/${projectId}/event-sources`}
            className="mt-5 inline-flex rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Back to sources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href={`/projects/${projectId}/event-sources/${sourceId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to source
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            API keys
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage authentication keys for {source.name}
          </p>
        </div>
        <CreateApiKeyDialog
          organizationId={organization!.id}
          projectId={projectId}
          sourceId={sourceId}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      <section className="mt-8">
        <ApiKeysList
          key={refreshKey}
          organizationId={organization!.id}
          projectId={projectId}
          sourceId={sourceId}
        />
      </section>
    </div>
  );
}
