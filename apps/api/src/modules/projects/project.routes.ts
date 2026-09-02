import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { createController, getAllController, getById, remove, update } from "./project.controller";

const router = Router({
  mergeParams: true,
});

router.use(authenticate);

router.post("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN]), createController);

router.get("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER, MembershipRole.VIEWER]), getAllController);

router.get("/:projectId", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER, MembershipRole.VIEWER]), getById);

router.patch("/:projectId", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN]), update);

router.delete("/:projectId", requireOrganizationRole([MembershipRole.OWNER]), remove);

export default router;
