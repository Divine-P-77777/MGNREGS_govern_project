"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import html2canvas from "html2canvas";
import { speakText } from "@/lib/textToSpeech";

type Props = {
  open: boolean;
  onClose: () => void;
  districtA: string;
  districtB: string;
  lang: "en" | "hi" | "as";
};

type DistrictData = {
  name: string;
  state?: string;
  year?: number;
  employmentRate: number;
  fundsAllocated: number;
  fundsUtilized: number;
  households: number;
  workers: number;
  persondaysGenerated: number;
  avgDaysPerHH: number;
  womenParticipation: number;
  scParticipation: number;
  stParticipation: number;
  lastUpdated?: string;
};

const METRICS: { key: keyof DistrictData; label: string; isPercent?: boolean }[] = [
  { key: "employmentRate", label: "Employment Rate (%)", isPercent: true },
  { key: "fundsAllocated", label: "Funds Allocated (Cr)" },
  { key: "fundsUtilized", label: "Funds Utilized (Cr)" },
  { key: "avgDaysPerHH", label: "Avg Days / HH" },
  { key: "womenParticipation", label: "Women Participation (%)", isPercent: true },
  { key: "scParticipation", label: "SC Participation (%)", isPercent: true },
  { key: "stParticipation", label: "ST Participation (%)", isPercent: true },
];

