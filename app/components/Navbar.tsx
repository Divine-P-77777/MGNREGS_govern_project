"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LanguageOption = "en" | "hi" | "as";

interface TranslationKeys {
  home: string;
  about: string;
  contact: string;
  install: string;
  [key: string]: string;
}

export default function Navbar(): JSX.Element {
  const { language, changeLanguage, t } = useLanguage() as {
    language: LanguageOption;
    changeLanguage: (lang: LanguageOption) => void;
    t: TranslationKeys;
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value as LanguageOption);
  };

  const navItems: (keyof TranslationKeys)[] = [
    "home",
    "about",
    "contact",
    "install",
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-[#FF9933]/80 via-[#FFD60A]/80 to-[#138808]/80 shadow-lg border-b-2 border-[#FF9933]/60"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-2xl font-heading text-black font-semi bold tracking-wide drop-shadow-md">
          Our Voice <span className="text-[#131312]">Our Rights</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-black font-medium">
          {navItems.map((key) => (
            <motion.div key={key} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/${key === "home" ? "" : key}`}
                className="relative group transition duration-300"
              >
                <span>{t[key]}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Language + Voice + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-white/20 backdrop-blur-md text-black px-3 py-1 rounded-md text-sm focus:outline-none border border-white/30"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="as">🪷 অসমীয়া</option>
          </select>

          {/* Voice Icon */}
          <button
            type="button"
            aria-label="Voice input"
            className="text-white hover:scale-110 transition-transform duration-300"
          >
            🎙️
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden text-white hover:scale-110 transition-transform duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/10 backdrop-blur-md text-white flex flex-col gap-3 px-6 py-4"
        >
          {navItems.map((key) => (
            <Link
              key={key}
              href={`/${key === "home" ? "" : key}`}
              className="py-2 border-b border-white/20 hover:scale-105 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {t[key]}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
