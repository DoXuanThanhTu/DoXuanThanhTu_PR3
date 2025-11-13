"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Episode, Movie, Server } from "@repo/types";
import ModernPlayer from "../../../components/Player";
import EpisodesByServer from "../../../components/EpisodesByServer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const movieSlug = pathname.split("/").pop();
  const epParam = searchParams.get("ep") || "1";
  const epNumber = Number(epParam);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [servers, setServers] = useState<(Server & { episodes?: Episode[] })[]>(
    []
  );
  const [currentServer, setCurrentServer] = useState<
    (Server & { episodes?: Episode[] }) | null
  >(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  const playerRef = useRef<HTMLDivElement>(null);

  /** 🟣 Chỉ fetch 1 lần dữ liệu phim */
  useEffect(() => {
    if (!movieSlug) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/watch/${movieSlug}`);
        const { movie, servers } = res.data.data;
        setMovie(movie);
        setServers(servers);
        const defaultServer = servers?.[0];
        setCurrentServer(defaultServer);
        const defaultEp =
          defaultServer?.episodes?.find(
            (ep: Episode) => ep.episode_number === epNumber
          ) || defaultServer?.episodes?.[0];
        setCurrentEpisode(defaultEp || null);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieSlug]);

  /** 🟢 Khi chọn tập: chỉ đổi episode, đổi URL, scroll lên player */
  const handleSelectEpisode = (ep: Episode, server: Server) => {
    setCurrentServer(server);
    setCurrentEpisode(ep);

    // ✅ Cập nhật URL mà không reload
    router.replace(`${pathname}?ep=${ep.episode_number}`, { scroll: false });

    // ✅ Cuộn lên player
    setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  };

  /** 🟡 Khi user đổi ?ep=... trực tiếp trên URL */
  useEffect(() => {
    if (!servers.length) return;
    const activeServer = currentServer || servers[0];
    const ep =
      activeServer?.episodes?.find((e) => e.episode_number === epNumber) ||
      activeServer?.episodes?.[0];
    setCurrentEpisode(ep || null);
  }, [epNumber, servers]);

  if (loading) return <div className="text-white p-4">Đang tải dữ liệu...</div>;
  if (!movie || !currentEpisode)
    return (
      <div className="text-white p-4">Không tìm thấy phim hoặc tập nào.</div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* 🔹 Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <h2 className="text-lg md:text-xl font-semibold truncate">
            Xem tập {currentEpisode?.episode_number} - {movie.name}
          </h2>
        </div>

        {/* 🔹 Player — chỉ đổi link khi chọn tập */}
        <div
          ref={playerRef}
          className="relative rounded-xl overflow-hidden shadow-lg"
        >
          <ModernPlayer linkEmbed={currentEpisode.link_m3u8 || ""} />
        </div>
        <div className="min-h-[700px] w-full"></div>
        {/* 🔹 Danh sách tập */}
        <EpisodesByServer
          servers={servers}
          currentEpisodeId={currentEpisode?._id}
          onSelectEpisode={handleSelectEpisode}
          playerRef={playerRef}
        />
      </div>
    </div>
  );
}
