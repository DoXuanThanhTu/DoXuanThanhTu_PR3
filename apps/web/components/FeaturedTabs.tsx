"use client";
import { useState } from "react";
import MovieGrid from "./MovieGrid";

const tabs = [
  { key: "featured", label: "Đề cử" },
  // { key: "today", label: "Xem nhiều hôm nay" },
  { key: "favorite", label: "Yêu thích" },
  // { key: "month", label: "Tháng" },
];

export default function FeaturedTabs() {
  const [active, setActive] = useState("featured");

  return (
    <div className="bg-gray-900 text-white rounded-xl p-4">
      <div className="flex gap-4 border-b border-gray-700 pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`text-sm font-semibold ${
              active === tab.key
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lưới phim (theo tab) */}
      <MovieGrid category={active} />
    </div>
  );
}
