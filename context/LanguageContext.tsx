"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 1️⃣ Define supported language types
export type LanguageOption = "en" | "hi" | "as";

// 2️⃣ Define translation key structure
export interface TranslationKeys {
  home: string;
  about: string;
  contact: string;
  install: string;
  [key: string]: string;
}

// 3️⃣ Define context structure
interface LanguageContextType {
  language: LanguageOption;
  changeLanguage: (lang: LanguageOption) => void;
  t: TranslationKeys;
}

// 4️⃣ Create translations object
const translations: Record<LanguageOption, TranslationKeys> = {
  en: {
    home: "Home",
    about: "About",
    contact: "Contact",
    install: "Install App",
  },
  hi: {
    home: "होम",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    install: "ऐप इंस्टॉल करें",
  },
  as: {
    home: "ঘৰ",
    about: "আমাৰ বিষয়ে",
    contact: "যোগাযোগ",
    install: "এপ ইনষ্টল কৰক",
  },
};

// 5️⃣ Create the context with a default value (undefined initially)
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// 6️⃣ Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageOption>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as LanguageOption | null;
    if (savedLang && ["en", "hi", "as"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang: LanguageOption) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// 7️⃣ Hook with error safety
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
