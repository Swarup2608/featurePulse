import { NextFunction, Response, Request } from "express";

import { Membership } from "../modules/memberships/membership.model";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { OrganizationRole } from "../modules/memberships/membership.types";

export const requireOrganizationRole = (allowedRoles: OrganizationRole[])=> asyncHandler(async (req:Request, res: Response, next: NextFunction)=> {
    try{
        const { organizationId } = req.params;
      if (!req.userId) {
        throw new AppError("Authentication required", 401);
      }

      if (!organizationId) {
        throw new AppError("Organization ID is required", 400);
      }

      const membership = await Membership.findOne({
        userId: req.userId,
        organizationId: organizationId
      });
      if(!membership){
        throw new AppError("You are not a member of this organization!", 403);
      }
      if(!allowedRoles.includes(membership.role)){
        throw new AppError("You do not have permission to perform this action", 403);
      }
      next();
    }
    catch(error){
        next(error);
    }
});
