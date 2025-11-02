import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates (lat, lon)" }, { status: 400 });
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const API_KEY = process.env.OPENCAGE_API_KEY;
  if (!API_KEY) {
    console.warn("OPENCAGE_API_KEY is not set — skipping external fetch");
    return NextResponse.json(
      { error: "Server configuration error: missing OPENCAGE_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const q = encodeURIComponent(`${latNum},${lonNum}`);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${API_KEY}&countrycode=in&no_annotations=1&language=en`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("OpenCage API error:", res.status, text);
      return NextResponse.json({ error: "Reverse geocode provider error" }, { status: 502 });
    }

    const data = await res.json();

    const components = data?.results?.[0]?.components ?? null;
    const district =
      components?.state_district ||
      components?.county ||
      components?.city ||
      components?.town ||
      components?.village ||
      components?.state ||
      null;

    if (!district) {
      return NextResponse.json({ error: "District not found" }, { status: 404 });
    }

    return NextResponse.json({
      district,
      state: components?.state ?? null,
      formatted: data?.results?.[0]?.formatted ?? null,
    });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}