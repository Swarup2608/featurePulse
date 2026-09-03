import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { addEventController, getEventsController, removeEventController } from "./feature-event.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER]), addEventController);

router.get("/", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER, MembershipRole.VIEWER]), getEventsController);

router.delete("/:eventId", requireOrganizationRole([MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER]), removeEventController);

export default router;