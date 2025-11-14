import { Franchise, Movie, isValidObjectId } from "@repo/database";

class FranchiseService {
  /**
   * Lấy tất cả franchise
   */
  async getAll() {
    return Franchise.find({ is_deleted: false }).sort({ createdAt: -1 });
  }

  /**
   * Lấy franchise theo ID
   */
  async getById(id: string) {
    if (!isValidObjectId(id)) throw new Error("Invalid franchise ID");

    const data = await Franchise.findById(id);
    if (!data || data.is_deleted) throw new Error("Franchise not found");

    return data;
  }

  /**
   * Lấy franchise theo slug
   */
  async getBySlug(slug: string) {
    const data = await Franchise.findOne({ slug, is_deleted: false });
    if (!data) throw new Error("Franchise not found");
    return data;
  }

  /**
   * List franchise — pagination
   */
  async list(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filters: any = { is_deleted: false };

    const [items, total] = await Promise.all([
      Franchise.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),

      Franchise.countDocuments(filters),
    ]);

    return {
      items,
      total,
      page,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Tạo franchise
   */
  async create(data: any) {
    return Franchise.create(data);
  }

  /**
   * Update franchise
   */
  async update(id: string, data: any) {
    const item = await this.getById(id);
    Object.assign(item, data);
    return item.save();
  }

  /**
   * Soft delete franchise
   */
  async softDelete(id: string) {
    const item = await this.getById(id);
    item.is_deleted = true;

    // Optionally: soft delete tất cả movie trong franchise
    await Movie.updateMany(
      { franchise_id: id },
      { $set: { is_deleted: true } }
    );

    return item.save();
  }

  /**
   * Lấy danh sách movie của 1 franchise
   */
  async getMovies(franchiseId: string) {
    if (!isValidObjectId(franchiseId)) throw new Error("Invalid franchise ID");

    return Movie.find({
      franchise_id: franchiseId,
      is_deleted: false,
    })
      .sort({ season_number: 1 })
      .select("titles slug poster_url season_number type");
  }
}

export default new FranchiseService();
