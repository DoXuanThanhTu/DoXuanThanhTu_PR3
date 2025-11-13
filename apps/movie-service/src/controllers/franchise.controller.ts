import { Request, Response } from "express";
import { Franchise } from "@repo/database";

/**
 * Lấy danh sách tất cả franchise
 */
export const getAllFranchises = async (req: Request, res: Response) => {
  try {
    const franchises = await Franchise.find()
      .sort({ popularity_score: -1 })
      .lean();

    res.json({ success: true, data: franchises });
  } catch (err) {
    console.error("Error fetching franchises:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Lấy chi tiết franchise theo slug hoặc id
 */
export const getFranchiseBySlugOrId = async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;

    const franchise = await Franchise.findOne({
      $or: [{ slug: slugOrId }, { _id: slugOrId }],
    }).lean();

    if (!franchise) {
      return res
        .status(404)
        .json({ success: false, message: "Franchise not found" });
    }

    res.json({ success: true, data: franchise });
  } catch (err) {
    console.error("Error fetching franchise:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Tạo mới một franchise
 */
export const createFranchise = async (req: Request, res: Response) => {
  try {
    const { slug } = req.body;

    const existing = await Franchise.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Slug already exists" });
    }

    const franchise = new Franchise(req.body);
    await franchise.save();

    res.status(201).json({ success: true, data: franchise });
  } catch (err) {
    console.error("Error creating franchise:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Cập nhật franchise theo slug hoặc id
 */
export const updateFranchise = async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;

    const updated = await Franchise.findOneAndUpdate(
      { $or: [{ slug: slugOrId }, { _id: slugOrId }] },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Franchise not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating franchise:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Xóa franchise theo slug hoặc id
 */
export const deleteFranchise = async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;

    const deleted = await Franchise.findOneAndDelete({
      $or: [{ slug: slugOrId }, { _id: slugOrId }],
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Franchise not found" });
    }

    res.json({ success: true, message: "Franchise deleted" });
  } catch (err) {
    console.error("Error deleting franchise:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
