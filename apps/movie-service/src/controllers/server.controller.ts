import { Request, Response } from "express";
import { Server, Movie } from "@repo/database";
import { AuthRequest } from "../middlewares/auth.middleware.js";

/* ───────────────────────────────────────────────
   Helper: xác định phạm vi truy cập
─────────────────────────────────────────────── */
const getAllowedScopes = (req: AuthRequest): string[] => {
  const role = req.user?.role ?? "user";
  switch (role) {
    case "vip":
      return ["public", "vip"];
    case "admin":
    case "staff":
      return ["public", "vip", "staff"];
    default:
      return ["public"];
  }
};

/* ───────────────────────────────────────────────
   GET: Lấy tất cả server của một movie theo ID
─────────────────────────────────────────────── */
export const getServersByMovieId = async (req: AuthRequest, res: Response) => {
  try {
    const movieId = req.params.movieId;
    if (!movieId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing movie ID" });
    }

    const servers = await Server.find({ movie_id: movieId, active: true })
      .sort({ priority: -1 })
      .lean();

    return res.json({ success: true, data: servers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   GET: Lấy tất cả server theo movie_slug
─────────────────────────────────────────────── */
export const getServersByMovieSlug = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const slug = req.params.movieSlug;
    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Missing movie slug" });
    }

    const movie = await Movie.findOne({ slug }).lean();
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // ✅ Phân quyền hiển thị server theo vai trò
    const role = req.user?.role ?? "user";

    let allowedStatuses: boolean[]; // active = true / false

    switch (role) {
      case "admin":
      case "staff":
        allowedStatuses = [true, false]; // thấy tất cả
        break;
      case "vip":
      case "user":
      default:
        allowedStatuses = [true]; // chỉ thấy server đang active
        break;
    }

    const servers = await Server.find({
      movie_id: movie._id,
      active: true,
    }).lean();

    return res.json({
      success: true,
      count: servers.length,
      data: servers,
    });
  } catch (error: any) {
    console.error("getServersByMovieSlug error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   GET: Lấy chi tiết một server theo ID
─────────────────────────────────────────────── */
export const getServerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const server = await Server.findById(id).lean();
    if (!server) {
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    }

    return res.json({ success: true, data: server });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   POST: Tạo mới server
─────────────────────────────────────────────── */
export const createServer = async (req: AuthRequest, res: Response) => {
  try {
    if (!["admin", "staff"].includes(req.user?.role ?? "")) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    const { movie_id, name, cdn_url } = req.body;
    if (!movie_id || !name || !cdn_url) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (movie_id, name, cdn_url)",
      });
    }

    const newServer = await Server.create(req.body);
    return res.status(201).json({ success: true, data: newServer });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   PUT: Cập nhật thông tin server
─────────────────────────────────────────────── */
export const updateServerById = async (req: AuthRequest, res: Response) => {
  try {
    if (!["admin", "staff"].includes(req.user?.role ?? "")) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    const { id } = req.params;
    const updatedServer = await Server.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedServer) {
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    }

    return res.json({ success: true, data: updatedServer });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   DELETE: Xóa server
─────────────────────────────────────────────── */
export const deleteServerById = async (req: AuthRequest, res: Response) => {
  try {
    if (!["admin", "staff"].includes(req.user?.role ?? "")) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    const { id } = req.params;
    const deleted = await Server.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    }

    return res.json({ success: true, message: "Server deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   PATCH: Bật / tắt server (active)
─────────────────────────────────────────────── */
export const toggleServerActive = async (req: AuthRequest, res: Response) => {
  try {
    if (!["admin", "staff"].includes(req.user?.role ?? "")) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    const { id } = req.params;
    const server = await Server.findById(id);
    if (!server) {
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    }

    server.active = !server.active;
    await server.save();

    return res.json({
      success: true,
      message: `Server ${server.active ? "activated" : "deactivated"} successfully`,
      data: server,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
