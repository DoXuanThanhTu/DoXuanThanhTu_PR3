"use client";
import React from "react";
import Image from "next/image";
import { Movie } from "@repo/types";

const MovieInfo = ({ movie }: { movie?: Movie }) => {
  if (!movie) return null;
  return (
    <div className="mx-auto grid grid-cols-1 gap-8">
      {/* Poster */}
      <div className="flex justify-center">
        <div className="relative w-[200px] h-[300px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={movie.thumbnail_url || "/no_poster.png"}
            alt={movie.slug ? `${movie.slug}-poster` : "Poster phim"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          {movie?.titles && (
            <div>
              <h1 className="text-3xl font-bold">
                {movie.titles.find((t) => t.is_primary)?.title ??
                  "Chưa có tiêu đề"}
              </h1>
              {(() => {
                const secondary = movie.titles.find((t) => t.lang === "en");
                return secondary ? (
                  <p className="text-lg text-purple-400 italic">
                    {secondary.title}
                  </p>
                ) : null;
              })()}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
            <span className="bg-yellow-600 px-2 py-1 rounded capitalize">
              {movie.type ?? "unknown"}
            </span>

            {/* Giới hạn độ tuổi (content rating) */}
            {movie.content_rating?.rating && (
              <span className="bg-neutral-800 px-2 py-1 rounded">
                {movie.content_rating.rating}
              </span>
            )}

            {/* Năm phát hành */}
            {movie.release_date && (
              <span className="bg-neutral-800 px-2 py-1 rounded">
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}

            {/* Số phần (nếu có) */}
            {movie.season_number && (
              <span className="bg-neutral-800 px-2 py-1 rounded">
                Phần {movie.season_number}
              </span>
            )}

            {/* Tập hiện tại (nếu có metadata) */}
            {movie.metadata?.episode_current && (
              <span className="bg-neutral-800 px-2 py-1 rounded">
                {movie.metadata.episode_current}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {movie.genres &&
              movie.genres.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-600/20 border border-purple-600 text-purple-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-300 mt-2">
              Đã chiếu:{" "}
              {movie.metadata?.episode_current
                ? movie.metadata.episode_current.replace("Tập ", "")
                : "?"}{" "}
              / {movie.total_episodes ?? "?"} tập
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Giới thiệu:</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              {(movie.description &&
                Object.values(movie.description || {})[0]) ||
                "Chưa có mô tả cho phim này."}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-semibold text-white">Thời lượng:</p>
              <p>{movie.duration}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Quốc gia:</p>
              <p>{movie.countries}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Networks:</p>
              <p>TV Aichi, TV Osaka, TV Tokyo</p>
            </div>
            <div>
              <p className="font-semibold text-white">Đạo diễn:</p>
              <p>Chikara Sakurai</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-white">Sản xuất:</p>
            <p className="text-gray-300 text-sm">
              Banpresto, Bandai Visual, Lantis, Madhouse, Good Smile Company,
              Asatsu-DK, TV Tokyo, jeki, Shueisha, J.C.STAFF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
