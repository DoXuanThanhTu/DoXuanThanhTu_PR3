"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Movie {
  _id: string;
  slug: string;
  name: string;
  episode: string | number;
}

export default function SidebarUpdates() {
  const [updates, setUpdates] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/movies/home/latest`);
        setUpdates(res.data || []);
      } catch (error) {
        console.error("Error fetching latest movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white w-full max-w-xs">
      <h2 className="font-semibold text-lg mb-3 border-b border-gray-700 pb-2">
        Phim mới cập nhật
      </h2>

      {updates.length === 0 ? (
        <p className="text-gray-400 text-sm">Đang tải...</p>
      ) : (
        <ul className="space-y-2">
          {updates.map((movie) => (
            <li
              key={movie._id}
              className="flex justify-between items-center text-sm text-gray-300 hover:text-white"
            >
              <Link
                href={`/movie/${movie._id}`}
                className="truncate max-w-[60%] hover:text-yellow-400 transition-colors"
                title={movie.name}
              >
                {movie.name}
              </Link>

              <span className="text-gray-400 text-right truncate max-w-[40%]">
                {typeof movie.episode === "string"
                  ? movie.episode
                  : `Tập ${movie.episode}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
