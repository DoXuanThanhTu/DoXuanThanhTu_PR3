"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import type { Movie } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function FranchisePage({
  params,
}: {
  params: { slug: string };
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const currentId = searchParams.get("current");

  useEffect(() => {
    const fetchFranchiseMovies = async () => {
      try {
        setLoading(true);
        // 1️⃣ Lấy thông tin franchise theo slug
        const franchiseRes = await axios.get(
          `${API_URL}/franchises/${params.slug}`
        );
        const franchise = franchiseRes.data.data;
        if (!franchise?._id) throw new Error("Franchise không tồn tại");

        // 2️⃣ Lấy các phim thuộc franchise đó
        const moviesRes = await axios.get(
          `${API_URL}/movies?franchise_id=${franchise._id}`
        );
        const allMovies = moviesRes.data.data;

        setMovies(allMovies);

        // 3️⃣ Chọn movie hiện tại
        if (currentId) {
          const current = allMovies.find((m: Movie) => m._id === currentId);
          setCurrentMovie(current || allMovies[0]);
        } else {
          setCurrentMovie(allMovies[0]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải franchise:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseMovies();
  }, [params.slug, currentId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Đang tải...
      </div>
    );

  if (!currentMovie)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Không tìm thấy phim nào trong franchise này.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* --- Phim hiện tại --- */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative w-full md:w-1/3 aspect-[2/3]">
          <Image
            src={currentMovie.thumbnail_url || "/no_thumb.png"}
            alt={currentMovie.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-white">
            {currentMovie.name}
          </h1>
          {/* <p className="text-gray-400">{currentMovie.description}</p> */}
        </div>
      </div>

      {/* --- Danh sách các phần --- */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Các phần khác trong loạt phim
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie._id}
            href={`/franchise/${params.slug}?current=${movie._id}`}
          >
            <div
              className={`rounded-lg overflow-hidden border-2 transition-all ${
                movie._id === currentMovie._id
                  ? "border-yellow-500"
                  : "border-transparent hover:border-gray-600"
              }`}
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={movie.thumbnail_url || "/no_thumb.png"}
                  alt={movie.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2 text-center text-sm text-gray-300">
                {movie.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
