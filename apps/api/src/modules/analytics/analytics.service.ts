import { Types } from "mongoose";

import { AppError } from "../../utils/AppError";
import { Project } from "../projects/project.model";
import { Feature } from "../features/feature.model";
import { FeatureStatus } from "../features/feature.types";
import { EventDefinition } from "../events/event.model";
import { EventSource } from "../event-sources/event-source.model";
import { EventSourceEnvironment, EventSourceType } from "../event-sources/event-source.types";
import { ApiKey } from "../api-keys/api-key.model";
import { ApiKeyStatus } from "../api-keys/api-key.types";
import { FeatureEvent } from "../feature-events/feature-event.model";
import { ProjectAnalyticsOverview } from "./analytics.types";
import { applyGroupCounts, buildActivitySeries, round, seedCountMap, startOfUtcWeek, WEEK_MS } from "./analytics.util";

const ACTIVITY_WEEKS = 8;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const assertProjectExists = async (organizationId: string, projectId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(projectId)) throw new AppError("Invalid project ID", 400);
  const project = await Project.findOne({ _id: projectId, organizationId }).select("_id").lean();
  if (!project) throw new AppError("Project not found", 404);
};

export const getProjectAnalyticsOverview = async (
  organizationId: string,
  projectId: string,
): Promise<ProjectAnalyticsOverview> => {
  await assertProjectExists(organizationId, projectId);

  const scope = {
    organizationId: new Types.ObjectId(organizationId),
    projectId: new Types.ObjectId(projectId),
  };

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS_MS);
  const activitySince = startOfUtcWeek(new Date(now.getTime() - (ACTIVITY_WEEKS - 1) * WEEK_MS));

  const [
    featureStatusRows,
    featureTotalsRows,
    eventTotalsRows,
    sourceTypeRows,
    sourceEnvRows,
    activeSourceCount,
    totalSourceCount,
    apiKeyStatusRows,
    linkRows,
    activityRows,
  ] = await Promise.all([
    Feature.aggregate<{ _id: string | null; count: number }>([
      { $match: scope },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Feature.aggregate<{ total: number; createdLast30Days: number; releasedLast30Days: number }>([
      { $match: scope },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          createdLast30Days: {
            $sum: { $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0] },
          },
          releasedLast30Days: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$releasedAt", null] },
                    { $gte: [{ $ifNull: ["$releasedAt", new Date(0)] }, thirtyDaysAgo] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    EventDefinition.aggregate<{ total: number; createdLast30Days: number }>([
      { $match: scope },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          createdLast30Days: {
            $sum: { $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0] },
          },
        },
      },
    ]),
    EventSource.aggregate<{ _id: string | null; count: number }>([
      { $match: scope },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
    EventSource.aggregate<{ _id: string | null; count: number }>([
      { $match: scope },
      { $group: { _id: "$environment", count: { $sum: 1 } } },
    ]),
    EventSource.countDocuments({ ...scope, isActive: true }),
    EventSource.countDocuments(scope),
    ApiKey.aggregate<{ _id: string | null; count: number }>([
      { $match: scope },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    FeatureEvent.aggregate<{ totalLinks: number; featuresInstrumented: number; eventsLinked: number }>([
      { $match: scope },
      {
        $group: {
          _id: null,
          totalLinks: { $sum: 1 },
          features: { $addToSet: "$featureId" },
          events: { $addToSet: "$eventId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalLinks: 1,
          featuresInstrumented: { $size: "$features" },
          eventsLinked: { $size: "$events" },
        },
      },
    ]),
    Feature.aggregate<{ _id: Date; featuresCreated: number }>([
      { $match: { ...scope, createdAt: { $gte: activitySince } } },
      {
        $group: {
          _id: { $dateTrunc: { date: "$createdAt", unit: "week", startOfWeek: "monday" } },
          featuresCreated: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const featureTotals = featureTotalsRows[0] ?? { total: 0, createdLast30Days: 0, releasedLast30Days: 0 };
  const eventTotals = eventTotalsRows[0] ?? { total: 0, createdLast30Days: 0 };
  const links = linkRows[0] ?? { totalLinks: 0, featuresInstrumented: 0, eventsLinked: 0 };

  const byStatus = seedCountMap(Object.values(FeatureStatus));
  applyGroupCounts(byStatus, featureStatusRows);

  const byType = seedCountMap(Object.values(EventSourceType));
  applyGroupCounts(byType, sourceTypeRows);

  const byEnvironment = seedCountMap(Object.values(EventSourceEnvironment));
  applyGroupCounts(byEnvironment, sourceEnvRows);

  const apiKeyTotal = apiKeyStatusRows.reduce((sum, row) => sum + row.count, 0);
  const apiKeyActive = apiKeyStatusRows.find((row) => row._id === ApiKeyStatus.ACTIVE)?.count ?? 0;

  const featuresInstrumented = Math.min(links.featuresInstrumented, featureTotals.total);
  const featuresNotInstrumented = Math.max(0, featureTotals.total - featuresInstrumented);
  const eventsUnused = Math.max(0, eventTotals.total - links.eventsLinked);

  const activity = buildActivitySeries(now, ACTIVITY_WEEKS, activityRows);

  return {
    generatedAt: now.toISOString(),
    features: {
      total: featureTotals.total,
      byStatus,
      createdLast30Days: featureTotals.createdLast30Days,
      releasedLast30Days: featureTotals.releasedLast30Days,
    },
    events: {
      total: eventTotals.total,
      createdLast30Days: eventTotals.createdLast30Days,
    },
    eventSources: {
      total: totalSourceCount,
      active: activeSourceCount,
      byType,
      byEnvironment,
    },
    apiKeys: {
      total: apiKeyTotal,
      active: apiKeyActive,
    },
    instrumentation: {
      featuresInstrumented,
      featuresNotInstrumented,
      coverageRate: featureTotals.total ? round(featuresInstrumented / featureTotals.total, 4) : 0,
      eventsLinked: links.eventsLinked,
      eventsUnused,
      totalLinks: links.totalLinks,
      avgEventsPerInstrumentedFeature: featuresInstrumented
        ? round(links.totalLinks / featuresInstrumented, 2)
        : 0,
    },
    activity,
  };
};
