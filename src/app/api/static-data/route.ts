import { NextResponse } from "next/server";
import { crawlClaimDepot } from "@/lib/data-acquisition/crawlers/claimdepot";
import { convertToDatabaseFormat } from "@/lib/data-acquisition/orchestrator";
import { generateTags } from "@/lib/auto-tag";
import { calculateEnhancedScore } from "@/lib/enhanced-score";

// Pre-collected static data (updated periodically)
let staticData: any[] | null = null;
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get or refresh static data
 */
async function getStaticData() {
  const now = Date.now();

  // Return cached data if still valid
  if (staticData && (now - lastUpdateTime) < UPDATE_INTERVAL) {
    return staticData;
  }

  console.log("Refreshing static data from ClaimDepot...");
  const allClaims: any[] = [];

  // Source: ClaimDepot (high quality, structured data)
  try {
    const claimDepotCases = await crawlClaimDepot();
    const claimDepotData = claimDepotCases.slice(0, 100).map(convertToDatabaseFormat);
    console.log(`ClaimDepot: ${claimDepotData.length} claims`);
    for (const claim of claimDepotData) {
      allClaims.push(processClaim(claim, "ClaimDepot"));
    }
  } catch (error) {
    console.error("Error fetching ClaimDepot:", error);
  }

  // Deduplicate
  const uniqueClaims = deduplicateClaims(allClaims);
  console.log(`Total unique claims: ${uniqueClaims.length}`);

  // Update cache
  staticData = uniqueClaims;
  lastUpdateTime = now;

  return staticData;
}

/**
 * Process a raw claim
 */
function processClaim(rawClaim: any, source: string) {
  const tags = generateTags({
    title: rawClaim.title,
    description: rawClaim.description,
    needReceipt: rawClaim.needReceipt,
    payPaypal: rawClaim.payPaypal,
    payCheck: rawClaim.payCheck,
    payBank: rawClaim.payBank,
    estimatedMin: rawClaim.estimatedMin,
    estimatedMax: rawClaim.estimatedMax,
    deadline: rawClaim.deadline,
    country: rawClaim.country,
    category: rawClaim.category,
  });

  const score = calculateEnhancedScore({
    estimatedMin: rawClaim.estimatedMin,
    estimatedMax: rawClaim.estimatedMax,
    needReceipt: rawClaim.needReceipt,
    payPaypal: rawClaim.payPaypal,
    payCheck: rawClaim.payCheck,
    payBank: rawClaim.payBank,
    deadline: rawClaim.deadline,
    tags: tags.tags,
  });

  return {
    id: rawClaim.id || rawClaim.slug,
    slug: rawClaim.slug || generateSlug(rawClaim.title),
    title: rawClaim.title,
    description: rawClaim.description || "",
    country: rawClaim.country || "US",
    category: rawClaim.category || "class-action",
    deadline: rawClaim.deadline,
    estimatedMin: rawClaim.estimatedMin,
    estimatedMax: rawClaim.estimatedMax,
    needReceipt: rawClaim.needReceipt || false,
    payPaypal: rawClaim.payPaypal || false,
    payCheck: rawClaim.payCheck || false,
    payBank: rawClaim.payBank || false,
    officialUrl: rawClaim.officialUrl || rawClaim.sourceUrl,
    sourceName: source,
    status: rawClaim.status || "active",
    tags,
    score,
  };
}

/**
 * Deduplicate claims
 */
function deduplicateClaims(claims: any[]) {
  const seen = new Map();
  for (const claim of claims) {
    const key = claim.title.toLowerCase().replace(/[^\w]/g, "").slice(0, 50);
    if (!seen.has(key)) {
      seen.set(key, claim);
    }
  }
  return Array.from(seen.values());
}

/**
 * Generate slug
 */
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function GET() {
  try {
    const data = await getStaticData();

    return NextResponse.json({
      success: true,
      claims: data,
      total: data.length,
      lastUpdated: new Date(lastUpdateTime).toISOString(),
    });
  } catch (error) {
    console.error("Error in static-data API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load data" },
      { status: 500 }
    );
  }
}
