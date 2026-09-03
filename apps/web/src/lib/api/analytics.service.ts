import { featureService } from "./feature.service";
import { eventService } from "./event.service";
import { eventSourceService } from "./event-source.service";
import { featureEventService } from "./feature-event.service";
import type { ProjectAnalytics, AnalyticsSummary } from "@/types/analytics.types";

export const analyticsService = {
  async getProjectAnalytics(organizationId: string, projectId: string): Promise<ProjectAnalytics> {
    try {
      const [featuresResp, eventsResp, sourcesResp] = await Promise.all([
        featureService.getFeatures(organizationId, projectId, 1, 1),
        eventService.getEvents(organizationId, projectId, 1, 1),
        eventSourceService.getEventSources(organizationId, projectId, 1, 1),
      ]);

      const totalFeatures = featuresResp.pagination.total;
      const totalEvents = eventsResp.pagination.total;
      const totalSources = sourcesResp.pagination.total;

      // Count features by status
      const byStatus: Record<string, number> = {};
      if (totalFeatures > 0) {
        const allFeatures = await featureService.getFeatures(organizationId, projectId, 1, totalFeatures);
        allFeatures.features.forEach((f: any) => {
          byStatus[f.status] = (byStatus[f.status] || 0) + 1;
        });
      }

      // Count sources by type
      const byType: Record<string, number> = {};
      let activeSources = 0;
      if (totalSources > 0) {
        const allSources = await eventSourceService.getEventSources(organizationId, projectId, 1, totalSources);
        allSources.eventSources.forEach((s) => {
          byType[s.type] = (byType[s.type] || 0) + 1;
          if (s.isActive) activeSources++;
        });
      }

      return {
        features: {
          total: totalFeatures,
          byStatus,
          withEvents: 0, // Will be computed separately
        },
        events: {
          total: totalEvents,
          tracked: 0, // Will be computed separately
        },
        sources: {
          total: totalSources,
          byType,
          active: activeSources,
        },
        featureAdoption: {
          tracked: 0,
          untracked: totalFeatures,
        },
      };
    } catch {
      return {
        features: { total: 0, byStatus: {}, withEvents: 0 },
        events: { total: 0, tracked: 0 },
        sources: { total: 0, byType: {}, active: 0 },
        featureAdoption: { tracked: 0, untracked: 0 },
      };
    }
  },

  async getAnalyticsSummary(organizationId: string, projectId: string): Promise<AnalyticsSummary> {
    try {
      const [featuresResp, eventsResp, sourcesResp] = await Promise.all([
        featureService.getFeatures(organizationId, projectId, 1, 1),
        eventService.getEvents(organizationId, projectId, 1, 1),
        eventSourceService.getEventSources(organizationId, projectId, 1, 1),
      ]);

      const totalFeatures = featuresResp.pagination.total;
      const totalEvents = eventsResp.pagination.total;
      const totalSources = sourcesResp.pagination.total;

      let activeFeatures = 0;
      let activeSources = 0;

      if (totalFeatures > 0) {
        const allFeatures = await featureService.getFeatures(organizationId, projectId, 1, totalFeatures);
        activeFeatures = allFeatures.features.filter((f: any) => f.status === "ACTIVE").length;
      }

      if (totalSources > 0) {
        const allSources = await eventSourceService.getEventSources(organizationId, projectId, 1, totalSources);
        activeSources = allSources.eventSources.filter((s) => s.isActive).length;
      }

      return {
        totalFeatures,
        activeFeatures,
        trackedFeatures: 0, // To be enhanced with feature-event mapping
        totalEvents,
        totalSources,
        activeSources,
      };
    } catch {
      return {
        totalFeatures: 0,
        activeFeatures: 0,
        trackedFeatures: 0,
        totalEvents: 0,
        totalSources: 0,
        activeSources: 0,
      };
    }
  },
};
