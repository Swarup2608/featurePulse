import { apiClient } from "./api-client";
import type { ProjectAnalyticsOverview } from "@/types/analytics.types";

export const analyticsService = {
  // Single aggregated overview, computed server-side via MongoDB aggregation.
  async getProjectOverview(
    organizationId: string,
    projectId: string,
  ): Promise<ProjectAnalyticsOverview> {
    const response = await apiClient.get<{ overview: ProjectAnalyticsOverview }>(
      `/organizations/${organizationId}/projects/${projectId}/analytics/overview`,
    );
    return response.overview;
  },
};
