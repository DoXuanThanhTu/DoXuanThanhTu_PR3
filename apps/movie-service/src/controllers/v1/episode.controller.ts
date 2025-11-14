import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import EpisodeService from "../../services/v1/episode.service.js";
import { ok, error } from "../../utils/response.js";

export const getEpisodeById = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) {
    return error(res, "Episode ID is required", 400);
  }
  try {
    const data = await EpisodeService.getById(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const listEpisodes = async (req: AuthRequest, res: Response) => {
  try {
    const data = await EpisodeService.list(req.query);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const getEpisodesByMovie = async (req: AuthRequest, res: Response) => {
  if (!req.params.movieId) {
    return error(res, "Movie ID is required", 400);
  }
  try {
    const data = await EpisodeService.getByMovie(req.params.movieId);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const getEpisodesByServer = async (req: AuthRequest, res: Response) => {
  if (!req.params.serverId) {
    return error(res, "Server ID is required", 400);
  }
  try {
    const data = await EpisodeService.getByServer(req.params.serverId);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const createEpisode = async (req: AuthRequest, res: Response) => {
  try {
    const data = await EpisodeService.create(req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const updateEpisode = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) {
    return error(res, "Episode ID is required", 400);
  }
  try {
    const data = await EpisodeService.update(req.params.id, req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const deleteEpisode = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) {
    return error(res, "Episode ID is required", 400);
  }
  try {
    const data = await EpisodeService.softDelete(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};
