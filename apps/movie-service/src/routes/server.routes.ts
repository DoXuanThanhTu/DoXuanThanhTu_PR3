import express, { Router } from "express";
import {
  getServersByMovieId,
  getServersByMovieSlug,
  getServerById,
  createServer,
  updateServerById,
  deleteServerById,
  toggleServerActive,
} from "../controllers/server.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = express.Router();

/**
 * ───────────────────────────────
 * 📂 PUBLIC ROUTES
 * ───────────────────────────────
 * - Ai cũng có thể truy cập (cả khách chưa đăng nhập)
 * - Nếu có token thì `authMiddleware` sẽ inject user role (vip/staff/admin)
 *   để `getAllowedScopes()` hoạt động chính xác.
 */
router.get("/movie-id/:movieId", authMiddleware.optional, getServersByMovieId);
router.get(
  "/movie-slug/:movieSlug",
  authMiddleware.optional,
  getServersByMovieSlug
);
router.get("/:id", authMiddleware.optional, getServerById);

/**
 * ───────────────────────────────
 * 🔒 ADMIN/STAFF ROUTES
 * ───────────────────────────────
 */
router.post("/", authMiddleware, createServer);
router.put("/:id", authMiddleware, updateServerById);
router.delete("/:id", authMiddleware, deleteServerById);
router.patch("/:id/active", authMiddleware, toggleServerActive);

export default router;
