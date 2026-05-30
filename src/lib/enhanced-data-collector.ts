// Enhanced Data Collector for ClaimRadar V2
// Integrates dedup, auto-tagging, and enhanced scoring

import { collectRealData, RealClaim } from "./real-data-collector";
import { generateFingerprint, isDuplicate, ClaimFingerprint } from "./dedup";
import { generateTags, ClaimTags } from "./auto-tag";
import { calculateEnhancedScore, EnhancedScore } from "./enhanced-score";

export interface EnhancedClaim {
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
  fingerprint: ClaimFingerprint;
  tags: ClaimTags;
  score: EnhancedScore;
}

// In-memory fingerprint cache for dedup
const fingerprintCache = new Set<string>();

/**
 * Collect and enhance data with dedup, tags, and scoring
 */
export async function collectEnhancedData(): Promise<EnhancedClaim[]> {
  console.log("Starting enhanced data collection...");

  // Step 1: Collect raw data
  const rawData = await collectRealData();
  console.log(`Raw data collected: ${rawData.length} claims`);

  // Step 2: Process each claim
  const enhancedClaims: EnhancedClaim[] = [];
  let duplicatesSkipped = 0;

  for (const rawClaim of rawData) {
    // Generate fingerprint
    const fingerprint = generateFingerprint({
      title: rawClaim.title,
      deadline: rawClaim.deadline,
      payoutMax: rawClaim.estimatedMax,
      sourceUrl: rawClaim.sourceUrl,
    });

    // Check for duplicate
    if (fingerprintCache.has(fingerprint.hash)) {
      duplicatesSkipped++;
      continue;
    }

    // Add to cache
    fingerprintCache.add(fingerprint.hash);

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

    // Calculate enhanced score
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

    // Create enhanced claim
    const enhancedClaim: EnhancedClaim = {
      id: rawClaim.id,
      slug: rawClaim.slug,
      title: rawClaim.title,
      description: rawClaim.description,
      country: rawClaim.country,
      category: rawClaim.category,
      deadline: rawClaim.deadline,
      estimatedMin: rawClaim.estimatedMin,
      estimatedMax: rawClaim.estimatedMax,
      needReceipt: rawClaim.needReceipt,
      payPaypal: rawClaim.payPaypal,
      payCheck: rawClaim.payCheck,
      payBank: rawClaim.payBank,
      officialUrl: rawClaim.officialUrl,
      sourceName: rawClaim.sourceName,
      publishedAt: rawClaim.publishedAt,
      status: rawClaim.status,
      fingerprint,
      tags,
      score,
    };

    enhancedClaims.push(enhancedClaim);
  }

  console.log(`Enhanced data processing complete:`);
  console.log(`- Total claims: ${enhancedClaims.length}`);
  console.log(`- Duplicates skipped: ${duplicatesSkipped}`);

  return enhancedClaims;
}

/**
 * Get claims filtered by tag
 */
export function getClaimsByTag(
  claims: EnhancedClaim[],
  tag: string
): EnhancedClaim[] {
  return claims.filter((c) => c.tags.tags.includes(tag));
}

/**
 * Get claims filtered by category
 */
export function getClaimsByCategory(
  claims: EnhancedClaim[],
  category: string
): EnhancedClaim[] {
  return claims.filter((c) => c.tags.categories.includes(category));
}

/**
 * Get high-value claims
 */
export function getHighValueClaims(
  claims: EnhancedClaim[],
  minScore: number = 70
): EnhancedClaim[] {
  return claims
    .filter((c) => c.score.total >= minScore)
    .sort((a, b) => b.score.total - a.score.total);
}

/**
 * Get claims expiring soon
 */
export function getExpiringSoonClaims(
  claims: EnhancedClaim[],
  daysThreshold: number = 30
): EnhancedClaim[] {
  const now = new Date();
  const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

  return claims
    .filter((c) => {
      if (!c.deadline) return false;
      const deadline = new Date(c.deadline);
      return deadline <= threshold && deadline >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.deadline!);
      const dateB = new Date(b.deadline!);
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Get no-receipt claims
 */
export function getNoReceiptClaims(
  claims: EnhancedClaim[]
): EnhancedClaim[] {
  return claims.filter((c) => c.needReceipt === false);
}

/**
 * Get PayPal claims
 */
export function getPayPalClaims(
  claims: EnhancedClaim[]
): EnhancedClaim[] {
  return claims.filter((c) => c.payPaypal === true);
}

/**
 * Get statistics about the claims
 */
export function getClaimsStats(claims: EnhancedClaim[]): {
  total: number;
  byCountry: Record<string, number>;
  byCategory: Record<string, number>;
  byTag: Record<string, number>;
  avgScore: number;
  noReceiptCount: number;
  paypalCount: number;
  expiringSoonCount: number;
} {
  const stats = {
    total: claims.length,
    byCountry: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byTag: {} as Record<string, number>,
    avgScore: 0,
    noReceiptCount: 0,
    paypalCount: 0,
    expiringSoonCount: 0,
  };

  let totalScore = 0;

  for (const claim of claims) {
    // Country
    stats.byCountry[claim.country] = (stats.byCountry[claim.country] || 0) + 1;

    // Category
    stats.byCategory[claim.category] = (stats.byCategory[claim.category] || 0) + 1;

    // Tags
    for (const tag of claim.tags.tags) {
      stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
    }

    // Score
    totalScore += claim.score.total;

    // No receipt
    if (!claim.needReceipt) stats.noReceiptCount++;

    // PayPal
    if (claim.payPaypal) stats.paypalCount++;

    // Expiring soon
    if (claim.deadline) {
      const daysLeft = getDaysUntilDeadline(claim.deadline);
      if (daysLeft <= 30 && daysLeft > 0) {
        stats.expiringSoonCount++;
      }
    }
  }

  stats.avgScore = claims.length > 0 ? Math.round(totalScore / claims.length) : 0;

  return stats;
}

/**
 * Get days until deadline
 */
function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}
