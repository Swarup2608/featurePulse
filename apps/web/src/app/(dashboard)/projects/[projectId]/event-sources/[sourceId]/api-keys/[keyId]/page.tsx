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
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { apiKeyService } from "@/lib/api/api-key.service";
import type { ApiKey, ApiKeyStatus } from "@/types/api-key.types";

export default function ApiKeyDetailsPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const sourceId = params.sourceId as string;
  const keyId = params.keyId as string;
  const [key, setKey] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    if (!organization?.id || !key) return;

    const loadKey = async () => {
      try {
        setLoading(true);
        setError(null);
        const keys = await apiKeyService.getApiKeys(
          organization.id,
          projectId,
          sourceId,
        );
        const foundKey = keys.find((k) => k._id === keyId);
        if (foundKey) {
          setKey(foundKey);
        } else {
          setError("API key not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load API key");
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      loadKey();
    }
  }, [organization?.id, projectId, sourceId, keyId]);

  const handleCopyPrefix = () => {
    if (key) {
      navigator.clipboard.writeText(key.keyPrefix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = async () => {
    if (!organization?.id || !key) return;
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone.",
      )
    )
      return;

    try {
      setRevoking(true);
      await apiKeyService.revokeApiKey(
        organization.id,
        projectId,
        sourceId,
        key._id,
      );
      setKey({ ...key, status: "REVOKED" as ApiKeyStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke API key");
    } finally {
      setRevoking(false);
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !key) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-red-600" />
            <div className="text-left">
              <h2 className="font-semibold text-red-950">
                Unable to load API key
              </h2>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Link
            href={`/projects/${projectId}/event-sources/${sourceId}/api-keys`}
            className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to keys
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href={`/projects/${projectId}/event-sources/${sourceId}/api-keys`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to keys
      </Link>

      <section className="relative mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                {key.name}
              </h1>
              <p className="mt-3 font-mono text-sm text-zinc-500">
                {key.keyPrefix}
                ***
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${key.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}
            >
              {key.status}
            </span>
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
                {new Date(key.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(key.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {key.lastUsedAt && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Last used
                </p>
                <p className="mt-2 font-medium text-zinc-950">
                  {new Date(key.lastUsedAt).toLocaleDateString()}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {new Date(key.lastUsedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {key.status === "ACTIVE" && (
        <section className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={20} className="mt-0.5 text-red-600" />
            <div className="flex-1">
              <h2 className="font-semibold text-red-950">Revoke this key</h2>
              <p className="mt-2 text-sm text-red-700">
                Revoking this key will immediately stop all authentication
                attempts using it.
              </p>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {revoking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Revoke key
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
