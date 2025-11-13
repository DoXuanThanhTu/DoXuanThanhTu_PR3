import express, { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug,
} from "../controllers/movie.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router: Router = express.Router();

// Public
router.get("/", getAllMovies);
router.get("/id/:id", getMovieById);
router.get("/slug/:slug", getMovieBySlug);

// Admin only
router.post("/", authMiddleware, isAdmin, createMovie);
router.put("/:id", authMiddleware, isAdmin, updateMovie);
router.delete("/:id", authMiddleware, isAdmin, deleteMovie);

export default router;
