"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Play, Heart, Plus, Share2, MessageCircle } from "lucide-react";
import type { Movie, Episode } from "@repo/types";
// import CommentSection from "@/components/CommentSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MovieDetailPage: React.FC = () => {
  const params = useParams();
  const movieSlug = params.slug as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  //   const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get(`${API_URL}/movies/slug/${movieSlug}`);
        const episodeRes = await axios.get(
          `${API_URL}/episodes/movie-slug/${movieSlug}`
        );

        const movieData = movieRes.data.data;

        setMovie(movieData);
        setEpisodes(episodeRes.data.data);

        // // Gợi ý: Lấy các phim cùng thể loại (genres)
        // if (movieData.genres && movieData.genres.length > 0) {
        //   const genre = movieData.genres[0];
        //   const relatedRes = await axios.get<Movie[]>(
        //     `${API_URL}/movies?genre=${genre}`
        //   );
        //   const filtered = relatedRes.data.filter((m) => m._id !== movieSlug);
        //   setRelatedMovies(filtered.slice(0, 8));
        // }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieSlug]);

  if (loading)
    return <p className="text-center text-gray-400 mt-10">Đang tải...</p>;
  if (!movie)
    return (
      <p className="text-center text-red-400 mt-10">Không tìm thấy phim</p>
    );

  // Hàm tiện ích lấy title chính theo ngôn ngữ
  const getTitle = (titles: Movie["titles"], lang = "vi") => {
    if (titles) {
      const primary = titles.find((t) => t.is_primary) || titles[0];
      const localized = titles.find((t) => t.lang === lang);
      return localized?.title || primary?.title || "Không có tiêu đề";
    }
    return;
  };

  return (
    <div className="bg-[#0f0f10] min-h-screen text-white">
      {/* Background banner */}
      <div
        className="min-h-[400px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${movie.banner_url || "/no_banner.png"})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-[#0f0f10] via-[#0f0f10]/60 to-transparent" />
      </div>

      {/* Thông tin phim */}
      <div className="max-w-6xl mx-auto px-4 relative mt-2 flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="min-w-[220px] md:w-1/4">
          <img
            src={movie.poster_url || "/no-poster.png"}
            alt={getTitle(movie.titles) || ""}
            width={300}
            height={450}
            className="rounded-lg shadow-lg object-cover w-[300px] h-[450px]"
          />
        </div>

        {/* Nội dung */}
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{getTitle(movie.titles)}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            {movie.release_date && (
              <span>{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.duration && <span>{movie.duration} phút</span>}
            {movie.type && <span>{movie.type.toUpperCase()}</span>}
            {movie.total_episodes && <span>{movie.total_episodes} tập</span>}
          </div>

          {/* Thể loại */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {movie.genres.map((g) => (
                <Link
                  key={g}
                  href={`/genre/${encodeURIComponent(g)}`}
                  className="bg-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-600 transition"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Link
              href={`/watch/${movieSlug}?ep=1`}
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

          {/* Giới thiệu */}
          {movie.description?.vi && (
            <div className="mt-4 ">
              <h3 className="font-semibold text-lg mb-1">Giới thiệu:</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {movie.description.vi}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách tập phim */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Tập phim
        </h2>
        {episodes.length === 0 ? (
          <p className="text-gray-400">Chưa có tập nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {episodes.map((ep) => (
              <Link
                key={ep._id}
                href={`/watch/${movie.slug}?ep=${ep.episode_number}`}
                className="block bg-gray-800 text-white text-sm p-2 rounded text-center hover:bg-yellow-500 hover:text-black transition"
              >
                Tập {ep.episode_number}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bình luận */}
      {/* <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="bg-gray-900/50 rounded-xl p-4 shadow-md">
          <CommentSection movieId={movie._id} />
        </div>
      </div> */}

      {/* 🎬 Phim cùng thể loại */}
      {/* <div className="max-w-6xl mx-auto px-4 mt-10 pb-16">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Phim cùng thể loại
        </h2>
        {relatedMovies.length === 0 ? (
          <p className="text-gray-400">Không có phim cùng thể loại.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {relatedMovies.map((m) => (
              <Link
                key={m._id}
                href={`/movie/${m._id}`}
                className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition"
              >
                <Image
                  src={m.poster_url || "/no-poster.png"}
                  alt={getTitle(m.titles) || ""}
                  className="w-full h-60 object-cover"
                />
                <div className="p-2 text-sm text-center text-white truncate">
                  {getTitle(m.titles)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default MovieDetailPage;
