import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import sampleData from "@/lib/data/mgnregaSample.json";

type DistrictShape = {
  name: string;
  employmentRate: number;
  fundsUtilized: number;
  households: number;
  lastUpdated?: string;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch district data from data.gov.in API
 */
async function fetchFromExternalAPI(name: string): Promise<DistrictShape | null> {
  try {
    const API_KEY = process.env.DATA_GOV_API_KEY!;
    const RESOURCE_ID = "ee03643a-ee4c-48c2-ac30-9f2ff26ab722"; // Verified dataset for MGNREGA district performance

    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?format=json&limit=1&api-key=${API_KEY}&filters[district_name]=${encodeURIComponent(
      name
    )}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`External API request failed with status ${res.status}`);

    const data = await res.json();
    const record = data.records?.[0];
    if (!record) return null;

    // ✅ Adjust these field names based on actual data.gov.in schema
    return {
      name: record["district_name"] || name,
      employmentRate: Number(record["employment_rate (%)"] || record["employment_rate"] || 0),
      fundsUtilized:
        Number(record["total_funds_utilized (Rs. Cr)"] || record["total_funds_utilized_cr"] || 0),
      households: Number(record["households_worked"] || record["no_of_households"] || 0),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Failed to fetch external API:", error);
    return null;
  }
}

/**
 * Main API route: /api/district?name=Nalbari
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "Nalbari";

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection("districts");

    // 🔍 Try cached version
    const cached = await collection.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (cached && cached.lastUpdated) {
      const last = new Date(cached.lastUpdated).getTime();
      if (Date.now() - last < CACHE_TTL_MS) {
        console.log(`✅ Using cached data for ${name}`);
        return NextResponse.json(cached);
      }
    }

    // 🌐 Fetch new data
    const external = await fetchFromExternalAPI(name);

    let finalData: DistrictShape;
    if (external) {
      finalData = { ...external, lastUpdated: new Date().toISOString() };
    } else {
      // 🧩 Fallback to local sample
      const fallback = (sampleData as DistrictShape[]).find(
        (d) => d.name.toLowerCase() === name.toLowerCase()
      );
      finalData = fallback
        ? { ...fallback, lastUpdated: new Date().toISOString() }
        : {
            name,
            employmentRate: 0,
            fundsUtilized: 0,
            households: 0,
            lastUpdated: new Date().toISOString(),
          };
    }

    // 💾 Cache (upsert)
    await collection.updateOne({ name: finalData.name }, { $set: finalData }, { upsert: true });

    console.log(`📦 Cached new data for ${name}`);
    return NextResponse.json(finalData);
  } catch (err) {
    console.error("district API error", err);
    const fallback = (sampleData as DistrictShape[])[0];
    return NextResponse.json({
      ...fallback,
      lastUpdated: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
