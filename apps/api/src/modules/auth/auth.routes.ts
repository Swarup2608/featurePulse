import { Router } from "express";
import { registerController, loginController, getMe } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me",authenticate,getMe);

export default router;