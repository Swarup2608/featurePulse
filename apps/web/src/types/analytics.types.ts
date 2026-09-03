import type { Feature } from "./feature.types";
import type { EventDefinition } from "./event.types";
import type { EventSource } from "./event-source.types";

export interface ProjectAnalytics {
  features: {
    total: number;
    byStatus: Record<string, number>;
    withEvents: number;
  };
  events: {
    total: number;
    tracked: number;
  };
  sources: {
    total: number;
    byType: Record<string, number>;
    active: number;
  };
  featureAdoption: {
    tracked: number;
    untracked: number;
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AnalyticsSummary {
  totalFeatures: number;
  activeFeatures: number;
  trackedFeatures: number;
  totalEvents: number;
  totalSources: number;
  activeSources: number;
}
