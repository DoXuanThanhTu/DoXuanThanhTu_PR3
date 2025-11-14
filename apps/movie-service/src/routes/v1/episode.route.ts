import { Router } from "express";
import {
  getEpisodeById,
  listEpisodes,
  getEpisodesByMovie,
  getEpisodesByServer,
  createEpisode,
  updateEpisode,
  deleteEpisode,
} from "../../controllers/v1/episode.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: Router = Router();

// Public
router.get("/", listEpisodes);
router.get("/:id", getEpisodeById);
router.get("/movie/:movieId", getEpisodesByMovie);
router.get("/server/:serverId", getEpisodesByServer);

// Admin (nếu muốn bảo vệ thì bật middleware)
router.post("/", authMiddleware, createEpisode);
router.put("/:id", authMiddleware, updateEpisode);
router.delete("/:id", authMiddleware, deleteEpisode);

export default router;
