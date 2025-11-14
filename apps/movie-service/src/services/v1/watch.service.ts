import { Movie, Server, Episode } from "@repo/database";

export const getWatchData = async (movieSlug: string) => {
  const movie = await Movie.findOne({ slug: movieSlug }).lean();
  if (!movie) throw new Error("Movie not found");

  const servers = await Server.find({ movie_id: movie._id, active: true })
    .sort({ priority: -1 })
    .lean();

  const episodes = await Episode.find({ movie_id: movie._id }).lean();

  const serverMap = servers.map((server) => ({
    ...server,
    episodes: episodes
      .filter((ep) => ep.server_id?.toString() === server._id.toString())
      .sort((a, b) => (a.episode_number || 0) - (b.episode_number || 0)),
  }));

  return { movie, servers: serverMap };
};
