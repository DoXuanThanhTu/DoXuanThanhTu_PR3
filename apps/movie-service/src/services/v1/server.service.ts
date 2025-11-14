import { Server, Episode, isValidObjectId } from "@repo/database";

class ServerService {
  /**
   * Lấy 1 server theo ID
   */
  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid server ID");
    }

    const server = await Server.findById(id);
    if (!server || server.is_deleted) {
      throw new Error("Server not found");
    }

    return server;
  }

  /**
   * Lấy tất cả server (không filter)
   */
  async getAll() {
    return Server.find({ is_deleted: false })
      .populate({
        path: "movie_id",
        select: "slug titles",
      })
      .sort({ order: 1 });
  }

  /**
   * List server có phân trang + filter theo movie_id
   */
  async list(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filters: any = { is_deleted: false };

    if (query.movie_id) filters.movie_id = query.movie_id;

    const [items, total] = await Promise.all([
      Server.find(filters)
        .populate({
          path: "movie_id",
          select: "slug titles",
        })
        .sort({ order: 1 })
        .skip(skip)
        .limit(limit),

      Server.countDocuments(filters),
    ]);

    return {
      items,
      total,
      page,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy server theo movie
   */
  async getByMovie(movieId: string) {
    if (!isValidObjectId(movieId)) {
      throw new Error("Invalid movie ID");
    }

    return Server.find({
      movie_id: movieId,
      is_deleted: false,
    })
      .populate({
        path: "movie_id",
        select: "slug titles",
      })
      .sort({ order: 1 });
  }

  /**
   * Tạo server mới
   */
  async create(data: any) {
    return Server.create(data);
  }

  /**
   * Cập nhật server
   */
  async update(id: string, data: any) {
    const server = await this.getById(id);
    Object.assign(server, data);
    return server.save();
  }

  /**
   * Soft delete server
   */
  async softDelete(id: string) {
    const server = await this.getById(id);
    server.is_deleted = true;

    // Nếu cần, xoá mềm cả episodes của server này (optional)
    await Episode.updateMany({ server_id: id }, { $set: { is_deleted: true } });

    return server.save();
  }
}

export default new ServerService();
