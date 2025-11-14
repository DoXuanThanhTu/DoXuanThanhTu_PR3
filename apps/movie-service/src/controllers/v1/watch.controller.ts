import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import * as WatchService from "../../services/v1/watch.service.js";
import { ok, error } from "../../utils/response.js";

export const getWatchData = async (req: AuthRequest, res: Response) => {
  try {
    const { movieSlug } = req.params;
    if (!movieSlug) return error(res, "movieSlug is required", 400);

    const data = await WatchService.getWatchData(movieSlug);
    return ok(res, data);
  } catch (err: any) {
    return error(
      res,
      err.message,
      err.message === "Movie not found" ? 404 : 500
    );
  }
};
