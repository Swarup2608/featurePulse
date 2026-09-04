"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Zap,
  Layers3,
  Database,
  Gauge,
  Link2,
  RefreshCw,
} from "lucide-react";
import { analyticsService } from "@/lib/api/analytics.service";
import { ApiError } from "@/lib/api/api-error";
import type { ProjectAnalyticsOverview } from "@/types/analytics.types";

interface AnalyticsDashboardProps {
  organizationId: string;
  projectId: string;
}

const WEEKDAY_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

export function AnalyticsDashboard({
  organizationId,
  projectId,
}: AnalyticsDashboardProps) {
  const [overview, setOverview] = useState<ProjectAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getProjectOverview(
          organizationId,
          projectId,
        );
        if (!cancelled) setOverview(data);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Unable to load analytics right now",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [organizationId, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
        <p className="text-sm text-zinc-600">
          {error ?? "Unable to load analytics"}
        </p>
      </div>
    );
  }

  const { features, events, eventSources, apiKeys, instrumentation, activity } =
    overview;

  const coveragePct = Math.round(instrumentation.coverageRate * 100);
  const activeFeatures = features.byStatus.ACTIVE ?? 0;
  const maxWeekly =
    activity.reduce((max, point) => Math.max(max, point.featuresCreated), 0) || 1;

  return (
    <div className="space-y-8">
      {/* Key metrics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Features"
          value={features.total}
          hint={`${activeFeatures} active`}
          icon={Layers3}
        />
        <MetricCard
          label="Instrumentation"
          value={`${coveragePct}%`}
          hint={`${instrumentation.featuresInstrumented} of ${features.total} tracked`}
          icon={Gauge}
        />
        <MetricCard
          label="Event Definitions"
          value={events.total}
          hint={`${instrumentation.eventsLinked} linked to features`}
          icon={Zap}
        />
        <MetricCard
          label="Event Sources"
          value={eventSources.total}
          hint={`${eventSources.active} active · ${apiKeys.active} keys`}
          icon={Database}
        />
      </section>

      {/* Instrumentation coverage */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Link2 size={18} className="text-violet-600" />
          <h3 className="text-lg font-semibold text-zinc-950">
            Instrumentation Coverage
          </h3>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          How much of the feature catalog is wired to tracked events.
        </p>

        <div className="mt-5">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-semibold text-zinc-950">
              {coveragePct}%
            </span>
            <span className="text-xs text-zinc-500">
              {instrumentation.featuresInstrumented} instrumented ·{" "}
              {instrumentation.featuresNotInstrumented} not
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${coveragePct}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatBlock label="Events Linked" value={instrumentation.eventsLinked} />
          <StatBlock label="Events Unused" value={instrumentation.eventsUnused} />
          <StatBlock
            label="Feature ↔ Event Links"
            value={instrumentation.totalLinks}
          />
          <StatBlock
            label="Avg Events / Feature"
            value={instrumentation.avgEventsPerInstrumentedFeature}
          />
        </div>
      </section>

      {/* Weekly feature activity */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-zinc-950">
          Feature Activity
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Features created per week (last {activity.length} weeks).
        </p>
        <div className="mt-6 flex items-end gap-2 sm:gap-3">
          {activity.map((point) => {
            const heightPct = Math.round(
              (point.featuresCreated / maxWeekly) * 100,
            );
            return (
              <div
                key={point.weekStart}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-xs font-medium text-zinc-500">
                  {point.featuresCreated}
                </span>
                <div className="flex h-28 w-full items-end rounded-lg bg-zinc-50">
                  <div
                    className="w-full rounded-lg bg-zinc-900/85 transition-all"
                    style={{
                      height: `${Math.max(heightPct, point.featuresCreated > 0 ? 8 : 2)}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-zinc-400">
                  {new Date(point.weekStart).toLocaleDateString(
                    undefined,
                    WEEKDAY_FORMAT,
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature status breakdown */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-zinc-950">
          Features by Status
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(features.byStatus).map(([status, count]) => (
            <StatBlock key={status} label={status} value={count} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500">
          <span>{features.createdLast30Days} created in last 30 days</span>
          <span>{features.releasedLast30Days} released in last 30 days</span>
          <span>{events.createdLast30Days} events defined in last 30 days</span>
        </div>
      </section>

      {/* Source breakdowns */}
      <div className="grid gap-6 md:grid-cols-2">
        <BreakdownCard title="Sources by Type" data={eventSources.byType} />
        <BreakdownCard
          title="Sources by Environment"
          data={eventSources.byEnvironment}
        />
      </div>

      <p className="flex items-center gap-1.5 text-xs text-zinc-400">
        <RefreshCw size={12} />
        Generated {new Date(overview.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ComponentType<{ size: number }>;
}

function MetricCard({ label, value, hint, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-zinc-950">{value}</p>
          {hint ? (
            <p className="mt-1 text-xs text-zinc-400">{hint}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function BreakdownCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>
      {total === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No event sources yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {entries.map(([key, count]) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700">{key}</span>
                  <span className="text-zinc-500">
                    {count} · {pct}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-900/80"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
