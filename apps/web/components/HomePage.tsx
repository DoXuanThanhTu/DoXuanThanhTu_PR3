"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FeaturedTabs from "./FeaturedTabs";
import SidebarUpdates from "./SidebarUpdates";
import type { Movie } from "@repo/types";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 👇 Lazy load các component nặng
const TrendingMovies = React.lazy(() => import("./TrendingMovies"));
const NewMovies = React.lazy(() => import("./NewMovies"));

// Component loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
  </div>
);

// interface Movie {
//   _id: string;
//   slug: string;
//   name: string;
//   thumbUrl?: string;
//   posterUrl?: string;
//   type: string;
//   description?: string;
// }

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrending, setShowTrending] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const trendingRef = useRef<HTMLDivElement>(null);
  const newRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- Fetch danh sách phim ban đầu ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/movies`);
        console.log(res.data.data);
        setMovies(res.data.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải phim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // --- Quan sát scroll để lazy-load ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === trendingRef.current) {
              setShowTrending(true);
              observer.unobserve(entry.target);
            }
            if (entry.target === newRef.current) {
              setShowNew(true);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    const interval = setInterval(() => {
      if (trendingRef.current && newRef.current) {
        console.log("✅ observing refs");
        observer.observe(trendingRef.current);
        observer.observe(newRef.current);
        clearInterval(interval);
      }
    }, 200); // chờ mount (fix cho React hydration)

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

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

      {/* --- Phim chính hiển thị trước --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.slice(0, 8).map((movie) => (
          <Link
            key={movie._id}
            href={
              typeof movie.franchise_id === "object" && movie.franchise_id?.slug
                ? `/franchise/${movie.franchise_id.slug}?current=${movie._id}`
                : `/movie/${movie.slug}` // fallback nếu chưa có populate
            }
          >
            <div
              key={movie._id}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <div className="bg-black aspect-2/3 overflow-hidden rounded-lg">
                <Image
                  src={movie.thumbnail_url || "/no_thumb.png"}
                  alt={movie.name}
                  className="w-full h-full object-center"
                  width={300}
                  height={400}
                />
                {movie.thumbnail_url}
              </div>
              <h2 className="mt-2 font-semibold text-center text-gray-200">
                {movie.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* --- Lazy load TrendingMovies --- */}
      {/* <div ref={trendingRef} className="mt-16 min-h-[200px]">
        {showTrending ? (
          <Suspense fallback={<LoadingSpinner />}>
            <TrendingMovies />
          </Suspense>
        ) : (
          <LoadingSpinner />
        )}
      </div> */}

      {/* --- Lazy load NewMovies --- */}
      {/* <div ref={newRef} className="mt-16 min-h-[200px]">
        {showNew ? (
          <Suspense fallback={<LoadingSpinner />}>
            <NewMovies />
          </Suspense>
        ) : (
          <LoadingSpinner />
        )}
      </div> */}
      {/* <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
        <div className="lg:col-span-3 space-y-8">
          <FeaturedTabs />
        </div>
        <div>
          <SidebarUpdates />
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
