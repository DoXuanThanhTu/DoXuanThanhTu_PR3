import { Response } from "express";
import MovieService from "../../services/v1/movie.service.js";
import { ok, error } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

/**
 * GET ALL MOVIES
 */
export const getMovies = async (req: AuthRequest, res: Response) => {
  try {
    const data = await MovieService.getMovies();
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

/**
 * GET MOVIE BY ID
 */
export const getMovieById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id) {
      return error(res, "Movie ID is required", 400);
    }

    const data = await MovieService.getById(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

/**
 * GET MOVIE BY SLUG
 */
export const getMovieBySlug = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.slug) {
      return error(res, "Slug is required", 400);
    }

    const data = await MovieService.getBySlug(req.params.slug);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

/**
 * LIST MOVIES WITH QUERY
 */
export const listMovies = async (req: AuthRequest, res: Response) => {
  try {
    const data = await MovieService.list(req.query);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

/**
 * CREATE MOVIE
 */
export const createMovie = async (req: AuthRequest, res: Response) => {
  try {
    const data = await MovieService.create(req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

/**
 * UPDATE MOVIE
 */
export const updateMovie = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id) {
      return error(res, "Movie ID is required", 400);
    }

    const data = await MovieService.update(req.params.id, req.body);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

/**
 * SOFT DELETE MOVIE
 */
export const deleteMovie = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id) {
      return error(res, "Movie ID is required", 400);
    }

    const data = await MovieService.softDelete(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message);
  }
};

/**
 * GET FULL MOVIE DETAILS (servers + episodes grouped)
 */
export const getMovieFullDetail = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id) {
      return error(res, "Movie ID is required", 400);
    }

    const data = await MovieService.getFullDetail(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};

/**
 * GET RELATED MOVIES IN FRANCHISE
 */
export const getRelatedMovies = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id) {
      return error(res, "Movie ID is required", 400);
    }

    const data = await MovieService.getRelatedByFranchise(req.params.id);
    return ok(res, data);
  } catch (err: any) {
    return error(res, err.message, 404);
  }
};
