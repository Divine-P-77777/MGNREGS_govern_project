import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    const API_KEY = process.env.OPENCAGE_API_KEY;
    if (!API_KEY) {
      throw new Error("Missing OpenCage API key");
    }

    // 🌍 Call OpenCage API
    const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY}&language=en&pretty=1`;
    const res = await fetch(geoUrl);

    if (!res.ok) throw new Error(`OpenCage request failed with ${res.status}`);

    const data = await res.json();
    const components = data.results?.[0]?.components;

    const district =
      components?.state_district ||
      components?.district ||
      components?.county ||
      components?.state ||
      null;

    if (!district) {
      console.warn("⚠️ No district found for coordinates:", { lat, lon });
    }

    return NextResponse.json({
      district,
      lat,
      lon,
      source: "OpenCage",
    });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return NextResponse.json({
      district: null,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
