import express, { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getProfile,
  getUserById,
  login,
  register,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router: Router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.post("/register", register);
router.post("/login", login);

router.get("/", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getUserById);
router.post("/", authMiddleware, isAdmin, createUser);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);
export default router;
