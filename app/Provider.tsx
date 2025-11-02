'use client';

import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';

const GoogleTranslateClient = dynamic(
  () => import('@/app/components/GoogleTranslateLoader'),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      {children}
      <Footer />
      <GoogleTranslateClient />
    </LanguageProvider>
  );
}
