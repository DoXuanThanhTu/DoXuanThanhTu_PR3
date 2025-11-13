// controllers/movies.controller.ts
import { Request, Response } from "express";
import {
  Episode,
  Franchise,
  Movie,
  Server,
  isValidObjectId,
} from "@repo/database";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export const getAllMovies = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role || "user";
    let allowedScopes: string[] = [];

    switch (role) {
      case "vip":
        allowedScopes = ["public", "vip"];
        break;
      case "admin":
      case "staff":
        allowedScopes = ["public", "vip", "staff"];
        break;
      default:
        allowedScopes = ["public"];
    }

    const movies = await Movie.find({
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
      visibility_status: { $ne: "hidden" },
    })
      .populate({
        path: "franchise_id",
        select: "slug",
      })
      .sort({ popularity_score: -1 })
      .limit(50);
    res.json({ success: true, data: movies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMovieById = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role || "user";
    let allowedScopes: string[] = [];

    switch (role) {
      case "vip":
        allowedScopes = ["public", "vip"];
        break;
      case "admin":
      case "staff":
        allowedScopes = ["public", "vip", "staff"];
        break;
      default:
        allowedScopes = ["public"];
    }

    const movie = await Movie.findOne({
      _id: req.params.id,
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
      visibility_status: { $ne: "hidden" },
    }).populate({
      path: "franchise_id",
      select: "slug",
    });
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found or not accessible" });

    res.json({ success: true, data: movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMovieBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role || "user";
    let allowedScopes: string[] = [];

    switch (role) {
      case "vip":
        allowedScopes = ["public", "vip"];
        break;
      case "admin":
      case "staff":
        allowedScopes = ["public", "vip", "staff"];
        break;
      default:
        allowedScopes = ["public"];
    }

    const movie = await Movie.findOne({
      slug: req.params.slug,
      $or: [
        { visibility_scope: { $in: allowedScopes } },
        { visibility_scope: { $exists: false } },
      ],
      visibility_status: { $ne: "hidden" },
    }).populate({
      path: "franchise_id",
      select: "slug",
    });
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found or not accessible" });

    res.json({ success: true, data: movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: newMovie });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    res.json({ success: true, message: "Movie deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Lấy chi tiết 1 movie cùng các tập phim và franchise liên quan
 */
export const getMovieFullDetails = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    if (!idOrSlug) {
      return res.status(400).json({
        success: false,
        message: "Missing movie identifier",
      });
    }

    // 1️⃣ Tìm movie bằng ID hoặc slug
    const movie = isValidObjectId(idOrSlug)
      ? await Movie.findById(idOrSlug).lean()
      : await Movie.findOne({ slug: idOrSlug }).lean();

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // 2️⃣ Lấy danh sách server của movie này
    const servers = await Server.find({ movie_id: movie._id })
      .sort({ priority: 1 })
      .lean();

    // 3️⃣ Gắn episodes vào từng server
    const serversWithEpisodes = await Promise.all(
      servers.map(async (server) => {
        const eps = await Episode.find({ server_id: server._id })
          .sort({ episode_number: 1 })
          .lean();
        return { ...server, episodes: eps };
      })
    );

    // 4️⃣ Nếu movie có franchise → lấy thêm thông tin franchise & các movie khác
    let franchise = null;
    let relatedMovies: any[] = [];

    if (movie.franchise_id) {
      franchise = await Franchise.findById(movie.franchise_id).lean();

      const moviesInFranchise = await Movie.find({
        franchise_id: movie.franchise_id,
        _id: { $ne: movie._id },
      })
        .sort({ release_date: 1 })
        .lean();

      // Gắn servers và episodes cho từng related movie
      relatedMovies = await Promise.all(
        moviesInFranchise.map(async (m) => {
          const relServers = await Server.find({ movie_id: m._id })
            .sort({ priority: 1 })
            .lean();

          const relServersWithEpisodes = await Promise.all(
            relServers.map(async (s) => {
              const eps = await Episode.find({ server_id: s._id })
                .sort({ episode_number: 1 })
                .lean();
              return { ...s, episodes: eps };
            })
          );

          return { ...m, servers: relServersWithEpisodes };
        })
      );
    }

    // 5️⃣ Trả kết quả
    res.json({
      success: true,
      foundBy: isValidObjectId(idOrSlug) ? "id" : "slug",
      data: {
        movie,
        servers: serversWithEpisodes,
        franchise,
        relatedMovies,
      },
    });
  } catch (err) {
    console.error("Error fetching movie details:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
