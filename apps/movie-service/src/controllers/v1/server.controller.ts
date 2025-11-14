import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import ServerService from "../../services/v1/server.service.js";
import { ok, error } from "../../utils/response.js";

export const getServers = async (req: AuthRequest, res: Response) => {
  try {
    const data = await ServerService.list(req.query);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const getServerById = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing server ID", 400);

  try {
    const data = await ServerService.getById(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const getServersByMovie = async (req: AuthRequest, res: Response) => {
  if (!req.params.movieId) return error(res, "Missing movie ID", 400);

  try {
    const data = await ServerService.getByMovie(req.params.movieId);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const createServer = async (req: AuthRequest, res: Response) => {
  try {
    const data = await ServerService.create(req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const updateServer = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing server ID", 400);

  try {
    const data = await ServerService.update(req.params.id, req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const deleteServer = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing server ID", 400);

  try {
    const data = await ServerService.softDelete(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};
