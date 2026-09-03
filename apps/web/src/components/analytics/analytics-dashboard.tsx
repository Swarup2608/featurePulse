"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap, Layers3, Database, TrendingUp } from "lucide-react";
import { analyticsService } from "@/lib/api/analytics.service";
import type { ProjectAnalytics } from "@/types/analytics.types";

interface AnalyticsDashboardProps {
  organizationId: string;
  projectId: string;
}

export function AnalyticsDashboard({
  organizationId,
  projectId,
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getProjectAnalytics(
          organizationId,
          projectId,
        );
        setAnalytics(data);
      } catch {
        // Silently fail and show empty state
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [organizationId, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-12 text-center">
        <p className="text-sm text-zinc-600">Unable to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Features"
          value={analytics.features.total}
          icon={Layers3}
        />
        <MetricCard
          label="Events Defined"
          value={analytics.events.total}
          icon={Zap}
        />
        <MetricCard
          label="Event Sources"
          value={analytics.sources.total}
          icon={Database}
        />
        <MetricCard
          label="Active Sources"
          value={analytics.sources.active}
          icon={TrendingUp}
        />
      </section>

      {/* Feature Status Breakdown */}
      {Object.keys(analytics.features.byStatus).length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-zinc-950">
            Features by Status
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(analytics.features.byStatus).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
                >
                  <p className="text-xs font-medium uppercase text-zinc-500">
                    {status}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-zinc-950">
                    {count}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* Source Type Breakdown */}
      {Object.keys(analytics.sources.byType).length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-zinc-950">
            Sources by Type
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(analytics.sources.byType).map(([type, count]) => (
              <div
                key={type}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <p className="text-xs font-medium uppercase text-zinc-500">
                  {type}
                </p>
                <p className="mt-3 text-2xl font-semibold text-zinc-950">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feature Adoption */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-zinc-950">
          Feature Adoption
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
            <p className="text-xs font-medium uppercase text-zinc-500">
              Tracked Features
            </p>
            <p className="mt-3 text-2xl font-semibold text-zinc-950">
              {analytics.featureAdoption.tracked}
            </p>
            <p className="mt-2 text-xs text-zinc-500">with event mapping</p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
            <p className="text-xs font-medium uppercase text-zinc-500">
              Untracked Features
            </p>
            <p className="mt-3 text-2xl font-semibold text-zinc-950">
              {analytics.featureAdoption.untracked}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              ready for event linking
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="rounded-2xl border border-dashed border-violet-300 bg-violet-50 p-8 text-center">
        <TrendingUp size={32} className="mx-auto text-violet-600" />
        <p className="mt-3 font-medium text-violet-950">
          Advanced Analytics Coming Soon
        </p>
        <p className="mt-1 text-sm text-violet-700">
          Time-series data, retention curves, and real-time event tracking
        </p>
      </section>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ size: number }>;
}

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-zinc-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
