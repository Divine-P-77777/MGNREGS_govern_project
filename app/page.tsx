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
    const text = "Welcome to Mitra — empowering Bharat through data and voice.";
    speakText(text, "en", () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FF9933]/30 via-white to-[#138808]/30 text-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-4"
      >
        Mitra
      </motion.h1>
      <p className="max-w-xl text-lg text-gray-700 mb-8">
        Empowering Bharat through data, voice, and transparency.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleVoiceIntro}
          className="px-5 py-2 bg-[#FFD60A] rounded-full text-black"
        >
          {isSpeaking ? "⏸ Pause Voice" : "🎧 Listen Intro"}
        </button>
        <button
          onClick={() => router.push("/insights")}
          className="px-5 py-2 bg-[#138808] text-white rounded-full"
        >
          📊 Start Insights
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(async (pos) => {
                const res = await fetch(
                  `/api/reverse-geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
                );
                const body = await res.json();
                alert(`You’re in ${body.district || "an unknown location"}`);
              });
            }
          }}
          className="underline text-sm text-gray-600"
        >
          🧭 Use My Location
        </button>
      </div>
    </main>
  );
}
