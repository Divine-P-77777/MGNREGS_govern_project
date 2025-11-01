'use client';

import React, { useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof document !== 'undefined' && !document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // Initialize Google Translate after the script loads (safe to assign on window)
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,as',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    return () => {
      // cleanup if needed
      // window.googleTranslateElementInit = undefined;
    };
  }, []);

  return (
    <LanguageProvider>
      <Navbar />
      {children}
      <Footer />
      <div id="google_translate_element" className="hidden" />
    </LanguageProvider>
  );
}