export interface FeatureBreakdown {
  total: number;
  byStatus: Record<string, number>;
  createdLast30Days: number;
  releasedLast30Days: number;
}

export interface EventBreakdown {
  total: number;
  createdLast30Days: number;
}

export interface EventSourceBreakdown {
  total: number;
  active: number;
  byType: Record<string, number>;
  byEnvironment: Record<string, number>;
}

export interface ApiKeyBreakdown {
  total: number;
  active: number;
}

export interface InstrumentationBreakdown {
  featuresInstrumented: number;
  featuresNotInstrumented: number;
  coverageRate: number; // 0..1
  eventsLinked: number;
  eventsUnused: number;
  totalLinks: number;
  avgEventsPerInstrumentedFeature: number;
}

export interface ActivityPoint {
  weekStart: string; // ISO timestamp, Monday 00:00 UTC
  featuresCreated: number;
}

export interface ProjectAnalyticsOverview {
  generatedAt: string;
  features: FeatureBreakdown;
  events: EventBreakdown;
  eventSources: EventSourceBreakdown;
  apiKeys: ApiKeyBreakdown;
  instrumentation: InstrumentationBreakdown;
  activity: ActivityPoint[];
}
