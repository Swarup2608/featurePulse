import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { archiveController, createController, getAllController, getByIdController, updateController } from "./feature.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

const readRoles = [
  MembershipRole.OWNER,
  MembershipRole.ADMIN,
  MembershipRole.MEMBER,
  MembershipRole.VIEWER,
];

const writeRoles = [
  MembershipRole.OWNER,
  MembershipRole.ADMIN,
  MembershipRole.MEMBER,
];

router.post("/", requireOrganizationRole(writeRoles), createController);

router.get("/", requireOrganizationRole(readRoles), getAllController);

router.get("/:featureId", requireOrganizationRole(readRoles), getByIdController);

router.patch("/:featureId", requireOrganizationRole(writeRoles), updateController);

router.patch("/:featureId/archive", requireOrganizationRole(writeRoles), archiveController);

export default router;