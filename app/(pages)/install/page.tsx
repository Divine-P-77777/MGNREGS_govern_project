export const metadata = {
  title:
    "Install Mitra | Empower Citizens to Explore MGNREGA District Performance",
  description:
    "Set up Mitra — your citizen-friendly web app that helps people understand their district's MGNREGA performance through visual insights, voice narration, and multi-language support. Install Mitra to stay informed and connected to Bharat’s growth.",
  keywords: [
    "Mitra installation",
    "how to install Mitra",
    "MGNREGA data app",
    "district performance insights",
    "citizen empowerment app",
    "India rural development tracker",
    "MGNREGA visualization",
    "install Mitra locally",
    "public data accessibility",
    "Bharat data platform",
    "MGNREGA district report",
    "open data India",
    "government scheme insights",
    "data storytelling app",
    "Mitra setup guide",
    "install citizen app",
    "rural development insights",
    "AI data explanation tool",
    "voice summary MGNREGA",
  ],
  openGraph: {
    title:
      "Install Mitra | Citizen-Centric Insights for MGNREGA District Performance",
    description:
      "Install Mitra to explore MGNREGA district performance across Bharat with real-time data, translation, and voice explanations — designed for accessibility and happiness.",
    url: "https://mitra.vercel.app/install",
    siteName: "Mitra",
    images: [
      {
        url: "https://mitra.vercel.app/og/install-banner.png",
        width: 1200,
        height: 630,
        alt: "Mitra Installation Guide Preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Install Mitra | Your Voice for Bharat’s MGNREGA District Insights",
    description:
      "Get started with Mitra — a people-first app built for citizens to easily understand their district’s MGNREGA performance in multiple Indian languages with voice narration.",
    images: ["https://mitra.vercel.app/og/install-banner.png"],
  },
};

import InstallPage from "./InstallPage";

export default function Install() {
  return <InstallPage />;
}
