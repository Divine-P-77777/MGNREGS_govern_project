"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { GiIndiaGate } from "react-icons/gi";
import { FaLanguage } from "react-icons/fa";
import { MdGraphicEq } from "react-icons/md";
import { speakText } from "@/lib/textToSpeech";
import data from "@/lib/data/mgnregaSample.json";

// 🧩 Type definitions
interface DistrictData {
  name: string;
  employmentRate: number;
  fundsUtilized: number;
  households: number;
}

export default function Home(): JSX.Element {
  const { language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Nalbari");
  const [summary, setSummary] = useState<DistrictData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 🌅 Translated taglines
  const taglines: Record<string, string> = {
    en: "Empowering Bharat through Data and Voice",
    hi: "डेटा और आवाज़ से भारत को सशक्त बनाना",
    as: "তথ্য আৰু কণ্ঠৰ জৰিয়তে ভাৰতক শক্তিশালী কৰা",
  };

  // 🏞️ Load district summary
  useEffect(() => {
    const districtData = (data as DistrictData[]).find(
      (d) => d.name === selectedDistrict
    );
    setSummary(districtData || null);
  }, [selectedDistrict]);

  // 🧭 Intro.js guided tour (only once)
  useEffect(() => {
    const tourDone = localStorage.getItem("intro_done");
    if (!tourDone) {
      setTimeout(() => {
        introJs()
          .setOptions({
            steps: [
              {
                element: "#districtSelector",
                intro:
                  language === "hi"
                    ? "अपना जिला चुनें ताकि आप प्रदर्शन देख सकें"
                    : language === "as"
                    ? "আপোনাৰ জিলাখন বাছনি কৰক"
                    : "Select your district to view MGNREGA performance",
              },
              {
                element: "#summarySection",
                intro:
                  language === "hi"
                    ? "अपने जिले के प्रदर्शन को समझें"
                    : language === "as"
                    ? "আপোনাৰ জিলাৰ কাৰ্যদক্ষতা বুজক"
                    : "Understand your district’s performance with easy summaries",
              },
              {
                element: "#voiceButton",
                intro:
                  language === "hi"
                    ? "यहाँ टैप करें और अपनी भाषा में सुनें!"
                    : language === "as"
                    ? "এই বুটামত টিপি আপোনাৰ ভাষাত শুনক!"
                    : "Tap here to listen in your preferred language!",
              },
            ],
            showProgress: true,
            exitOnOverlayClick: false,
          })
          .start();
        localStorage.setItem("intro_done", "true");
      }, 800);
    }
  }, [language]);

  // 🎧 Handle Voice Summary
  const handleVoice = () => {
    if (!summary) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textMap: Record<string, string> = {
      en: `In ${summary.name} District, ${summary.employmentRate}% of households were employed under MGNREGA last year, with ₹${summary.fundsUtilized} crore funds utilized.`,
      hi: `${summary.name} जिले में, पिछले वर्ष ${summary.employmentRate}% परिवारों को मनरेगा के तहत रोजगार मिला और ₹${summary.fundsUtilized} करोड़ का उपयोग हुआ।`,
      as: `${summary.name} জিলাত, যোৱা বছৰত ${summary.employmentRate}% পৰিয়াল মনৰেগাৰ অধীনত নিযুক্ত হৈছিল আৰু ₹${summary.fundsUtilized} কোটি ব্যয় হৈছিল।`,
    };

    speakText({
      text: textMap[language],
      lang: language,
      setIsSpeaking,
      speechRef,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-black overflow-hidden">
      {/* 🌅 Hero Section */}
      <section className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GiIndiaGate className="mx-auto text-5xl text-[#FF9933]" />
          <h1 className="text-4xl md:text-5xl font-heading font-semibold mt-4">
            Mitra — Our Voice, Our Right
          </h1>
          <p className="mt-2 text-lg text-gray-700">{taglines[language]}</p>
        </motion.div>
      </section>

      {/* 🏞️ District Selector */}
      <section
        id="districtSelector"
        className="flex justify-center items-center flex-col gap-4 py-6"
      >
        <label className="text-lg font-medium flex items-center gap-2">
          <FaLanguage className="text-[#FF9933]" />
          {language === "hi"
            ? "अपना जिला चुनें"
            : language === "as"
            ? "আপোনাৰ জিলাখন বাছনি কৰক"
            : "Select Your District"}
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-60 text-black focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
        >
          {(data as DistrictData[]).map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </section>

      {/* 📊 Summary Section */}
      <section
        id="summarySection"
        className="max-w-3xl mx-auto text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg"
      >
        {summary ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold mb-4"
            >
              {summary.name} District — MGNREGA Summary
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-[#FF9933]/10">
                <h3 className="font-bold">Employment Rate</h3>
                <p className="text-xl font-semibold">{summary.employmentRate}%</p>
              </div>
              <div className="p-4 rounded-lg bg-[#FFD60A]/10">
                <h3 className="font-bold">Funds Utilized</h3>
                <p className="text-xl font-semibold">₹{summary.fundsUtilized} Cr</p>
              </div>
              <div className="p-4 rounded-lg bg-[#138808]/10">
                <h3 className="font-bold">Households Engaged</h3>
                <p className="text-xl font-semibold">{summary.households}+</p>
              </div>
            </div>
            <button
              id="voiceButton"
              onClick={handleVoice}
              className="mt-6 bg-gradient-to-r from-[#FF9933] via-[#FFD60A] to-[#138808] text-black font-medium px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              {isSpeaking ? "⏸️ Pause Voice" : "🎧 Listen Summary"}
            </button>

            <button className="ml-4 px-4 py-2 border border-[#FFD60A] rounded-full text-black hover:bg-[#FFD60A]/20 transition">
              Compare (Coming Soon)
            </button>
          </>
        ) : (
          <p className="text-gray-600">Select a district to view summary</p>
        )}
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 py-6">
        <MdGraphicEq className="inline text-lg text-[#138808]" /> Mitra — Voice
        of Bharat for MGNREGA
      </div>
    </div>
  );
}
