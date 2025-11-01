"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { speakText, stopSpeech } from "@/lib/textToSpeech";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleVoiceIntro = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    const text =
      "Welcome to Mitra — Our Voice, Our Rights. Empowering Bharat through data, voice, and transparency.";
    speakText(text, "en", () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FF9933]/20 via-white to-[#138808]/20 text-center px-6 py-10">
      {/* Hero Section */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4"
      >
        Mitra
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-xl md:text-2xl font-semibold text-gray-700 mb-2"
      >
        🇮🇳 Our Voice, Our Rights
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed mb-10"
      >
        Empowering Bharat through <span className="font-semibold">data</span>,{" "}
        <span className="font-semibold">voice</span>, and{" "}
        <span className="font-semibold">transparency</span> — so every citizen can
        understand, compare, and act.
      </motion.p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={handleVoiceIntro}
          className="px-6 py-3 bg-[#FFD60A] rounded-full text-black font-medium shadow-md hover:scale-105 transition-all"
        >
          {isSpeaking ? "⏸ Pause Voice" : "🎧 Listen Intro"}
        </button>

        <button
          onClick={() => router.push("/insights")}
          className="px-6 py-3 bg-[#138808] text-white rounded-full font-medium shadow-md hover:scale-105 transition-all"
        >
          📊 Explore Insights
        </button>

        <button
          onClick={() => router.push("/faq")}
          className="px-6 py-3 bg-[#7e22ce] text-white rounded-full font-medium shadow-md hover:scale-105 transition-all"
        >
          ❓ FAQs
        </button>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-3xl text-center bg-white/20 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-6"
      >
        <h3 className="text-2xl font-bold mb-3">Why Mitra?</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Mitra brings government data closer to citizens — visualized, summarized,
          and spoken in your language. Compare districts, listen to summaries, and
          understand the impact of welfare programs like MGNREGA in real time.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button
            onClick={() => router.push("/about")}
            className="px-5 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all"
          >
            📘 About Us
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="px-5 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all"
          >
            📬 Contact
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Mitra — Built for Bharat 🇮🇳
      </footer>
    </main>
  );
}
