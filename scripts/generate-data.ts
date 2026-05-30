// Script to generate preloaded data file
// Run this script periodically to update the data

import { collectRealData } from "../src/lib/real-data-collector";
import { crawlClaimDepot } from "../src/lib/data-acquisition/crawlers/claimdepot";
import { convertToDatabaseFormat } from "../src/lib/data-acquisition/orchestrator";
import { generateTags } from "../src/lib/auto-tag";
import { calculateEnhancedScore } from "../src/lib/enhanced-score";
import { promises as fs } from "fs";
import path from "path";

const OUTPUT_FILE = path.join(process.cwd(), "public", "data", "claims.json");

async function generateData() {
  console.log("Starting data generation...");
  const allClaims: any[] = [];

  // Source 1: TopClassActions RSS
  try {
    const rssData = await collectRealData();
    console.log(`TopClassActions: ${rssData.length} claims`);
    for (const claim of rssData) {
      allClaims.push(processClaim(claim, "TopClassActions"));
    }
  } catch (error) {
    console.error("Error fetching TopClassActions:", error);
  }

  // Source 2: ClaimDepot (limit to 100 for speed)
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

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_FILE);
  await fs.mkdir(outputDir, { recursive: true });

  // Write to file
  const output = {
    claims: uniqueClaims,
    lastUpdated: new Date().toISOString(),
    total: uniqueClaims.length,
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Data written to ${OUTPUT_FILE}`);
  console.log(`Total claims: ${uniqueClaims.length}`);
}

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

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

// Run the script
generateData()
  .then(() => {
    console.log("Data generation complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error generating data:", error);
    process.exit(1);
  });
