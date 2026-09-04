import { Router } from "express";
import { registerController, loginController, getMeController, refreshAccessTokenController, logoutController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post("/register", authRateLimiter, asyncHandler(registerController));
router.post("/login", authRateLimiter, asyncHandler(loginController));
router.post("/refresh", authRateLimiter, asyncHandler(refreshAccessTokenController));

router.post("/logout", asyncHandler(logoutController));

router.get("/me", authenticate, asyncHandler(getMeController));

export default router;
