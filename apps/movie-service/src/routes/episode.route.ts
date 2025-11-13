import express, { Router } from "express";
import {
  createEpisode,
  getAllEpisodeInMovieBySlug,
  getAllEpisodeInMovieById,
  getEpisodesByMovieAndServer,
} from "../controllers/episode.controller.js";
const router: Router = express.Router();

router.get("/movie-id/:id", getAllEpisodeInMovieById);
router.get("/movie-slug/:slug", getAllEpisodeInMovieBySlug);
router.get("/:movieSlug/:serverId", getEpisodesByMovieAndServer);

router.post("/", createEpisode);
export default router;