export default function CompareSection({ open, onClose, districtA, districtB, lang }: Props) {
  const [aData, setAData] = useState<DistrictData | null>(null);
  const [bData, setBData] = useState<DistrictData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch both district data when modal opens or districts change
  useEffect(() => {
    if (!open) return;

    let mounted = true;
    (async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          fetch(`/api/district?name=${encodeURIComponent(districtA)}`),
          fetch(`/api/district?name=${encodeURIComponent(districtB)}`),
        ]);
        const aJson = await aRes.json();
        const bJson = await bRes.json();

        if (!mounted) return;
        setAData(aJson);
        setBData(bJson);
      } catch (err) {
        console.error("Compare fetch error", err);
        setAData(null);
        setBData(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, districtA, districtB]);

  // Build chart data for Recharts
  const chartData = useMemo(() => {
    if (!aData || !bData) return [];
    return METRICS.map((m) => ({
      metric: m.label,
      [aData.name]: Number((aData[m.key] ?? 0) as any),
      [bData.name]: Number((bData[m.key] ?? 0) as any),
    }));
  }, [aData, bData]);

  // Helper: determine winner per metric
  const winners = useMemo(() => {
    if (!aData || !bData) return {};
    const map: Record<string, string> = {};
    METRICS.forEach((m) => {
      const aVal = Number((aData[m.key] ?? 0) as any);
      const bVal = Number((bData[m.key] ?? 0) as any);
      if (aVal === bVal) map[m.key] = "tie";
      else map[m.key] = aVal > bVal ? "A" : "B";
    });
    return map;
  }, [aData, bData]);

  // Build natural-language comparison for speech
  const buildComparisonSpeech = (): { en: string; hi: string; as: string } => {
    if (!aData || !bData) return { en: "", hi: "", as: "" };

    const a = aData;
    const b = bData;

    const linesEn: string[] = [];
    const linesHi: string[] = [];
    const linesAs: string[] = [];

    // Top summary
    linesEn.push(
      `Comparing ${a.name} (${a.state}) and ${b.name} (${b.state}) for ${a.year ?? b.year ?? "latest"}:`
    );
    linesHi.push(`${a.name} (${a.state}) और ${b.name} (${b.state}) की तुलना:`);
    linesAs.push(`${a.name} (${a.state}) আৰু ${b.name} (${b.state}) তুলনা:`);

    // For each metric, create a short sentence when difference is meaningful
    METRICS.forEach((m) => {
      const aVal = Number((a[m.key] ?? 0) as any);
      const bVal = Number((b[m.key] ?? 0) as any);
      const diff = aVal - bVal;
      const absDiff = Math.abs(diff);

      if (absDiff === 0) {
        // tie
        linesEn.push(`${m.label}: both are equal at ${aVal}${m.isPercent ? "%" : ""}.`);
        linesHi.push(`${m.label}: दोनों समान हैं, ${aVal}${m.isPercent ? "%" : ""}.`);
        linesAs.push(`${m.label}: দুয়ো সমান, ${aVal}${m.isPercent ? "%" : ""}.`);
        return;
      }

      // Determine phrasing
      const winner = diff > 0 ? a : b;
      const loser = diff > 0 ? b : a;
      const winnerLabel = diff > 0 ? "A" : "B";
      const winnerName = winner.name;
      // Use percent formatting for percentages
      const aFmt = m.isPercent ? `${aVal}%` : `${aVal}${m.key.includes("Funds") ? " Cr" : ""}`;
      const bFmt = m.isPercent ? `${bVal}%` : `${bVal}${m.key.includes("Funds") ? " Cr" : ""}`;

      // English
      linesEn.push(
        `${m.label}: ${winnerName} leads (${diff > 0 ? aFmt : bFmt} vs ${diff > 0 ? bFmt : aFmt}), a difference of ${absDiff}${m.isPercent ? "%" : m.key.includes("Funds") ? " Cr" : ""}.`
      );

      // Hindi
      linesHi.push(
        `${m.label}: ${winnerName} आगे है (${diff > 0 ? aFmt : bFmt} बनाम ${diff > 0 ? bFmt : aFmt}), अंतर ${absDiff}${m.isPercent ? "%" : m.key.includes("Funds") ? " करोड़" : ""}.`
      );

      // Assamese
      linesAs.push(
        `${m.label}: ${winnerName} আগবাঢ়ি আছে (${diff > 0 ? aFmt : bFmt} বনাম ${diff > 0 ? bFmt : aFmt}), পাৰ্থক্য ${absDiff}${m.isPercent ? "%" : m.key.includes("Funds") ? " কোটি" : ""}.`
      );
    });

    return {
      en: linesEn.join(" "),
      hi: linesHi.join(" "),
      as: linesAs.join(" "),
    };
  };

  // Speak the comparison summary in selected language
  const handleSpeakComparison = () => {
    if (!aData || !bData) return;
    if (isSpeaking) {
      // stop
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const speech = buildComparisonSpeech();
    const text = lang === "hi" ? speech.hi : lang === "as" ? speech.as : speech.en;
    speakText(text, lang, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  // Download snapshot using html2canvas
  const handleDownloadSnapshot = async () => {
    if (!containerRef.current || !aData || !bData) return;
    try {
      // temporarily scale the container to ensure crispness? keep default
      const canvas = await html2canvas(containerRef.current, { scale: 2 });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const fileName = `Mitra_Comparison_${aData.name.replace(/\s+/g, "_")}_vs_${bData.name.replace(/\s+/g, "_")}.png`;
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Snapshot failed", err);
      alert("Could not create snapshot. Please try again.");
    }
  };

  // modal body
  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden text-black"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">Compare Districts</div>
            <div className="text-sm text-gray-600">
              {aData ? `${aData.name}` : districtA} vs {bData ? `${bData.name}` : districtB}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeakComparison}
              className="px-3 py-1 rounded-md bg-[#FFD60A]/90 hover:scale-105 transition text-black"
              aria-pressed={isSpeaking}
            >
              {isSpeaking ? "⏸️ Stop Voice" : "🎧 Voice Summary"}
            </button>

            <button
              onClick={handleDownloadSnapshot}
              className="px-3 py-1 rounded-md bg-[#FF9933] text-white hover:opacity-95 transition"
            >
              📸 Download Snapshot
            </button>

            <button onClick={onClose} aria-label="Close compare modal" className="px-3 py-1 rounded-md border">
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={containerRef} className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Left Card */}
            <div className="p-4 rounded-xl bg-white/95 border shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">{aData?.name ?? districtA}</div>
                  <div className="text-sm text-gray-600">{aData?.state}</div>
                  <div className="text-xs text-gray-500">Last Updated: {aData?.lastUpdated ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#FF9933]">
                    {aData ? `${aData.employmentRate}%` : "—"}
                  </div>
                  <div className="text-xs text-gray-500">Employment Rate</div>
                </div>
              </div>

              {/* key metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="p-2 rounded bg-[#FFD60A]/10">
                  <div className="text-xs">Funds Utilized</div>
                  <div className="font-semibold">₹{aData?.fundsUtilized ?? "—"} Cr</div>
                </div>
                <div className="p-2 rounded bg-[#FF9933]/10">
                  <div className="text-xs">Funds Allocated</div>
                  <div className="font-semibold">₹{aData?.fundsAllocated ?? "—"} Cr</div>
                </div>

                <div className="p-2 rounded bg-[#00B4D8]/10">
                  <div className="text-xs">Workers</div>
                  <div className="font-semibold">{aData?.workers?.toLocaleString() ?? "—"}</div>
                </div>
                <div className="p-2 rounded bg-[#2ECC71]/10">
                  <div className="text-xs">Households</div>
                  <div className="font-semibold">{aData?.households?.toLocaleString() ?? "—"}</div>
                </div>

                <div className="p-2 rounded bg-[#E74C3C]/10">
                  <div className="text-xs">Persondays</div>
                  <div className="font-semibold">{aData?.persondaysGenerated?.toLocaleString() ?? "—"}</div>
                </div>
                <div className="p-2 rounded bg-[#F39C12]/10">
                  <div className="text-xs">Avg Days/HH</div>
                  <div className="font-semibold">{aData?.avgDaysPerHH ?? "—"}</div>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="p-4 rounded-xl bg-white/95 border shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">{bData?.name ?? districtB}</div>
                  <div className="text-sm text-gray-600">{bData?.state}</div>
                  <div className="text-xs text-gray-500">Last Updated: {bData?.lastUpdated ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#138808]">
                    {bData ? `${bData.employmentRate}%` : "—"}
                  </div>
                  <div className="text-xs text-gray-500">Employment Rate</div>
                </div>
              </div>

              {/* key metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="p-2 rounded bg-[#FFD60A]/10">
                  <div className="text-xs">Funds Utilized</div>
                  <div className="font-semibold">₹{bData?.fundsUtilized ?? "—"} Cr</div>
                </div>
                <div className="p-2 rounded bg-[#FF9933]/10">
                  <div className="text-xs">Funds Allocated</div>
                  <div className="font-semibold">₹{bData?.fundsAllocated ?? "—"} Cr</div>
                </div>

                <div className="p-2 rounded bg-[#00B4D8]/10">
                  <div className="text-xs">Workers</div>
                  <div className="font-semibold">{bData?.workers?.toLocaleString() ?? "—"}</div>
                </div>
                <div className="p-2 rounded bg-[#2ECC71]/10">
                  <div className="text-xs">Households</div>
                  <div className="font-semibold">{bData?.households?.toLocaleString() ?? "—"}</div>
                </div>

                <div className="p-2 rounded bg-[#E74C3C]/10">
                  <div className="text-xs">Persondays</div>
                  <div className="font-semibold">{bData?.persondaysGenerated?.toLocaleString() ?? "—"}</div>
                </div>
                <div className="p-2 rounded bg-[#F39C12]/10">
                  <div className="text-xs">Avg Days/HH</div>
                  <div className="font-semibold">{bData?.avgDaysPerHH ?? "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white/95 p-4 rounded-xl border">
            <div className="mb-2 text-sm text-gray-600">Comparison Chart</div>
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* Bars: saffron for A, green for B */}
                  {aData && <Bar dataKey={aData.name} fill="#FF9933" />}
                  {bData && <Bar dataKey={bData.name} fill="#138808" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metric-by-metric winner summary */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {METRICS.map((m) => {
              const w = winners[m.key];
              const winnerName = w === "A" ? aData?.name : w === "B" ? bData?.name : "Tie";
              return (
                <div key={String(m.key)} className="p-3 rounded-lg bg-white/95 border">
                  <div className="text-xs text-gray-500">{m.label}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{aData ? `${aData[m.key] ?? "—"}${m.isPercent ? "%" : ""}` : "—"}</div>
                      <div className="text-xs text-gray-500">{aData?.name}</div>
                    </div>

                    <div className="text-center">
                      <div className={`text-sm font-semibold ${w === "A" ? "text-[#138808]" : w === "B" ? "text-[#FF9933]" : "text-gray-600"}`}>
                        {w === "tie" ? "Tie" : winnerName}
                      </div>
                      <div className="text-xs text-gray-500">{w === "A" ? "Leads" : w === "B" ? "Leads" : ""}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">{bData ? `${bData[m.key] ?? "—"}${m.isPercent ? "%" : ""}` : "—"}</div>
                      <div className="text-xs text-gray-500">{bData?.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
