import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const key = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}&countrycode=in`;
    const res = await fetch(url);
    const data = await res.json();

    const district =
      data?.results?.[0]?.components?.state_district ||
      data?.results?.[0]?.components?.county ||
      data?.results?.[0]?.components?.city ||
      null;

    if (!district) {
      return NextResponse.json({ error: "District not found" }, { status: 404 });
    }

    return NextResponse.json({ district });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}
