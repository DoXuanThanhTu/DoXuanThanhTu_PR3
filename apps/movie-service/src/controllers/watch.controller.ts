// controllers/watch.controller.ts
import { Movie, Server, Episode } from "@repo/database";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { Response } from "express";

export const getWatchData = async (req: AuthRequest, res: Response) => {
  try {
    const { movieSlug } = req.params;

    const movie = await Movie.findOne({ slug: movieSlug }).lean();
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // Lấy danh sách server thuộc movie
    const servers = await Server.find({ movie_id: movie._id, active: true })
      .sort({ priority: -1 })
      .lean();

    // Lấy tất cả tập thuộc movie
    const episodes = await Episode.find({ movie_id: movie._id }).lean();

    // Gom nhóm các tập theo server_id
    const serverMap = servers.map((server) => ({
      ...server,
      episodes: episodes
        .filter((ep) => ep.server_id?.toString() === server._id.toString())
        .sort((a, b) => (a.episode_number || 0) - (b.episode_number || 0)),
    }));

    return res.json({
      success: true,
      data: {
        movie,
        servers: serverMap,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
