import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import sampleData from "@/lib/data/mgnregaSample.json";

type DistrictShape = {
  name: string;
  state?: string;
  year?: number;
  employmentRate: number;
  fundsAllocated: number;
  fundsUtilized: number;
  households: number;
  workers: number;
  persondaysGenerated: number;
  avgDaysPerHH: number;
  womenParticipation: number;
  scParticipation: number;
  stParticipation: number;
  lastUpdated?: string;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function fetchFromExternalAPI(name: string): Promise<Partial<DistrictShape> | null> {
  try {
    const API_KEY = process.env.DATA_GOV_API_KEY!;
    const RESOURCE_ID = "ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?format=json&limit=1&api-key=${API_KEY}&filters[district_name]=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`External API request failed: ${res.status}`);
    const data = await res.json();
    const record = data.records?.[0];
    if (!record) return null;

    // Map best-effort: try multiple field names
    const mapNum = (keys: string[]) => {
      for (const k of keys) {
        if (record[k] !== undefined && record[k] !== null && record[k] !== "") {
          const v = Number(String(record[k]).replace(/[^0-9.\-]/g, ""));
          if (!Number.isNaN(v)) return v;
        }
      }
      return 0;
    };

    return {
      name: record["district_name"] || name,
      state: record["state_name"] || record["state"] || undefined,
      year: Number(record["year"] || 2024),
      employmentRate: mapNum(["employment_rate (%)", "employment_rate", "employment_rate_percent"]),
      fundsAllocated: mapNum(["funds_allocated (Rs. Cr)", "funds_allocated", "funds_allocated_cr"]),
      fundsUtilized: mapNum(["total_funds_utilized (Rs. Cr)", "total_funds_utilized_cr", "funds_utilized"]),
      households: mapNum(["households_worked", "no_of_households", "households"]),
      workers: mapNum(["workers", "no_of_workers"]),
      persondaysGenerated: mapNum(["persondays_generated", "person_days_generated", "persondays"]),
      avgDaysPerHH: mapNum(["avg_days_per_hh", "avg_days"]),
      womenParticipation: mapNum(["women_participation", "women_participation_percent"]),
      scParticipation: mapNum(["sc_participation", "sc_participation_percent"]),
      stParticipation: mapNum(["st_participation", "st_participation_percent"]),
    };
  } catch (err) {
    console.error("External API fetch error:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "Nalbari";
    const { db } = await connectToDatabase();
    const col = db.collection("districts");

    const cached = await col.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (cached && cached.lastUpdated) {
      const last = new Date(cached.lastUpdated).getTime();
      if (Date.now() - last < CACHE_TTL_MS) {
        return NextResponse.json(cached);
      }
    }

    const external = await fetchFromExternalAPI(name);

    let finalData: DistrictShape;
    if (external) {
      finalData = {
        name: external.name ?? name,
        state: external.state,
        year: external.year ?? 2024,
        employmentRate: external.employmentRate ?? 0,
        fundsAllocated: external.fundsAllocated ?? 0,
        fundsUtilized: external.fundsUtilized ?? 0,
        households: external.households ?? 0,
        workers: external.workers ?? 0,
        persondaysGenerated: external.persondaysGenerated ?? 0,
        avgDaysPerHH: external.avgDaysPerHH ?? 0,
        womenParticipation: external.womenParticipation ?? 0,
        scParticipation: external.scParticipation ?? 0,
        stParticipation: external.stParticipation ?? 0,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      const fallback = (sampleData as any[]).find((d) => d.name.toLowerCase() === name.toLowerCase());
      finalData = fallback
        ? { ...fallback, lastUpdated: new Date().toISOString() }
        : {
            name,
            employmentRate: 0,
            fundsAllocated: 0,
            fundsUtilized: 0,
            households: 0,
            workers: 0,
            persondaysGenerated: 0,
            avgDaysPerHH: 0,
            womenParticipation: 0,
            scParticipation: 0,
            stParticipation: 0,
            lastUpdated: new Date().toISOString(),
          };
    }

    await col.updateOne({ name: finalData.name }, { $set: finalData }, { upsert: true });
    return NextResponse.json(finalData);
  } catch (err) {
    console.error("district API error:", err);
    const fallback = (sampleData as any[])[0];
    return NextResponse.json({
      ...fallback,
      lastUpdated: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
