"use client";
import { JSX, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
// import Link from "next/link";
// import Image from "next/image";
// import { Play, Heart, Plus, Share2, MessageCircle } from "lucide-react";

import { Movie, Server } from "@repo/types";
import MovieInfo from "../../../components/MovieInfo";
import MovieMain from "../../../components/MovieMain";

const API_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL;

interface FranchiseData {
  movie: Movie;
  servers: Server[];
  relatedMovies: Movie[];
}

const MovieDetail = (): JSX.Element => {
  const { slug } = useParams();
  const [allData, setAllData] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/movies/slug/${slug}`);
        setAllData(res.data.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (isLoading)
    return <p className="text-center text-gray-400 mt-10">Đang tải...</p>;
  // if (!allData?.movie)
  //   return (
  //     <p className="text-center text-red-400 mt-10">Không tìm thấy phim</p>
  //   );

  // const { movie, servers, relatedMovies } = allData;

  return (
    <div className="bg-[#0f0f10] min-h-screen text-white">
      {/* Banner */}
      <div>
        {allData?.banner_url && (
          <div
            className="h-[400px] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${allData.banner_url})` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f10] via-[#0f0f10]/60 to-transparent" />
          </div>
        )}
      </div>

      {/* Thông tin phim */}
      <div className="flex flex-row w-full p-5 md:pr-20 xl:pr-40 md:pl-20 xl:pl-40 ">
        <div className="max-w-[400px]  relative flex flex-col md:flex-row gap-8 rounded-2xl bg-linear-to-b from-neutral-800 to-black text-white w-full">
          <MovieInfo movie={allData || undefined} />
        </div>
        {/* Danh sách tập / season / server */}
        <div
          id="play"
          className="max-w-6xl mx-auto px-4 pb-10 w-full grow flex-1"
        >
          {/* <MovieMain data={allData} /> */}
        </div>
      </div>

      {/* <div className="max-w-6xl mx-auto px-4 mt-10 pb-16">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Các phần khác trong series
        </h2>
        {relatedMovies.length === 0 ? (
          <p className="text-gray-400">Không có phần khác.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {relatedMovies.map((m) => (
              <Link
                key={m._id}
                href={`/movie/${m.slug ?? m._id}`}
                className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition"
              >
                <img
                  src={m.thumbnail_url || "/no-poster.png"}
                  alt={m.titles?.[0]?.title || ""}
                  className="w-full h-60 object-cover"
                />
                <div className="p-2 text-sm text-center text-white truncate">
                  {m.titles?.[0]?.title || "Không rõ tên"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default MovieDetail;
