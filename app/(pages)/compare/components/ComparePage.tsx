"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

import { useLanguage } from "@/context/LanguageContext";
import { voiceTemplatesCompare } from "@/lib/constants/language";


export interface DistrictStats {
  name: string;
  state: string;
  approvedLabourBudget: number;
  totalExpenditure: number;
  totalHouseholdsWorked: number;
  totalIndividualsWorked: number;
  averageWageRate: number;
  womenPersondays: number;
  scPersondays: number;
  stPersondays: number;
}




import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { speakText } from "@/lib/textToSpeech";
import { Loader2, Volume2, Camera } from "lucide-react";

type DistrictData = {
  name: string;
  state: string;
  year: string;
  month: string;
  approvedLabourBudget: number;
  averageWageRate: number;
  totalExpenditure: number;
  totalHouseholdsWorked: number;
  totalIndividualsWorked: number;
  womenPersondays: number;
  scPersondays?: number;
  stPersondays?: number;
  completedWorks?: number;
  ongoingWorks?: number;
  lastUpdated?: string;
};

export default function ComparePage() {
  const searchParams = useSearchParams();
  const urlDistrict = searchParams.get("name") || "Nalbari";
const { language } = useLanguage();

  const [districtAName, setDistrictAName] = useState(urlDistrict);
  const [districtBName, setDistrictBName] = useState("Delhi");
  const [aData, setAData] = useState<DistrictData | null>(null);
  const [bData, setBData] = useState<DistrictData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** 🧭 Fetch both districts */
  useEffect(() => {
    const fetchData = async () => {
      if (!districtAName || !districtBName) return;
      setLoading(true);
      try {
        const [aRes, bRes] = await Promise.all([
          fetch(`/api/district?name=${encodeURIComponent(districtAName)}`),
          fetch(`/api/district?name=${encodeURIComponent(districtBName)}`),
        ]);
        const [aJson, bJson] = await Promise.all([aRes.json(), bRes.json()]);
        setAData(aJson);
        setBData(bJson);
      } catch (e) {
        console.error("❌ Compare fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [districtAName, districtBName]);

  /** 🧩 Prepare chart data */
  const chartData = useMemo(() => {
    if (!aData || !bData) return [];
    const safe = (v: number | undefined) => Number(v || 0);
    return [
      {
        metric: "Approved Budget (₹ Cr)",
        [aData.name]: safe(aData.approvedLabourBudget) / 1e7,
        [bData.name]: safe(bData.approvedLabourBudget) / 1e7,
      },
      {
        metric: "Total Expenditure (₹ Cr)",
        [aData.name]: safe(aData.totalExpenditure) / 1e7,
        [bData.name]: safe(bData.totalExpenditure) / 1e7,
      },
      {
        metric: "Women Persondays (Lakh)",
        [aData.name]: safe(aData.womenPersondays) / 1e5,
        [bData.name]: safe(bData.womenPersondays) / 1e5,
      },
      {
        metric: "SC Persondays (Lakh)",
        [aData.name]: safe(aData.scPersondays) / 1e5,
        [bData.name]: safe(bData.scPersondays) / 1e5,
      },
      {
        metric: "ST Persondays (Lakh)",
        [aData.name]: safe(aData.stPersondays) / 1e5,
        [bData.name]: safe(bData.stPersondays) / 1e5,
      },
      {
        metric: "Total Households Worked",
        [aData.name]: safe(aData.totalHouseholdsWorked),
        [bData.name]: safe(bData.totalHouseholdsWorked),
      },
      {
        metric: "Average Wage Rate (₹)",
        [aData.name]: safe(aData.averageWageRate),
        [bData.name]: safe(bData.averageWageRate),
      },
    ];
  }, [aData, bData]);


/** Build detailed summary — localized */
const summaryText = useMemo(() => {
  if (!aData || !bData) return "";
  const textA = voiceTemplatesCompare[language](aData);
  const textB = voiceTemplatesCompare[language](bData);

  if (language === "en") {
    return `Comparison between ${aData.name} and ${bData.name}.\n\n${textA}\n\nIn contrast, ${textB}`;
  } else if (language === "hi") {
    return `${aData.name} और ${bData.name} जिलों की तुलना।\n\n${textA}\n\nइसके विपरीत, ${textB}`;
  } else {
    // Assamese
    return `${aData.name} আৰু ${bData.name} জিলাৰ তুলনা।\n\n${textA}\n\n${textB}`;
  }
}, [aData, bData, language]);



  /** 🗣️ Voice Summary */
const handleSpeak = () => {
  if (!aData || !bData) return;

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  // ✅ Build bilingual summary using current language
  const textA = voiceTemplatesCompare[language](aData);
  const textB = voiceTemplatesCompare[language](bData);

  const fullText =
    language === "en"
      ? `Comparison between ${aData.name} and ${bData.name}. ${textA} In contrast, ${textB}`
      : `${aData.name} আৰু ${bData.name} জিলাৰ তুলনা। ${textA} আৰু ${textB}`;

  speakText(fullText, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
};
  /** 📸 Snapshot download */
  const handleDownload = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `Compare_${aData?.name}_vs_${bData?.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] via-white to-[#fff3e0] py-24 px-5">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Compare Districts
          </h1>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isSpeaking
                  ? "bg-red-100 text-red-700"
                  : "bg-[#b5e48c] hover:bg-[#99d98c]"
              }`}
            >
              <Volume2 size={18} />
              {isSpeaking ? "Stop" : "Voice Summary"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffb703] hover:bg-[#ffa94d] text-white font-medium transition"
            >
              <Camera size={18} /> Download Snapshot
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <input
            type="text"
            value={districtAName}
            onChange={(e) => setDistrictAName(e.target.value)}
            placeholder="Enter first district..."
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 outline-none"
          />
          <input
            type="text"
            value={districtBName}
            onChange={(e) => setDistrictBName(e.target.value)}
            placeholder="Enter second district..."
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-300 outline-none"
          />
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading district data...
          </div>
        ) : aData && bData ? (
          <>
            {/* Summary */}
            <div className="bg-gradient-to-r from-[#d9f99d]/60 to-[#ffd6a5]/60 p-5 rounded-xl shadow-inner mb-6 text-gray-800">
              <h2 className="text-lg font-semibold mb-2">
                {aData.name} ({aData.state}) vs {bData.name} ({bData.state})
              </h2>
              <p className="leading-relaxed whitespace-pre-line">{summaryText}</p>
            </div>

            {/* Chart */}
            <div className="bg-white border rounded-xl shadow-sm p-5">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={aData.name} fill="#ff9933" radius={[6, 6, 0, 0]} />
                  <Bar dataKey={bData.name} fill="#138808" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-10">No data available.</p>
        )}
      </motion.div>
    </div>
  );
}
