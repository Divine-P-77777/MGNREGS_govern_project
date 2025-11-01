"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Loader2 } from "lucide-react";
import { FaUsers, FaRupeeSign } from "react-icons/fa";
import { GiFamilyHouse } from "react-icons/gi";
import { MdOutlineWoman } from "react-icons/md";
import { useLanguage } from "@/context/LanguageContext";
import { ui, metrics, voiceTemplates, Lang } from "@/lib/constants/language";
import { useSpeech } from "@/hooks/useSpeech";
import { fetchDistrictSuggestions } from "@/lib/fetchDistricts";

export default function InsightsPage() {
  const { language } = useLanguage();
  const lang = language as Lang;
  const t = ui[lang];
  const metricLabels = metrics[lang];
  const { speak, stop } = useSpeech();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Debounced suggestions fetch
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const list = await fetchDistrictSuggestions(query);
        setSuggestions(list);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    // cleanup
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  // When user selects district suggestion
  const handleSelectDistrict = (name: string) => {
    setSelected(name);
    setQuery(name);
    setSuggestions([]);
    fetchSummary(name);
  };

  // Fetch summary from /api/district
  const fetchSummary = async (districtName: string) => {
    setLoadingSummary(true);
    try {
      const res = await fetch(`/api/district?name=${encodeURIComponent(districtName)}`);
      const json = await res.json();
      // Expect the extended shape. If API returns missing fields, merge with defaults
      const defaultShape = {
        name: districtName,
        state: json.state || json.stateName || json.state || "—",
        year: json.year || 2024,
        employmentRate: Number(json.employmentRate ?? json.employment_rate ?? 0),
        fundsAllocated: Number(json.fundsAllocated ?? json.funds_allocated ?? 0),
        fundsUtilized: Number(json.fundsUtilized ?? json.funds_utilized ?? json.fundsUtilized ?? 0),
        households: Number(json.households ?? 0),
        workers: Number(json.workers ?? json.workers ?? 0),
        persondaysGenerated: Number(json.persondaysGenerated ?? json.persondays_generated ?? 0),
        avgDaysPerHH: Number(json.avgDaysPerHH ?? json.avg_days_per_hh ?? 0),
        womenParticipation: Number(json.womenParticipation ?? json.women_participation ?? 0),
        scParticipation: Number(json.scParticipation ?? json.sc_participation ?? 0),
        stParticipation: Number(json.stParticipation ?? json.st_participation ?? 0),
        lastUpdated: json.lastUpdated ?? new Date().toISOString(),
      };
      setSummary(defaultShape);
      // add to recent
      const recent = JSON.parse(localStorage.getItem("recentDistricts") || "[]");
      const updated = [defaultShape.name, ...recent.filter((r: string) => r !== defaultShape.name)].slice(0, 10);
      localStorage.setItem("recentDistricts", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to load district:", err);
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Location lookup
  const handleMyLocation = () => {
    if (!("geolocation" in navigator)) return alert("Geolocation not supported");
    setLoadingSuggestions(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/reverse-geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const json = await res.json();
          if (json?.district) {
            handleSelectDistrict(json.district);
          } else {
            alert("Could not resolve district for your location");
          }
        } catch (err) {
          console.error(err);
          alert("Error resolving location");
        } finally {
          setLoadingSuggestions(false);
        }
      },
      (err) => {
        console.warn("geolocation denied", err);
        setLoadingSuggestions(false);
      },
      { maximumAge: 60 * 60 * 1000 }
    );
  };

  // Natural multilingual voice summary
  const handleVoiceSummary = () => {
    if (!summary) return;
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
      return;
    }
    const template = voiceTemplates[lang];
    const text = template(summary);
    speak(text, lang, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  // Render metric card helper
  const MetricCard: React.FC<{ label: string; value: string | number; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="p-3 rounded-lg bg-white/95 shadow-sm flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#f3f4f6] text-xl">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 p-6 bg-gradient-to-br from-[#FF9933]/8 via-white to-[#138808]/8 text-black">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-semibold mb-2">{ui[lang].title}</h1>
        <p className="text-gray-700 mb-6">
          {lang === "hi"
            ? "अपने जिले के MGNREGA आंकड़ों को खोजें, सुनें और समझें।"
            : lang === "as"
            ? "আপোনাৰ জিলাৰ MGNREGA তথ্য অনুসন্ধান কৰক, শুনক আৰু বুজক।"
            : "Search, listen to, and understand MGNREGA district data."}
        </p>

        {/* Search + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Search size={18} /> <div className="font-medium">{ui[lang].byDistrict}</div>
            </div>
            <input
              aria-label="Search district"
              className="w-full p-2 border rounded-md mb-2 text-black"
              placeholder={ui[lang].placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query) {
                  handleSelectDistrict(query);
                }
              }}
            />
            <div className="relative">
              {loadingSuggestions && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              {suggestions.length > 0 && (
                <ul className="border rounded max-h-48 overflow-auto mt-2 bg-white z-20">
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      onClick={() => handleSelectDistrict(s)}
                      className="px-3 py-2 hover:bg-[#FFD60A]/20 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} /> <div className="font-medium">{ui[lang].byLocation}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleMyLocation}
                className="flex-1 px-4 py-2 rounded-md bg-[#FFD60A]/90 hover:bg-[#FFD60A] flex items-center justify-center gap-2"
                disabled={loadingSuggestions}
              >
                <MapPin /> {loadingSuggestions ? ui[lang].fetchingLocation : ui[lang].byLocation}
              </button>

              <button
                onClick={() => {
                  if (selected) fetchSummary(selected);
                  else if (query) handleSelectDistrict(query);
                }}
                className="px-4 py-2 rounded-md border"
              >
                {ui[lang].viewInsights}
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white/80 rounded-2xl p-5 shadow">
          {!summary ? (
            <div className="text-center py-10 text-gray-600">{ui[lang].noDistrict}</div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{summary.name}, {summary.state}</h2>
                  <div className="text-sm text-gray-600">Year: {summary.year}</div>
                  <div className="text-xs text-gray-500">Last updated: {new Date(summary.lastUpdated).toLocaleString()}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleVoiceSummary}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF9933] via-[#FFD60A] to-[#138808] text-black"
                  >
                    {isSpeaking ? "⏸ Pause" : ui[lang].listenSummary}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(JSON.stringify(summary, null, 2));
                      alert("Copied JSON to clipboard");
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <MetricCard label={metricLabels.employmentRate} value={`${summary.employmentRate}%`} icon={<FaUsers />} />
                <MetricCard label={metricLabels.fundsUtilized} value={`₹${summary.fundsUtilized} Cr`} icon={<FaRupeeSign />} />
                <MetricCard label={metricLabels.fundsAllocated} value={`₹${summary.fundsAllocated} Cr`} icon={<FaRupeeSign />} />
                <MetricCard label={metricLabels.households} value={summary.households.toLocaleString()} icon={<GiFamilyHouse />} />
                <MetricCard label={metricLabels.workers} value={summary.workers.toLocaleString()} icon={<FaUsers />} />
                <MetricCard label={metricLabels.persondaysGenerated} value={summary.persondaysGenerated.toLocaleString()} icon={<FaUsers />} />
                <MetricCard label={metricLabels.avgDaysPerHH} value={summary.avgDaysPerHH} icon={<GiFamilyHouse />} />
                <MetricCard label={metricLabels.womenParticipation} value={`${summary.womenParticipation}%`} icon={<MdOutlineWoman />} />
                <MetricCard label={metricLabels.scParticipation} value={`${summary.scParticipation}%`} icon={<FaUsers />} />
                <MetricCard label={metricLabels.stParticipation} value={`${summary.stParticipation}%`} icon={<FaUsers />} />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
