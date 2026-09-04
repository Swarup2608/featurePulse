import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { getOverviewController } from "./analytics.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

const readRoles = [
  MembershipRole.OWNER,
  MembershipRole.ADMIN,
  MembershipRole.MEMBER,
  MembershipRole.VIEWER,
];

router.get("/overview", requireOrganizationRole(readRoles), getOverviewController);

export default router;
