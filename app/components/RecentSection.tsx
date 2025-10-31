"use client";

import React, { useEffect, useState } from "react";

type Props = {
  onSelect: (district: string) => void;
};

export default function RecentSection({ onSelect }: Props) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("recentDistricts");
    if (raw) setRecent(JSON.parse(raw));
  }, []);

  const handleClick = (d: string) => {
    onSelect(d);
  };

  if (!recent || recent.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Recent Districts</h4>
      <div className="flex gap-3 flex-wrap">
        {recent.slice(0, 5).map((d) => (
          <button
            key={d}
            onClick={() => handleClick(d)}
            className="px-3 py-1 bg-white/80 rounded-full border text-black hover:scale-105 transition"
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
