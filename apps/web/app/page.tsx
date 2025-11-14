"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import axios from "axios";
// import FeaturedTabs from "./FeaturedTabs";
// import SidebarUpdates from "./SidebarUpdates";
import type { Movie } from "@repo/types";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL;

// const TrendingMovies = React.lazy(() => import("./TrendingMovies"));
// const NewMovies = React.lazy(() => import("./NewMovies"));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
  </div>
);

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  // const [showTrending, setShowTrending] = useState(false);
  // const [showNew, setShowNew] = useState(false);

  // const trendingRef = useRef<HTMLDivElement>(null);
  // const newRef = useRef<HTMLDivElement>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/movies`);
        setMovies(res.data.data.items);
      } catch (error) {
        console.error("❌ Lỗi khi tải phim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           if (entry.target === trendingRef.current) {
  //             setShowTrending(true);
  //             observer.unobserve(entry.target);
  //           }
  //           if (entry.target === newRef.current) {
  //             setShowNew(true);
  //             observer.unobserve(entry.target);
  //           }
  //         }
  //       });
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (trendingRef.current) observer.observe(trendingRef.current);
  //   if (newRef.current) observer.observe(newRef.current);

  //   return () => observer.disconnect();
  // }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-left text-white">
        Danh sách phim
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.slice(0, 8).map((movie) => (
          <Link key={movie._id} href={`/movie/${movie.slug}`}>
            <div className="cursor-pointer transition-transform hover:scale-105">
              <div className="bg-black aspect-2/3 overflow-hidden rounded-lg">
                <Image
                  src={movie.thumbnail_url || "/no_thumb.png"}
                  alt={movie.name || "movie_name"}
                  className="w-full h-full object-center"
                  width={300}
                  height={400}
                />
              </div>
              <h2 className="mt-2 font-semibold text-center text-gray-200">
                {movie.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
