import { Request, Response, NextFunction, RequestHandler } from "express";
import { Franchise, Movie } from "@repo/database";
import { AuthRequest } from "../middlewares/auth.middleware.js";

// ✅ asyncHandler giữ nguyên
export const asyncHandler =
  <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };

// ✅ Helper response
const handleResponse = (
  res: Response,
  status: number,
  success: boolean,
  data?: any,
  message?: string
) => {
  res.status(status).json({ success, data, message });
};

// ✅ Thêm type annotation cho mỗi export
export const getAllFranchises: RequestHandler = asyncHandler<AuthRequest>(
  async (req, res) => {
    const franchises = await Franchise.find().lean();
    handleResponse(res, 200, true, franchises);
  }
);

export const getFranchiseDetail: RequestHandler = asyncHandler<AuthRequest>(
  async (req, res) => {
    const { idOrSlug } = req.params;

    const franchise =
      (await Franchise.findById(idOrSlug).lean()) ||
      (await Franchise.findOne({ slug: idOrSlug }).lean());

    if (!franchise)
      return handleResponse(res, 404, false, null, "Không tìm thấy franchise");

    const movies = await Movie.find({
      $or: [
        { franchise_id: franchise._id },
        { "franchise_id._id": franchise._id },
      ],
    })
      .select("_id slug titles poster_url banner_url release_date type")
      .lean();

    handleResponse(res, 200, true, { ...franchise, movies });
  }
);

export const createFranchise: RequestHandler = asyncHandler<AuthRequest>(
  async (req, res) => {
    const franchise = new Franchise(req.body);
    await franchise.save();
    handleResponse(res, 201, true, franchise);
  }
);

export const updateFranchise: RequestHandler = asyncHandler<AuthRequest>(
  async (req, res) => {
    const { id } = req.params;
    const updated = await Franchise.findByIdAndUpdate(id, req.body, {
      new: true,
    }).lean();

    if (!updated)
      return handleResponse(res, 404, false, null, "Không tìm thấy franchise");

    handleResponse(res, 200, true, updated);
  }
);

export const deleteFranchise: RequestHandler = asyncHandler<AuthRequest>(
  async (req, res) => {
    const { id } = req.params;
    const deleted = await Franchise.findByIdAndDelete(id);

    if (!deleted)
      return handleResponse(res, 404, false, null, "Không tìm thấy franchise");

    handleResponse(res, 200, true, null, "Đã xóa thành công");
  }
);
