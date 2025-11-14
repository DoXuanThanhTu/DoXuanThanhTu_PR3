import { Movie, Episode, Server, isValidObjectId } from "@repo/database";

class MovieService {
  async getMovies() {
    return Movie.find({ is_deleted: false }).sort({ release_date: -1 });
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid movie ID");
    }

    const movie = await Movie.findById(id);
    if (!movie || movie.is_deleted) {
      throw new Error("Movie not found");
    }

    return movie;
  }

  async getBySlug(slug: string) {
    const movie = await Movie.findOne({ slug, is_deleted: false });
    if (!movie) {
      throw new Error("Movie not found");
    }
    return movie;
  }

  async list(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filters: any = { is_deleted: false };
    if (query.genre) filters.genres = query.genre;
    if (query.status) filters.status = query.status;
    if (query.type) filters.type = query.type;
    if (query.franchise_id) filters.franchise_id = query.franchise_id;

    const [items, total] = await Promise.all([
      Movie.find(filters).sort({ release_date: -1 }).skip(skip).limit(limit),

      Movie.countDocuments(filters),
    ]);

    return {
      items,
      total,
      page,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Create movie
   */
  async create(data: any) {
    return Movie.create(data);
  }

  /**
   * Update movie
   */
  async update(id: string, data: any) {
    const movie = await this.getById(id);
    Object.assign(movie, data);
    return movie.save();
  }

  /**
   * Soft delete
   */
  async softDelete(id: string) {
    const movie = await this.getById(id);
    movie.is_deleted = true;
    return movie.save();
  }

  /**
   * Get movie with servers + episodes grouped by server
   */
  async getFullDetail(id: string) {
    const movie = await this.getById(id);

    const servers = await Server.find({ movie_id: id, is_deleted: false });

    const episodes = await Episode.find({
      movie_id: id,
      is_deleted: false,
    }).sort({ episode_number: 1 });

    // Group episodes by server
    const serverMap: Record<string, any[]> = {};
    servers.forEach((s) => {
      serverMap[s._id.toString()] = [];
    });

    episodes.forEach((ep) => {
      const sid = ep.server_id?.toString();
      if (sid && serverMap[sid]) {
        serverMap[sid].push(ep);
      }
    });

    return {
      movie,
      servers: servers.map((s) => ({
        ...s.toObject(),
        episodes: serverMap[s._id.toString()] || [],
      })),
    };
  }

  /**
   * Get movies in same franchise (other seasons)
   */
  async getRelatedByFranchise(movieId: string) {
    const movie = await this.getById(movieId);

    if (!movie.franchise_id) return [];

    return Movie.find({
      franchise_id: movie.franchise_id,
      _id: { $ne: movie._id },
      is_deleted: false,
    })
      .sort({ season_number: 1 })
      .select("titles slug season_number poster_url type");
  }
}

export default new MovieService();
