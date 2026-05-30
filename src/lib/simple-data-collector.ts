// Simplified Data Collector - ClaimDepot + TopClassActions only
// Focus on speed and reliability

import { collectRealData } from "./real-data-collector";
import { crawlClaimDepot } from "./data-acquisition/crawlers/claimdepot";
import { convertToDatabaseFormat } from "./data-acquisition/orchestrator";
import { generateFingerprint, ClaimFingerprint } from "./dedup";
import { generateTags, ClaimTags } from "./auto-tag";
import { calculateEnhancedScore, EnhancedScore } from "./enhanced-score";

export interface SimpleClaim {
  id: string;
  slug: string;
  title: string;
  description: string;
  country: string;
  category: string;
  deadline: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  needReceipt: boolean;
  payPaypal: boolean;
  payCheck: boolean;
  payBank: boolean;
  officialUrl: string;
  sourceName: string;
  publishedAt: string;
  status: string;
  tags: ClaimTags;
  score: EnhancedScore;
}

// In-memory cache
let cachedClaims: SimpleClaim[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Collect data from ClaimDepot and TopClassActions
 */
export async function collectSimpleData(): Promise<SimpleClaim[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedClaims && (now - lastFetchTime) < CACHE_DURATION) {
    console.log("Returning cached data");
    return cachedClaims;
  }

  console.log("Fetching fresh data...");
  const allClaims: SimpleClaim[] = [];

  // Source 1: TopClassActions RSS (fast)
  try {
    const rssData = await collectRealData();
    console.log(`TopClassActions: ${rssData.length} claims`);

    for (const claim of rssData) {
      const processed = processClaim(claim, "TopClassActions");
      allClaims.push(processed);
    }
  } catch (error) {
    console.error("Error fetching TopClassActions:", error);
  }

  // Source 2: ClaimDepot (pre-collected data)
  try {
    const claimDepotData = await getClaimDepotData();
    console.log(`ClaimDepot: ${claimDepotData.length} claims`);

    for (const claim of claimDepotData) {
      const processed = processClaim(claim, "ClaimDepot");
      allClaims.push(processed);
    }
  } catch (error) {
    console.error("Error fetching ClaimDepot:", error);
  }

  // Deduplicate
  const uniqueClaims = deduplicateClaims(allClaims);
  console.log(`Total unique claims: ${uniqueClaims.length}`);

  // Update cache
  cachedClaims = uniqueClaims;
  lastFetchTime = now;

  return uniqueClaims;
}

/**
 * Process a raw claim into SimpleClaim format
 */
function processClaim(rawClaim: any, source: string): SimpleClaim {
  // Generate tags
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

  // Calculate score
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
    publishedAt: rawClaim.publishedAt || new Date().toISOString(),
    status: rawClaim.status || "active",
    tags,
    score,
  };
}

/**
 * Get ClaimDepot data (directly from crawler)
 */
async function getClaimDepotData(): Promise<any[]> {
  try {
    const cases = await crawlClaimDepot();
    return cases.map(convertToDatabaseFormat);
  } catch (error) {
    console.error("Error fetching ClaimDepot data:", error);
    return [];
  }
}

/**
 * Deduplicate claims by title similarity
 */
function deduplicateClaims(claims: SimpleClaim[]): SimpleClaim[] {
  const seen = new Map<string, SimpleClaim>();

  for (const claim of claims) {
    const key = claim.title.toLowerCase().replace(/[^\w]/g, "").slice(0, 50);

    if (!seen.has(key)) {
      seen.set(key, claim);
    } else {
      // Keep the one with more data
      const existing = seen.get(key)!;
      if (claim.estimatedMax && (!existing.estimatedMax || claim.estimatedMax > existing.estimatedMax)) {
        seen.set(key, claim);
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Get statistics about the data
 */
export function getDataStats(claims: SimpleClaim[]): {
  total: number;
  bySource: Record<string, number>;
  byCountry: Record<string, number>;
  byCategory: Record<string, number>;
  noReceiptCount: number;
  highValueCount: number;
  avgScore: number;
} {
  const stats = {
    total: claims.length,
    bySource: {} as Record<string, number>,
    byCountry: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    noReceiptCount: 0,
    highValueCount: 0,
    avgScore: 0,
  };

  let totalScore = 0;

  for (const claim of claims) {
    // By source
    stats.bySource[claim.sourceName] = (stats.bySource[claim.sourceName] || 0) + 1;

    // By country
    stats.byCountry[claim.country] = (stats.byCountry[claim.country] || 0) + 1;

    // By category
    stats.byCategory[claim.category] = (stats.byCategory[claim.category] || 0) + 1;

    // No receipt
    if (!claim.needReceipt) stats.noReceiptCount++;

    // High value
    if ((claim.estimatedMax || 0) >= 500) stats.highValueCount++;

    // Score
    totalScore += claim.score.total;
  }

  stats.avgScore = claims.length > 0 ? Math.round(totalScore / claims.length) : 0;

  return stats;
}
