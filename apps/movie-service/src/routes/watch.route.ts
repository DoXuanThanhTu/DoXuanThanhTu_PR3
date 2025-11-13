// routes/watch.route.ts
import express, { Router } from "express";
import { getWatchData } from "../controllers/watch.controller.js";

const router: Router = express.Router();
router.get("/:movieSlug", getWatchData);
export default router;
