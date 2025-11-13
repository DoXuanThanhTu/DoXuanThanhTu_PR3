import { Router } from "express";
import {
  getAllFranchises,
  getFranchiseDetail,
  createFranchise,
  updateFranchise,
  deleteFranchise,
} from "../controllers/franchise.controller.js";

const router: Router = Router();

/**
 * @route   GET /api/franchises
 * @desc    Lấy tất cả franchise
 * @access  Public
 */
router.get("/", getAllFranchises);

/**
 * @route   GET /api/franchises/:idOrSlug
 * @desc    Lấy chi tiết franchise theo id hoặc slug
 * @access  Public
 */
router.get("/:idOrSlug", getFranchiseDetail);

/**
 * @route   POST /api/franchises
 * @desc    Tạo franchise mới
 * @access  Private (yêu cầu token)
 */
router.post("/", createFranchise);

/**
 * @route   PUT /api/franchises/:id
 * @desc    Cập nhật franchise
 * @access  Private
 */
router.put("/:id", updateFranchise);

/**
 * @route   DELETE /api/franchises/:id
 * @desc    Xóa franchise
 * @access  Private
 */
router.delete("/:id", deleteFranchise);

export default router;
