import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import sampleData from "@/lib/data/mgnregaSample.json";

type DistrictShape = {
  name: string;
  state: string;
  year: string;
  month: string;
  approvedLabourBudget: number;
  averageWageRate: number;
  averageDaysEmployment: number;
  scPersondays: number;
  stPersondays: number;
  totalHouseholdsWorked: number;
  totalIndividualsWorked: number;
  totalExpenditure: number;
  womenPersondays: number;
  completedWorks: number;
  ongoingWorks: number;
  remarks?: string;
  lastUpdated?: string;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; 

async function fetchFromExternalAPI(name: string): Promise<DistrictShape | null> {
  try {
    const API_KEY = process.env.DATA_GOV_API_KEY!;
    const RESOURCE_ID = "ee03643a-ee4c-48c2-ac30-9f2ff26ab722";

    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?format=json&limit=1&api-key=${API_KEY}&filters[district_name]=${encodeURIComponent(
      name.toUpperCase()
    )}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`External API request failed with status ${res.status}`);

    const data = await res.json();
    const record = data.records?.[0];
    if (!record) return null;

    // ✅ Correct field mapping from the XML fields you shared
    return {
      name: record["district_name"] || name,
      state: record["state_name"] || "",
      year: record["fin_year"] || "",
      month: record["month"] || "",
      approvedLabourBudget: Number(record["Approved_Labour_Budget"] ?? 0),
      averageWageRate: Number(record["Average_Wage_rate_per_day_per_person"] ?? 0),
      averageDaysEmployment: Number(record["Average_days_of_employment_provided_per_Household"] ?? 0),
      scPersondays: Number(record["SC_persondays"] ?? 0),
      stPersondays: Number(record["ST_persondays"] ?? 0),
      totalHouseholdsWorked: Number(record["Total_Households_Worked"] ?? 0),
      totalIndividualsWorked: Number(record["Total_Individuals_Worked"] ?? 0),
      totalExpenditure: Number(record["Total_Exp"] ?? 0),
      womenPersondays: Number(record["Women_Persondays"] ?? 0),
      completedWorks: Number(record["Number_of_Completed_Works"] ?? 0),
      ongoingWorks: Number(record["Number_of_Ongoing_Works"] ?? 0),
      remarks: record["Remarks"] ?? "",
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Failed to fetch external API:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim() || "Nalbari";

    const { db } = await connectToDatabase();
    const col = db.collection("districts");

    // 🔍 Cache Check
    const cached = await col.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (cached && cached.lastUpdated) {
      const last = new Date(cached.lastUpdated).getTime();
      if (Date.now() - last < CACHE_TTL_MS) {
        console.log(`✅ Using cached data for ${name}`);
        return NextResponse.json(cached);
      }
    }

    // 🌐 Fetch from API
    const external = await fetchFromExternalAPI(name);
    let finalData: DistrictShape;

    if (external) {
      finalData = external;
    } else {
      console.warn(`⚠️ Falling back to sample data for ${name}`);
      const fallback = (sampleData as DistrictShape[]).find(
        (d) => d.name.toLowerCase() === name.toLowerCase()
      );
      finalData =
        fallback ??
        ({
          name,
          state: "",
          year: "2024-25",
          month: "",
          approvedLabourBudget: 0,
          averageWageRate: 0,
          averageDaysEmployment: 0,
          scPersondays: 0,
          stPersondays: 0,
          totalHouseholdsWorked: 0,
          totalIndividualsWorked: 0,
          totalExpenditure: 0,
          womenPersondays: 0,
          completedWorks: 0,
          ongoingWorks: 0,
          remarks: "No data available",
          lastUpdated: new Date().toISOString(),
        } as DistrictShape);
    }

    // 💾 Cache result
    await col.updateOne({ name: finalData.name }, { $set: finalData }, { upsert: true });
    console.log(`📦 Cached new data for ${name}`);
    return NextResponse.json(finalData);
  } catch (err) {
    console.error("❌ district API error:", err);
    const fallback = (sampleData as DistrictShape[])[0];
    return NextResponse.json({
      ...fallback,
      lastUpdated: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
