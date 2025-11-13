"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// interface Movie {
//   _id: string;
//   name: string;
//   thumbUrl: string;
//   slug: string;
//   episodes?: number;
//   views?: number;
//   rating?: number;
// }
import type { Movie } from "@repo/types";

export default function MovieGrid({ category }: { category: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/movies/${category}`)
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading)
    return <div className="text-center py-10 text-gray-400">Đang tải...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {movies.map((m) => (
        <Link key={m._id} href={`/movie/${m._id}`}>
          <div className="relative rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
            <img
              src={m.thumbnail_url || "no_thumb.png"}
              alt={""}
              className="w-full h-52 object-cover"
            />
            {/* <div className="absolute top-1 left-1 bg-red-600 text-xs px-2 py-1 rounded">
              {m.episodes ? `Tập ${m.episodes}` : "FHD"}
            </div>
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black p-2 text-sm">
              <div className="font-semibold truncate">{m.name}</div>
              <div className="text-xs text-gray-300">
                ⭐ {m.rating ?? "N/A"} – 👁 {m.views?.toLocaleString() ?? 0}
              </div>
            </div> */}
          </div>
        </Link>
      ))}
    </div>
  );
}
