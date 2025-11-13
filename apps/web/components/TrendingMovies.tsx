"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TrendingMovies: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${API_URL}/movies/featured`);
        setMovies(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải trending:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Phim đang hot</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link href={`/movie/${movie._id}`}>
            <div key={movie._id} className="hover:scale-105 transition">
              <img
                src={movie.thumbUrl}
                alt={movie.name}
                className="rounded-lg object-cover w-full h-44"
              />
              <p className="text-gray-300 mt-2 text-sm text-center">
                {movie.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
