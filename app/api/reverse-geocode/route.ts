import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight reverse geocode route (demo mode).
 * In production, integrate OpenCage or LocationIQ for real mapping.
 */
const map = [
  { name: "Patna", latMin: 25.0, latMax: 26.5, lonMin: 85.0, lonMax: 86.5 },
  { name: "Nalbari", latMin: 26.0, latMax: 26.7, lonMin: 90.0, lonMax: 91.0 },
  { name: "Jaipur", latMin: 26.5, latMax: 27.5, lonMin: 75.5, lonMax: 76.5 },
  { name: "Pune", latMin: 17.0, latMax: 19.5, lonMin: 72.5, lonMax: 74.5 },
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") || "0");
    const lon = parseFloat(url.searchParams.get("lon") || "0");

    const found = map.find(
      (m) => lat >= m.latMin && lat <= m.latMax && lon >= m.lonMin && lon <= m.lonMax
    );

    return NextResponse.json({ district: found ? found.name : null });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return NextResponse.json({ district: null });
  }
}
