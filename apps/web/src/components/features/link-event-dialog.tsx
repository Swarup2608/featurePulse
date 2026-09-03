"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, X, AlertCircle } from "lucide-react";
import { eventService } from "@/lib/api/event.service";
import { featureEventService } from "@/lib/api/feature-event.service";
import type { EventDefinition } from "@/types/event.types";

interface LinkEventDialogProps {
  organizationId: string;
  projectId: string;
  featureId: string;
  onSuccess?: () => void;
}

export function LinkEventDialog({
  organizationId,
  projectId,
  featureId,
  onSuccess,
}: LinkEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventDefinition[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        setError(null);
        const result = await eventService.getEvents(
          organizationId,
          projectId,
          1,
          100,
        );
        setEvents(result.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, [open, organizationId, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !selectedEventId) return;

    try {
      setLoading(true);
      setError(null);
      await featureEventService.addEventToFeature(
        organizationId,
        projectId,
        featureId,
        {
          eventId: selectedEventId,
        },
      );
      setSelectedEventId("");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        <Plus size={16} />
        Link event
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">
                Link event
              </h2>
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
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
                  Select event
                </label>
                {loadingEvents ? (
                  <div className="mt-2 flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 py-6">
                    <Loader2 size={18} className="animate-spin text-zinc-400" />
                  </div>
                ) : (
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    disabled={loading}
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50"
                  >
                    <option value="">Choose an event...</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.displayName} ({event.name})
                      </option>
                    ))}
                  </select>
                )}
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
                  disabled={loading || !selectedEventId}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Linking...
                    </>
                  ) : (
                    "Link event"
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
