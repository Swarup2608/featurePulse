"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, AlertCircle, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { eventService } from "@/lib/api/event.service";
import type { EventDefinition } from "@/types/event.types";

export default function EventDetailsPage() {
  const params = useParams();
  const { organization, isLoading: authLoading } = useAuthStore();
  const projectId = params.projectId as string;
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<EventDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organization?.id) return;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getEventById(organization.id, projectId, eventId);
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [organization?.id, projectId, eventId]);

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
              <h2 className="font-semibold text-red-950">Unable to load event</h2>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Link
            href={`/projects/${projectId}/events`}
            className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href={`/projects/${projectId}/events`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft size={16} />
        Back to events
      </Link>

      <section className="relative mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          <div>
            <p className="text-sm font-mono text-zinc-500">{event.name}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
              {event.displayName}
            </h1>
            {event.description && (
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
                {event.description}
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
                {new Date(event.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(event.createdAt).toLocaleTimeString()}
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
                {new Date(event.updatedAt).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {new Date(event.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-950">Event Information</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-sm text-zinc-600">Event Name (ID)</span>
            <span className="font-mono text-sm text-zinc-950">{event.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600">Event ID</span>
            <span className="font-mono text-sm text-zinc-950">{event._id}</span>
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
