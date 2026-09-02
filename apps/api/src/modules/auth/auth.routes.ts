import { Router } from "express";
import { registerController, loginController, getMeController, refreshAccessTokenController, logoutController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));
router.post("/refresh", asyncHandler(refreshAccessTokenController));

router.post("/logout", asyncHandler(logoutController));

router.get("/me", authenticate, asyncHandler(getMeController));

export default router;
