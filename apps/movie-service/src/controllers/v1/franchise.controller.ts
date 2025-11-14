import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import FranchiseService from "../../services/v1/franchise.service.js";
import { ok, error } from "../../utils/response.js";

export const getFranchises = async (req: AuthRequest, res: Response) => {
  try {
    const data = await FranchiseService.list(req.query);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const getFranchiseById = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing franchise ID", 400);

  try {
    const data = await FranchiseService.getById(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const getFranchiseBySlug = async (req: AuthRequest, res: Response) => {
  if (!req.params.slug) return error(res, "Missing franchise slug", 400);

  try {
    const data = await FranchiseService.getBySlug(req.params.slug);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

export const getMoviesInFranchise = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing franchise ID", 400);

  try {
    const data = await FranchiseService.getMovies(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const createFranchise = async (req: AuthRequest, res: Response) => {
  try {
    const data = await FranchiseService.create(req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const updateFranchise = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing franchise ID", 400);

  try {
    const data = await FranchiseService.update(req.params.id, req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const deleteFranchise = async (req: AuthRequest, res: Response) => {
  if (!req.params.id) return error(res, "Missing franchise ID", 400);

  try {
    const data = await FranchiseService.softDelete(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};
