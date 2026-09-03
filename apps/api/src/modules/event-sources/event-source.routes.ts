import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { createController, getAllController, getByIdController, updateController } from "./event-source.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER]), createController);

router.get("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER, MembershipRole.VIEWER]), getAllController);

router.get("/:eventSourceId", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER, MembershipRole.VIEWER]), getByIdController);

router.patch("/:eventSourceId", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER]), updateController);

export default router;