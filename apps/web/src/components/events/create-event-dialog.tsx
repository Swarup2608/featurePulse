"use client";

import { useState } from "react";
import { Plus, Loader2, X, AlertCircle } from "lucide-react";
import { eventService } from "@/lib/api/event.service";

interface CreateEventDialogProps {
  organizationId: string;
  projectId: string;
  onSuccess?: () => void;
}

export function CreateEventDialog({ organizationId, projectId, onSuccess }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    const trimmedDisplayName = displayName.trim();

    if (trimmedName.length < 2) {
      setError("Event name must be at least 2 characters");
      return;
    }

    if (trimmedDisplayName.length < 2) {
      setError("Display name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await eventService.createEvent(organizationId, projectId, {
        name: trimmedName,
        displayName: trimmedDisplayName,
        description: description.trim() || undefined,
      });
      setName("");
      setDisplayName("");
      setDescription("");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
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
        Create event
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Create event</h2>
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
                  Event name (snake_case)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                  placeholder="e.g., user_signup_clicked"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  Lowercase letters, numbers, and underscores only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-950">
                  Display name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., User Signup Clicked"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-950">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this event track?"
                  disabled={loading}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                />
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
                  disabled={loading || name.trim().length < 2 || displayName.trim().length < 2}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create event"
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
