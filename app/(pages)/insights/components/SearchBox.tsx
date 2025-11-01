"use client";
import { Search, Loader2 } from "lucide-react";

interface SearchBoxProps {
  query: string;
  setQuery: (v: string) => void;
  suggestions: string[];
  loading: boolean;
  onSelect: (name: string) => void;
  placeholder: string;
}

export default function SearchBox({
  query,
  setQuery,
  suggestions,
  loading,
  onSelect,
  placeholder,
}: SearchBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Search size={18} /> <div className="font-medium">Search by District</div>
      </div>

      <div className="relative">
        <input
          aria-label="Search district"
          className="w-full p-2 border rounded-md mb-2 text-black"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query) onSelect(query);
          }}
        />
        {loading && (
          <div className="absolute right-3 top-3 text-gray-500">
            <Loader2 className="animate-spin" size={18} />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="border rounded max-h-48 overflow-auto bg-white z-20">
          {suggestions.map((s) => (
            <li
              key={s}
              onClick={() => onSelect(s)}
              className="px-3 py-2 hover:bg-[#FFD60A]/20 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
