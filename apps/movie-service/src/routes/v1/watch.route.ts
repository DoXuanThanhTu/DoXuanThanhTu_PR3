import { Router } from "express";
import { getWatchData } from "../../controllers/v1/watch.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/:movieSlug", authMiddleware, getWatchData);

export default router;
