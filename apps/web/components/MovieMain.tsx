"use client";
import { Heart, MessageCircle, Play, Plus, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface Episode {
  _id: string;
  episode_number: number;
  link_m3u8: string;
}

interface Server {
  _id: string;
  name: string;
  episodes: Episode[];
}

interface Movie {
  _id: string;
  slug: string;
  season_number?: number;
  titles: { title: string; lang: string }[];
  thumbnail_url?: string;
  servers?: Server[];
}

interface FranchiseData {
  movie: Movie;
  servers: Server[];
  relatedMovies: Movie[];
}

interface MovieMainProps {
  data: FranchiseData;
}

const MovieMain: React.FC<MovieMainProps> = ({ data }) => {
  const { movie, servers, relatedMovies } = data;

  const allMovies: Movie[] = [movie, ...relatedMovies].sort(
    (a, b) => (a.season_number ?? 0) - (b.season_number ?? 0)
  );

  const [selectedMovie, setSelectedMovie] = useState<Movie>(movie);
  const [selectedServer, setSelectedServer] = useState<Server | null>(
    servers?.[0] ?? null
  );

  const getServersForMovie = (m: Movie): Server[] => {
    if (m._id === movie._id) return servers ?? [];
    return m.servers ?? [];
  };

  const handleSelectMovie = (movieId: string) => {
    const found = allMovies.find((m) => m._id === movieId);
    if (found) {
      setSelectedMovie(found);
      const movieServers = getServersForMovie(found);
      setSelectedServer(movieServers[0] ?? null);
    }
  };

  const handleSelectServer = (serverId: string) => {
    const movieServers = getServersForMovie(selectedMovie);
    const found = movieServers.find((s) => s._id === serverId);
    if (found) setSelectedServer(found);
  };

  const movieServers = getServersForMovie(selectedMovie);

  const tabs = [
    { id: "episode", name: "Tập phim" },
    { id: "gallery", name: "Gallery" },
    { id: "cast", name: "Diễn viên" },
    { id: "recommend", name: "Đề xuất" },
  ];

  const [activeTab, setActiveTab] = useState<string>("episode");

  return (
    <div className="bg-gray-900 text-white p-5 rounded-2xl">
      {/* --- Nút hành động --- */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/watch/${movie.slug}?ep=1`}
          className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full hover:bg-yellow-400 transition"
        >
          <Play className="w-5 h-5" /> Xem Ngay
        </Link>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">
          <Heart className="w-4 h-4" /> Yêu thích
        </button>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">
          <Plus className="w-4 h-4" /> Thêm vào
        </button>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">
          <Share2 className="w-4 h-4" /> Chia sẻ
        </button>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">
          <MessageCircle className="w-4 h-4" /> Bình luận
        </button>
      </div>

      {/* --- Tabs header --- */}
      <div className="flex gap-4 mt-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* --- Nội dung theo tab --- */}
      <div className="mt-6">
        {activeTab === "episode" && (
          <div>
            {/* Dropdown phần phim */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-400 mr-2">Chọn phần:</span>
                <select
                  className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg text-sm"
                  value={selectedMovie._id}
                  onChange={(e) => handleSelectMovie(e.target.value)}
                >
                  {allMovies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.titles?.[0]?.title ?? `Phần ${m.season_number}`}
                    </option>
                  ))}
                </select>
              </div>

              {movieServers.length > 0 && (
                <div>
                  <span className="text-sm text-gray-400 mr-2">
                    Chọn server:
                  </span>
                  <select
                    className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg text-sm"
                    value={selectedServer?._id ?? ""}
                    onChange={(e) => handleSelectServer(e.target.value)}
                  >
                    {movieServers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Danh sách tập */}
            {selectedServer && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Danh sách tập ({selectedServer.episodes.length}):
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedServer.episodes.map((ep) => (
                    <Link
                      key={ep._id}
                      href={`/watch/${movie.slug}?ep=${ep.episode_number}`}
                      className="block bg-gray-800 hover:bg-purple-600 transition rounded-lg p-2 text-center text-sm"
                    >
                      Tập {ep.episode_number}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="text-gray-400 italic">Chưa có hình ảnh gallery.</div>
        )}

        {activeTab === "cast" && (
          <div className="text-gray-400 italic">
            Chưa có danh sách diễn viên.
          </div>
        )}

        {activeTab === "recommend" && (
          <div className="flex flex-wrap gap-5">
            {relatedMovies.map((m) => (
              <div
                key={m._id}
                className="w-[200px] rounded-lg overflow-hidden shadow-lg flex flex-col bg-gray-800"
              >
                {/* Ảnh */}
                <div className="relative w-full h-[280px]">
                  <Link href={`/movie/${m.slug ?? m._id}`}>
                    <Image
                      src={m.thumbnail_url || "/no_thumb.png"}
                      alt={m.titles?.[0]?.title || ""}
                      className="object-cover"
                      fill
                    />
                  </Link>
                </div>

                {/* Tiêu đề */}
                <div className="p-2 text-sm text-center text-white bg-gray-900">
                  {m.titles?.[0]?.title || "Không rõ tên"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieMain;
