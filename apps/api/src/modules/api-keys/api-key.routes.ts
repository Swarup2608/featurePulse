import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { createController, getAllController, revokeController } from "./api-key.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN]), createController);

router.get("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN]), getAllController);

router.patch("/:apiKeyId/revoke", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN]), revokeController);

export default router;