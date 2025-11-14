import { Episode, isValidObjectId } from "@repo/database";

class EpisodeService {
  /**
   * Lấy 1 tập theo ID
   */
  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid episode ID");
    }

    const ep = await Episode.findById(id);
    if (!ep || ep.is_deleted) {
      throw new Error("Episode not found");
    }

    return ep;
  }

  /**
   * Lấy danh sách tất cả tập (không filter theo movie hay server)
   */
  async getAll() {
    return Episode.find({ is_deleted: false }).sort({ episode_number: 1 });
  }

  /**
   * List episode theo query: movie_id, server_id
   */
  async list(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filters: any = { is_deleted: false };

    if (query.movie_id) filters.movie_id = query.movie_id;
    if (query.server_id) filters.server_id = query.server_id;

    const [items, total] = await Promise.all([
      Episode.find(filters).sort({ episode_number: 1 }).skip(skip).limit(limit),

      Episode.countDocuments(filters),
    ]);

    return {
      items,
      total,
      page,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy các tập thuộc 1 movie
   */
  async getByMovie(movieId: string) {
    if (!isValidObjectId(movieId)) throw new Error("Invalid movie ID");

    return Episode.find({
      movie_id: movieId,
      is_deleted: false,
    }).sort({ episode_number: 1 });
  }

  /**
   * Lấy tập theo server
   */
  async getByServer(serverId: string) {
    if (!isValidObjectId(serverId)) throw new Error("Invalid server ID");

    return Episode.find({
      server_id: serverId,
      is_deleted: false,
    }).sort({ episode_number: 1 });
  }

  /**
   * Tạo tập
   */
  async create(data: any) {
    return Episode.create(data);
  }

  /**
   * Cập nhật tập
   */
  async update(id: string, data: any) {
    const ep = await this.getById(id);
    Object.assign(ep, data);
    return ep.save();
  }

  /**
   * Xoá mềm tập
   */
  async softDelete(id: string) {
    const ep = await this.getById(id);
    ep.is_deleted = true;
    return ep.save();
  }
}

export default new EpisodeService();
