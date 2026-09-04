import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { validateParams } from "../../utils/validateParams";
import { getProjectAnalyticsOverview } from "./analytics.service";

export const getOverviewController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const overview = await getProjectAnalyticsOverview(organizationId, projectId);
  res.status(200).json({
    success: true,
    data: { overview },
  });
});
