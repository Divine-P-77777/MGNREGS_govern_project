"use client";

import React, { useEffect, useState } from "react";

type Props = {
  onSelect: (district: string) => void;
};

export default function FavoriteSection({ onSelect }: Props) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("favorites");
    if (raw) setFavorites(JSON.parse(raw));
  }, []);

  const remove = (d: string) => {
    const next = favorites.filter((f) => f !== d);
    setFavorites(next);
    localStorage.setItem("favorites", JSON.stringify(next));
  };

  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Favorites</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((d) => (
          <div key={d} className="p-3 bg-white/70 rounded-lg shadow-sm text-black">
            <div className="flex justify-between items-center">
              <button onClick={() => onSelect(d)} className="font-medium">
                {d}
              </button>
              <button onClick={() => remove(d)} className="text-sm text-red-500">
                Remove
              </button>
            </div>
            {/* small placeholder for summary; could fetch /api/district in future */}
            <p className="text-sm text-gray-700 mt-2">Tap to view summary</p>
          </div>
        ))}
      </div>
    </div>
  );
}
