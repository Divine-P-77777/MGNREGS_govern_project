"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import RecentSection from "@/app/components/RecentSection";
import FavoriteSection from "@/app/components/FavoriteSection";
import CompareSection from "@/app/components/CompareSection";
import { speakText, stopSpeech } from "@/lib/textToSpeech";
import sampleData from "@/lib/data/mgnregaSample.json";

export default function HomePage() {
  const { language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Nalbari");
  const [summary, setSummary] = useState<any | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [comparePair, setComparePair] = useState<{ a: string; b: string }>({ a: "Nalbari", b: "Patna" });

  // 🧭 Auto-location → Reverse Geocode
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/reverse-geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const body = await res.json();
          if (body?.district) setSelectedDistrict(body.district);
        } catch {
          // fallback silently
        }
      },
      () => {},
      { maximumAge: 60 * 60 * 1000 }
    );
  }, []);

  // 📊 Load district data
  useEffect(() => {
    if (!selectedDistrict) return;
    (async () => {
      try {
        const res = await fetch(`/api/district?name=${encodeURIComponent(selectedDistrict)}`);
        const json = await res.json();
        setSummary(json);
        // store in recent
        const recent = JSON.parse(localStorage.getItem("recentDistricts") || "[]");
        const updated = [json.name, ...recent.filter((r: string) => r !== json.name)].slice(0, 10);
        localStorage.setItem("recentDistricts", JSON.stringify(updated));
      } catch {
        const fallback = (sampleData as any[]).find((d) => d.name === selectedDistrict) || (sampleData as any[])[0];
        setSummary(fallback);
      }
    })();
  }, [selectedDistrict]);

  // ⭐ Favorites toggle
  const toggleFavorite = (name?: string) => {
    const district = name || (summary?.name ?? selectedDistrict);
    if (!district) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = favorites.includes(district)
      ? favorites.filter((f: string) => f !== district)
      : [district, ...favorites].slice(0, 20);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("storageUpdated"));
  };

  // 🎧 Voice summary
  const handleVoiceSummary = () => {
    if (!summary) return;
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const { name, state, employmentRate, fundsAllocated, fundsUtilized, households, workers, persondaysGenerated, avgDaysPerHH, womenParticipation, scParticipation, stParticipation } = summary;

    const summaryText = {
      en: `In ${name} district of ${state}, during 2024, ${employmentRate}% of households gained employment under MGNREGA. ₹${fundsUtilized} crore out of ₹${fundsAllocated} crore were utilized, generating ${persondaysGenerated.toLocaleString()} person-days for ${workers.toLocaleString()} workers across ${households.toLocaleString()} households. Women participation was ${womenParticipation}%, Scheduled Castes ${scParticipation}%, and Scheduled Tribes ${stParticipation}%. The average number of days of work per household was ${avgDaysPerHH}.`,
      hi: `${state} राज्य के ${name} ज़िले में वर्ष 2024 में मनरेगा के तहत ${employmentRate}% परिवारों को रोजगार मिला। कुल ₹${fundsAllocated} करोड़ आवंटन में से ₹${fundsUtilized} करोड़ का उपयोग हुआ। ${workers.toLocaleString()} मज़दूरों और ${households.toLocaleString()} परिवारों के लिए कुल ${persondaysGenerated.toLocaleString()} व्यक्ति-दिवस का सृजन हुआ। महिला भागीदारी ${womenParticipation}% रही, अनुसूचित जाति ${scParticipation}%, और अनुसूचित जनजाति ${stParticipation}% रही। प्रत्येक परिवार को औसतन ${avgDaysPerHH} दिन का कार्य मिला।`,
      as: `${state} ৰাজ্যৰ ${name} জিলাত, ২০২৪ চনত মোনৰেগাৰ অধীনত ${employmentRate}% পৰিয়ালে চাকৰি লাভ কৰিছিল। মুঠ ₹${fundsAllocated} কোটিৰ ভিতৰত ₹${fundsUtilized} কোটি ব্যৱহাৰ কৰা হৈছিল। ${workers.toLocaleString()} কৰ্মী আৰু ${households.toLocaleString()} পৰিয়ালৰ বাবে ${persondaysGenerated.toLocaleString()} জন-দিন সৃষ্টি হৈছিল। মহিলা অংশগ্ৰহণ আছিল ${womenParticipation}%, অনু.জাতি ${scParticipation}% আৰু অনু.জনজাতি ${stParticipation}%। গড়ে প্ৰতিটো পৰিয়ালে ${avgDaysPerHH} দিন কাম পালে।`,
    };

    speakText(summaryText[language as "en" | "hi" | "as"], language as any, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-black p-6">
      {/* 🌅 Hero Section */}
      <section className="text-center py-10">
        <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-heading font-semibold">
          Mitra — Our Voice, Our Right
        </motion.h1>
        <p className="mt-2 text-gray-800">
          {language === "hi"
            ? "डेटा और आवाज़ से भारत को सशक्त बनाना"
            : language === "as"
            ? "তথ্য আৰু কণ্ঠৰ জৰিয়তে ভাৰতক শক্তিশালী কৰা"
            : "Empowering Bharat through Data and Voice"}
        </p>
      </section>

      {/* 🏞️ Main Grid */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow">
          <label className="block text-sm font-medium mb-2">Select District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-md p-2 border text-black"
          >
            {(sampleData as any[]).map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button onClick={() => toggleFavorite()} className="px-3 py-1 bg-[#FFD60A]/80 rounded">
              ★ Favorite
            </button>
            <button
              onClick={() => {
                setIsCompareOpen(true);
                setComparePair({ a: selectedDistrict, b: comparePair.b || "Patna" });
              }}
              className="px-3 py-1 bg-[#FF9933]/80 rounded"
            >
              Compare
            </button>
          </div>

          <RecentSection onSelect={(d) => setSelectedDistrict(d)} />
          <FavoriteSection onSelect={(d) => setSelectedDistrict(d)} />
        </div>

        {/* Right Panel - Summary */}
        <div className="bg-white/80 p-6 rounded-2xl shadow text-black">
          {summary ? (
            <>
              <h3 className="text-xl font-semibold mb-2">
                {summary.name}, {summary.state} — Summary (2024)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="p-3 rounded bg-[#FF9933]/10">
                  <div className="text-sm">Employment Rate</div>
                  <div className="text-2xl font-bold">{summary.employmentRate}%</div>
                </div>
                <div className="p-3 rounded bg-[#FFD60A]/10">
                  <div className="text-sm">Funds Utilized / Allocated</div>
                  <div className="text-lg font-semibold">
                    ₹{summary.fundsUtilized} / ₹{summary.fundsAllocated} Cr
                  </div>
                </div>
                <div className="p-3 rounded bg-[#138808]/10">
                  <div className="text-sm">Households Engaged</div>
                  <div className="text-2xl font-bold">{summary.households.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded bg-[#00B4D8]/10">
                  <div className="text-sm">Workers</div>
                  <div className="text-2xl font-bold">{summary.workers.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded bg-[#E74C3C]/10">
                  <div className="text-sm">Persondays Generated</div>
                  <div className="text-xl font-bold">{summary.persondaysGenerated.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded bg-[#F39C12]/10">
                  <div className="text-sm">Avg Days / HH</div>
                  <div className="text-2xl font-bold">{summary.avgDaysPerHH}</div>
                </div>
                <div className="p-3 rounded bg-[#2ECC71]/10">
                  <div className="text-sm">Women Participation</div>
                  <div className="text-xl font-semibold">{summary.womenParticipation}%</div>
                </div>
                <div className="p-3 rounded bg-[#FFD60A]/10">
                  <div className="text-sm">SC Participation</div>
                  <div className="text-xl font-semibold">{summary.scParticipation}%</div>
                </div>
                <div className="p-3 rounded bg-[#00B4D8]/10">
                  <div className="text-sm">ST Participation</div>
                  <div className="text-xl font-semibold">{summary.stParticipation}%</div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={handleVoiceSummary}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF9933] via-[#FFD60A] to-[#138808] text-black mr-3"
                >
                  {isSpeaking ? "⏸ Pause Voice" : "🎧 Listen Summary"}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify(summary, null, 2));
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Copy JSON
                </button>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>

      {/* ⚖️ Compare Modal */}
      <CompareSection
        open={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        districtA={comparePair.a}
        districtB={comparePair.b}
        lang={language as "en" | "hi" | "as"}
      />
    </div>
  );
}
