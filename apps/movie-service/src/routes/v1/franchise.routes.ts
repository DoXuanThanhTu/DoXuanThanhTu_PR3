import { Router } from "express";
import { isAdmin } from "../../middlewares/role.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createFranchise,
  deleteFranchise,
  getFranchiseById,
  getFranchiseBySlug,
  getFranchises,
  getMoviesInFranchise,
  updateFranchise,
} from "../../controllers/v1/franchise.controller.js";

const router: Router = Router();

// GET /franchises?page=&limit=
router.get("/", getFranchises);

// GET /franchises/:id
router.get("/:id", getFranchiseById);

// GET /franchises/slug/:slug
router.get("/slug/:slug", getFranchiseBySlug);

// GET /franchises/:id/movies
router.get("/:id/movies", getMoviesInFranchise);

// POST /franchises
router.post("/", authMiddleware, isAdmin, createFranchise);

// PUT /franchises/:id
router.put("/:id", authMiddleware, isAdmin, updateFranchise);

// DELETE /franchises/:id
router.delete("/:id", authMiddleware, isAdmin, deleteFranchise);

export default router;
