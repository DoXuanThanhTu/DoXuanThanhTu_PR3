// controllers/movies.controller.ts
import { Request, Response } from "express";
import { Movie } from "@repo/database";
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
