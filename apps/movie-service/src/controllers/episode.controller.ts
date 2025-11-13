import { Episode, Movie, Server } from "@repo/database";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { Request, Response } from "express";

/* ───────────────────────────────────────────────
   Helper: Xác định phạm vi quyền truy cập
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
   GET: Lấy tất cả tập theo movie_id
─────────────────────────────────────────────── */
export const getAllEpisodeInMovieById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const movieId = req.params.id;
    if (!movieId)
      return res
        .status(400)
        .json({ success: false, message: "Missing movie ID" });

    const allowedScopes = getAllowedScopes(req);
    const episodes = await Episode.find({
      movie_id: movieId,
      visibility_status: { $ne: "hidden" },
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
    }).lean();

    return res.json({ success: true, data: episodes });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   GET: Lấy tất cả tập theo movie_slug
─────────────────────────────────────────────── */
export const getAllEpisodeInMovieBySlug = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const movieSlug = req.params.slug;
    if (!movieSlug)
      return res
        .status(400)
        .json({ success: false, message: "Missing movie slug" });

    const movie = await Movie.findOne({ slug: movieSlug }).lean();
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });

    const allowedScopes = getAllowedScopes(req);
    const episodes = await Episode.find({
      movie_id: movie._id,
      visibility_status: { $ne: "hidden" },
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
    }).lean();

    return res.json({ success: true, data: episodes });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   GET: Lấy chi tiết 1 tập phim
─────────────────────────────────────────────── */
export const getEpisodeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Missing episode ID" });

    const allowedScopes = getAllowedScopes(req);
    const episode = await Episode.findOne({
      _id: id,
      visibility_status: { $ne: "hidden" },
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
    }).lean();

    if (!episode)
      return res
        .status(404)
        .json({ success: false, message: "Episode not found" });

    return res.json({ success: true, data: episode });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   POST: Tạo tập phim mới
─────────────────────────────────────────────── */
export const createEpisode = async (req: Request, res: Response) => {
  try {
    const newEpisode = await Episode.create(req.body);
    return res.status(201).json({ success: true, data: newEpisode });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   PUT: Cập nhật tập phim
─────────────────────────────────────────────── */
export const updateEpisodeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEpisode = await Episode.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEpisode)
      return res
        .status(404)
        .json({ success: false, message: "Episode not found" });

    return res.json({ success: true, data: updatedEpisode });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   DELETE: Xóa tập phim
─────────────────────────────────────────────── */
export const deleteEpisodeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEpisode = await Episode.findByIdAndDelete(id);
    if (!deletedEpisode)
      return res
        .status(404)
        .json({ success: false, message: "Episode not found" });

    return res.json({ success: true, message: "Episode deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   PATCH: Ẩn / hiện tập phim (nếu có role quản trị)
─────────────────────────────────────────────── */
export const toggleEpisodeVisibility = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!["admin", "staff"].includes(req.user?.role ?? ""))
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });

    const { id } = req.params;
    const episode = await Episode.findById(id);
    if (!episode)
      return res
        .status(404)
        .json({ success: false, message: "Episode not found" });

    episode.visibility_status =
      episode.visibility_status === "hidden" ? "visible" : "hidden";
    await episode.save();

    return res.json({ success: true, data: episode });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ───────────────────────────────────────────────
   GET: Lấy danh sách tập phim theo movie & server
   ─ Nếu không truyền server_id => tự chọn server có priority cao nhất (nhỏ nhất số)
─────────────────────────────────────────────── */
export const getEpisodesByMovieAndServer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { movieSlug, serverId } = req.params;

    // 🧩 Kiểm tra slug hợp lệ
    if (!movieSlug)
      return res
        .status(400)
        .json({ success: false, message: "Missing movie slug" });

    // 🧩 Lấy movie
    const movie = await Movie.findOne({ slug: movieSlug }).lean();
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });

    // 🧩 Nếu có serverId -> dùng luôn
    let selectedServerId = serverId;

    // Nếu không có serverId => tìm server có priority cao nhất (priority nhỏ nhất)
    if (!selectedServerId) {
      const topServer = await Server.findOne({
        movie_id: movie._id,
        active: true,
      })
        .sort({ priority: 1 }) // nhỏ nhất trước
        .lean();

      if (!topServer) {
        return res.status(404).json({
          success: false,
          message: "No active server found for this movie",
        });
      }

      selectedServerId = topServer._id.toString();
    }

    // ✅ Phân quyền hiển thị episode
    const role = req.user?.role ?? "user";
    const allowedScopes =
      role === "vip"
        ? ["public", "vip"]
        : ["admin", "staff"].includes(role)
          ? ["public", "vip", "staff"]
          : ["public"];

    // 🧩 Lấy danh sách episode của movie + server đó
    const episodes = await Episode.find({
      movie_id: movie._id,
      server_id: selectedServerId,
      visibility_status: { $ne: "hidden" },
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
    })
      .sort({ episode_number: 1 })
      .lean();

    return res.json({
      success: true,
      server_id: selectedServerId,
      count: episodes.length,
      data: episodes,
    });
  } catch (error: any) {
    console.error("getEpisodesByMovieAndServer error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
