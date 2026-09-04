"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Zap, Trash2 } from "lucide-react";
import { featureEventService } from "@/lib/api/feature-event.service";
import { LinkEventDialog } from "./link-event-dialog";
import type { FeatureEvent } from "@/types/feature-event.types";

interface FeatureEventsSectionProps {
  organizationId: string;
  projectId: string;
  featureId: string;
}

export function FeatureEventsSection({
  organizationId,
  projectId,
  featureId,
}: FeatureEventsSectionProps) {
  const [events, setEvents] = useState<FeatureEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await featureEventService.getFeatureEvents(
          organizationId,
          projectId,
          featureId,
        );
        setEvents(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [organizationId, projectId, featureId, refreshKey]);

  const handleRemoveEvent = async (eventId: string) => {
    if (!confirm("Remove this event from the feature?")) return;

    try {
      setDeleting(eventId);
      await featureEventService.removeEventFromFeature(
        organizationId,
        projectId,
        featureId,
        eventId,
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove event");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
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
              Failed to load events
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-950">
            Tracked events
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Events that measure this feature&apos;s usage and adoption
          </p>
        </div>
        <LinkEventDialog
          organizationId={organizationId}
          projectId={projectId}
          featureId={featureId}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
          <Zap size={28} className="mx-auto text-zinc-400" />
          <p className="mt-3 text-sm font-medium text-zinc-950">
            No events tracked
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Link events to measure feature adoption and usage
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((fe) => (
            <div
              key={fe._id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-zinc-950">
                  {fe.eventId.displayName}
                </h4>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {fe.eventId.name}
                </p>
              </div>
              <button
                onClick={() => handleRemoveEvent(fe.eventId._id)}
                disabled={deleting === fe.eventId._id}
                className="ml-4 rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {deleting === fe.eventId._id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
