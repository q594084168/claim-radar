import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Static data file path
const DATA_FILE = path.join(process.cwd(), "public", "claims-data.json");

export async function GET() {
  try {
    // Read pre-generated static data
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const claims = JSON.parse(data);

    return NextResponse.json({
      success: true,
      claims: claims,
      total: claims.length,
      source: "ClaimDepot",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    // If file doesn't exist, return empty
    return NextResponse.json({
      success: true,
      claims: [],
      total: 0,
      source: "ClaimDepot",
      lastUpdated: null,
    });
  }
}
