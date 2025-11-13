"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const NewMovies: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const res = await axios.get(`${API_URL}/movies/updated`);
        setMovies(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải phim mới:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNew();
  }, []);

  // Kiểm tra nếu danh sách bị tràn ngang (dài hơn container)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const checkOverflow = () => {
      setShowArrows(slider.scrollWidth > slider.clientWidth + 10);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 border-4 border-t-transparent border-green-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-white mb-4">Phim mới cập nhật</h2>

      <div className="relative">
        {/* Mũi tên trái/phải */}
        {showArrows && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Danh sách phim */}
        <div
          ref={sliderRef}
          className="
            flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth
            scrollbar-hide
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            py-2
          "
        >
          {movies.map((movie) => (
            <Link href={`/movie/${movie._id}`}>
              <div
                key={movie._id}
                className="min-w-[160px] flex-shrink-0 hover:scale-105 transition"
              >
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
    </div>
  );
};

export default NewMovies;
