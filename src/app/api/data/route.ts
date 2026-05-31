import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { crawlClaimDepot } from "@/lib/data-acquisition/crawlers/claimdepot";
import { convertToDatabaseFormat } from "@/lib/data-acquisition/orchestrator";
import { generateTags } from "@/lib/auto-tag";
import { calculateEnhancedScore } from "@/lib/enhanced-score";

// Static data file path
const DATA_FILE = path.join(process.cwd(), "public", "claims-data.json");

// In-memory cache
let cachedData: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        claims: cachedData,
        total: cachedData.length,
        source: "ClaimDepot",
        lastUpdated: new Date(lastFetchTime).toISOString(),
      });
    }

    // Try to read from file first
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      const claims = JSON.parse(data);
      cachedData = claims;
      lastFetchTime = now;

      return NextResponse.json({
        success: true,
        claims: claims,
        total: claims.length,
        source: "ClaimDepot",
        lastUpdated: new Date().toISOString(),
      });
    } catch (fileError) {
      // File doesn't exist, fetch from ClaimDepot
      console.log("No pre-generated data file, fetching from ClaimDepot...");
    }

    // Fetch from ClaimDepot
    const cases = await crawlClaimDepot();
    const processedClaims = cases.slice(0, 100).map((c) => {
      const dbFormat = convertToDatabaseFormat(c);

      const tags = generateTags({
        title: dbFormat.title,
        description: dbFormat.description,
        needReceipt: dbFormat.needReceipt,
        payPaypal: dbFormat.payPaypal,
        payCheck: dbFormat.payCheck,
        payBank: dbFormat.payBank,
        estimatedMin: dbFormat.estimatedMin,
        estimatedMax: dbFormat.estimatedMax,
        deadline: dbFormat.deadline,
        country: dbFormat.country,
        category: dbFormat.category,
      });

      const score = calculateEnhancedScore({
        estimatedMin: dbFormat.estimatedMin,
        estimatedMax: dbFormat.estimatedMax,
        needReceipt: dbFormat.needReceipt,
        payPaypal: dbFormat.payPaypal,
        payCheck: dbFormat.payCheck,
        payBank: dbFormat.payBank,
        deadline: dbFormat.deadline,
        tags: tags.tags,
      });

      return {
        id: dbFormat.slug,
        slug: dbFormat.slug,
        title: dbFormat.title,
        description: dbFormat.description,
        country: dbFormat.country,
        category: dbFormat.category,
        deadline: dbFormat.deadline,
        estimatedMin: dbFormat.estimatedMin,
        estimatedMax: dbFormat.estimatedMax,
        needReceipt: dbFormat.needReceipt,
        payPaypal: dbFormat.payPaypal,
        payCheck: dbFormat.payCheck,
        payBank: dbFormat.payBank,
        officialUrl: dbFormat.officialUrl,
        sourceName: "ClaimDepot",
        status: dbFormat.status,
        tags,
        score,
      };
    });

    // Update cache
    cachedData = processedClaims;
    lastFetchTime = now;

    return NextResponse.json({
      success: true,
      claims: processedClaims,
      total: processedClaims.length,
      source: "ClaimDepot",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in data API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load data" },
      { status: 500 }
    );
  }
}
