"use client";

import { useState } from "react";
import { Plus, Loader2, X, AlertCircle } from "lucide-react";
import { eventSourceService } from "@/lib/api/event-source.service";
import { useToast } from "@/components/toast";
import {
  EventSourceType,
  EventSourceEnvironment,
} from "@/types/event-source.types";

interface CreateEventSourceDialogProps {
  organizationId: string;
  projectId: string;
  onSuccess?: () => void;
}

export function CreateEventSourceDialog({
  organizationId,
  projectId,
  onSuccess,
}: CreateEventSourceDialogProps) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<EventSourceType>(EventSourceType.WEB);
  const [environment, setEnvironment] = useState<EventSourceEnvironment>(
    EventSourceEnvironment.PRODUCTION,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Source name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await eventSourceService.createEventSource(organizationId, projectId, {
        name: trimmedName,
        type,
        environment,
      });
      toast.success(`Event source "${trimmedName}" created successfully`);
      setName("");
      setType(EventSourceType.WEB);
      setEnvironment(EventSourceEnvironment.PRODUCTION);
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create event source";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        <Plus size={18} />
        Connect source
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">
                Connect event source
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={16} className="mt-0.5 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-950">
                  Source name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Main Web App"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-950">
                  Source type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventSourceType)}
                  disabled={loading}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                >
                  <option value={EventSourceType.WEB}>Web</option>
                  <option value={EventSourceType.MOBILE}>Mobile</option>
                  <option value={EventSourceType.BACKEND}>Backend</option>
                  <option value={EventSourceType.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-950">
                  Environment
                </label>
                <select
                  value={environment}
                  onChange={(e) =>
                    setEnvironment(e.target.value as EventSourceEnvironment)
                  }
                  disabled={loading}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                >
                  <option value={EventSourceEnvironment.PRODUCTION}>
                    Production
                  </option>
                  <option value={EventSourceEnvironment.STAGING}>
                    Staging
                  </option>
                  <option value={EventSourceEnvironment.DEVELOPMENT}>
                    Development
                  </option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || name.trim().length < 2}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect source"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
