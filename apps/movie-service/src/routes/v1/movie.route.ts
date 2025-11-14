import { Router } from "express";
import * as MovieController from "../../controllers/v1/movie.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/role.middleware.js";

const router: Router = Router();

// Lấy danh sách phim phân trang
router.get("/", MovieController.listMovies);

// Lấy tất cả phim
router.get("/all", MovieController.getMovies);

// Lấy phim theo slug
router.get("/slug/:slug", MovieController.getMovieBySlug);

// Lấy phim theo ID
router.get("/:id", MovieController.getMovieById);

// Full detail (server + episodes)
router.get("/:id/full", MovieController.getMovieFullDetail);

// Related movies
router.get("/:id/related", MovieController.getRelatedMovies);

// Tạo phim
router.post("/", authMiddleware, isAdmin, MovieController.createMovie);

// Cập nhật
router.put("/:id", authMiddleware, isAdmin, MovieController.updateMovie);

// Xoá mềm
router.delete("/:id", authMiddleware, isAdmin, MovieController.deleteMovie);

export default router;
