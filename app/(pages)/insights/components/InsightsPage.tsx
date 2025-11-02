"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, BarChart2, Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ui, metrics, voiceTemplates, Lang } from "@/lib/constants/language";
import { useSpeech } from "@/hooks/useSpeech";
import { fetchDistrictSuggestions } from "@/lib/fetchDistricts";

import SearchBox from "./SearchBox";
import SummaryHeader from "./SummaryHeader";
import MetricsGrid from "./MetricsGrid";
import BarChartModal from "./BarChartModal";

export default function InsightsPage() {
  const { language } = useLanguage();
  const lang = language as Lang;
  const t = ui[lang];
  const metricLabels = metrics[lang];
  const { speak, stop } = useSpeech();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /** 🔍 Debounced district suggestions */
useEffect(() => {
  if (!query.trim()) {
    setSuggestions([]);
    return;
  }
  setLoadingSuggestions(true);
  if (typeof window !== "undefined") { // <--- SSR-safe
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const list = await fetchDistrictSuggestions(query);
        setSuggestions(list);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  }
  return () => {
    if (typeof window !== "undefined" && debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };
}, [query]);


  /** 📦 Fetch summary */
  const fetchSummary = async (districtName: string) => {
    if (!districtName) return;
    setSummary(null);
    setError(null);
    setLoadingSummary(true);

    // cancel any pending request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/district?name=${encodeURIComponent(districtName)}`, {
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`Failed to load data for ${districtName}`);
      const json = await res.json();
      if (!json || Object.keys(json).length === 0) {
        setError("No data available for this district.");
        setSummary(null);
        return;
      }
      setSummary({
        name: json.name || districtName,
        state: json.state || "—",
        year: json.year || "—",
        month: json.month || "—",
        approvedLabourBudget: Number(json.approvedLabourBudget ?? 0),
        averageWageRate: Number(json.averageWageRate ?? 0),
        averageDaysEmployment: Number(json.averageDaysEmployment ?? 0),
        totalHouseholdsWorked: Number(json.totalHouseholdsWorked ?? 0),
        totalIndividualsWorked: Number(json.totalIndividualsWorked ?? 0),
        totalExpenditure: Number(json.totalExpenditure ?? 0),
        womenPersondays: Number(json.womenPersondays ?? 0),
        scPersondays: Number(json.scPersondays ?? 0),
        stPersondays: Number(json.stPersondays ?? 0),
        completedWorks: Number(json.completedWorks ?? 0),
        ongoingWorks: Number(json.ongoingWorks ?? 0),
        remarks: json.remarks ?? "",
        lastUpdated: json.lastUpdated ?? new Date().toISOString(),
      });
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("❌ Fetch error:", err);
      setError("Failed to load district insights.");
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  /** 📍 Use My Location */
const handleUseLocation = async () => {
  if (typeof navigator !== "undefined" && navigator.geolocation) { // <--- SSR-safe
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data?.district) {
            setQuery(data.district);
            await fetchSummary(data.district);
          } else alert("Unable to detect district.");
        } catch (e) {
          console.error("Reverse geocode failed:", e);
          alert("Failed to fetch district.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        alert("Location access denied.");
        setLocating(false);
      }
    );
  } else {
    alert("Geolocation not supported.");
  }
};
  /** Voice summary */
const handleVoiceSummary = () => {
  if (!summary) return;
  if (typeof window !== "undefined") { // <--- SSR-safe
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
      return;
    }
    const template = voiceTemplates[lang];
    const text = template(summary);
    speak(text, lang, () => setIsSpeaking(true), () => setIsSpeaking(false));
  }
};

  /**  Chart Data Memo */
  const chartData = useMemo(
    () =>
      summary
        ? [
            { name: "Approved Budget", value: summary.approvedLabourBudget },
            { name: "Expenditure", value: summary.totalExpenditure },
            { name: "Households Worked", value: summary.totalHouseholdsWorked },
            { name: "Individuals Worked", value: summary.totalIndividualsWorked },
            { name: "Women Persondays", value: summary.womenPersondays },
          ]
        : [],
    [summary]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF9933]/10 via-white to-[#138808]/10 px-4 pt-24 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* 🌍 Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {lang === "hi"
              ? "अपने जिले के MGNREGA आंकड़ों को खोजें, सुनें और समझें।"
              : lang === "as"
              ? "আপোনাৰ জিলাৰ MGNREGA তথ্য অনুসন্ধান কৰক, শুনক আৰু বুজক।"
              : "Search, listen to, and understand MGNREGA district data easily."}
          </p>
        </header>

        {/* 🔍 Search + Location */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <div className="flex-1 min-w-[250px]">
            <SearchBox
              query={query}
              setQuery={setQuery}
              suggestions={suggestions}
              loading={loadingSuggestions}
              placeholder={t.placeholder}
              onSelect={(val) => {
                setQuery(val);
                fetchSummary(val);
              }}
            />
          </div>

          <button
            onClick={handleUseLocation}
            disabled={locating}
            className="px-5 py-3 flex items-center justify-center gap-2 rounded-xl bg-[#FFD60A] hover:bg-[#FDC500] shadow-md text-black font-medium transition-all"
          >
            {locating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
            {t.useLocation || "Use My Location"}
          </button>
        </div>

        {/* 🔘 View Insights */}
        <div className="text-center mb-8">
          <button
            onClick={() => fetchSummary(query)}
            disabled={query.trim().length <= 3 || loadingSummary}
            className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md flex mx-auto items-center gap-2 ${
              query.trim().length > 3
                ? "bg-[#007BFF] hover:bg-[#005FCC] text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loadingSummary ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            {t.viewInsights || "View Insights"}
          </button>
        </div>

        {/* 🧾 Results */}
        <AnimatePresence mode="wait">
          {loadingSummary && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-10"
            >
              <Loader2 className="animate-spin text-[#007BFF]" size={40} />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-red-500 bg-red-50 py-6 rounded-xl shadow-sm"
            >
              {error}
            </motion.div>
          )}

          {summary && !loadingSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <SummaryHeader
                summary={summary}
                isSpeaking={isSpeaking}
                onVoiceToggle={handleVoiceSummary}
                langLabel={t.listenSummary}
              />

              <MetricsGrid summary={summary} metricLabels={metricLabels} />

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2.5 text-sm rounded-md bg-blue-100 hover:bg-blue-200 transition font-medium flex items-center gap-2"
                >
                  <BarChart2 size={16} /> View Chart
                </button>

               <button
  onClick={() =>
    router.push(`/compare?name=${encodeURIComponent(summary.name)}`)
  }
  className="px-6 py-2.5 text-sm rounded-md bg-green-100 hover:bg-green-200 transition font-medium flex items-center gap-2"
>
  Compare District
</button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <BarChartModal open={showModal} onClose={() => setShowModal(false)} summary={summary} />
    </div>
  );
}
