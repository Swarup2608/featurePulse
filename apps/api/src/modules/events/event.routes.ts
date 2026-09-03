import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireOrganizationRole } from "../../middleware/organization.middleware";
import { MembershipRole } from "../memberships/membership.types";
import { createEventController, getAllController, getEventByIdController, updateEventController } from "./event.controller";

const router = Router({
    mergeParams: true,
});

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

router.post("/",requireOrganizationRole(writeRoles), createEventController);
router.get("/",requireOrganizationRole(readRoles), getAllController);
router.get("/:eventId",requireOrganizationRole(readRoles), getEventByIdController);
router.patch("/:eventId",requireOrganizationRole(writeRoles), updateEventController);

export default router;