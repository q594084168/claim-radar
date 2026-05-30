import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Path to preloaded data file
const DATA_FILE_PATH = path.join(process.cwd(), "public", "data", "claims.json");

/**
 * Get preloaded data from file
 */
async function getPreloadedData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return empty
    return null;
  }
}

export async function GET() {
  try {
    const data = await getPreloadedData();

    if (!data) {
      return NextResponse.json(
        { success: false, error: "No preloaded data available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      claims: data.claims,
      total: data.claims.length,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error("Error loading preloaded data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load data" },
      { status: 500 }
    );
  }
}
