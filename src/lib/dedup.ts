// Deduplication System for ClaimRadar
// Prevents duplicate claims from being stored

export interface ClaimFingerprint {
  hash: string;
  title: string;
  deadline: string | null;
  payoutMax: number | null;
  source: string;
}

/**
 * Generate fingerprint for a claim
 * Used to detect duplicates
 */
export function generateFingerprint(data: {
  title: string;
  deadline?: string | null;
  payoutMax?: number | null;
  sourceUrl?: string;
}): ClaimFingerprint {
  // Normalize title: lowercase, remove extra spaces, remove special chars
  const normalizedTitle = data.title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Create fingerprint string
  const fingerprintString = [
    normalizedTitle,
    data.deadline || "no-deadline",
    data.payoutMax?.toString() || "no-payout",
    data.sourceUrl || "no-url",
  ].join("|");

  // Generate hash
  const hash = simpleHash(fingerprintString);

  return {
    hash,
    title: normalizedTitle,
    deadline: data.deadline || null,
    payoutMax: data.payoutMax || null,
    source: data.sourceUrl || "unknown",
  };
}

/**
 * Simple hash function (for fingerprinting)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if a claim already exists in the database
 */
export async function isDuplicate(
  fingerprint: ClaimFingerprint,
  existingFingerprints: Set<string>
): Promise<boolean> {
  return existingFingerprints.has(fingerprint.hash);
}

/**
 * Find similar claims (potential duplicates)
 */
export function findSimilarClaims(
  claim: {
    title: string;
    deadline?: string | null;
    payoutMax?: number | null;
  },
  existingClaims: Array<{
    title: string;
    deadline?: string | null;
    payoutMax?: number | null;
  }>
): Array<{ title: string; similarity: number }> {
  const similar: Array<{ title: string; similarity: number }> = [];

  for (const existing of existingClaims) {
    const similarity = calculateSimilarity(claim.title, existing.title);

    // If titles are very similar (>80% match), likely duplicate
    if (similarity > 0.8) {
      similar.push({
        title: existing.title,
        similarity,
      });
    }
    // If same deadline and similar payout, might be duplicate
    else if (
      claim.deadline &&
      existing.deadline &&
      claim.deadline === existing.deadline &&
      claim.payoutMax &&
      existing.payoutMax &&
      Math.abs(claim.payoutMax - existing.payoutMax) < 10
    ) {
      similar.push({
        title: existing.title,
        similarity: 0.6,
      });
    }
  }

  return similar.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Calculate string similarity (Levenshtein-based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;

  const len1 = s1.length;
  const len2 = s2.length;

  // Quick length check
  if (Math.abs(len1 - len2) > Math.max(len1, len2) * 0.3) {
    return 0;
  }

  // Calculate Levenshtein distance
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const maxLen = Math.max(len1, len2);
  const distance = matrix[len1][len2];

  return 1 - distance / maxLen;
}

/**
 * Merge duplicate claims (keep the more complete one)
 */
export function mergeClaims(
  claim1: {
    title: string;
    description?: string;
    deadline?: string | null;
    payoutMin?: number | null;
    payoutMax?: number | null;
    officialUrl?: string;
    sourceName?: string;
  },
  claim2: {
    title: string;
    description?: string;
    deadline?: string | null;
    payoutMin?: number | null;
    payoutMax?: number | null;
    officialUrl?: string;
    sourceName?: string;
  }
): typeof claim1 {
  // Keep the claim with more data
  const score1 = calculateCompleteness(claim1);
  const score2 = calculateCompleteness(claim2);

  const primary = score1 >= score2 ? claim1 : claim2;
  const secondary = score1 >= score2 ? claim2 : claim1;

  // Merge: use primary's data, fill gaps with secondary
  return {
    title: primary.title,
    description: primary.description || secondary.description,
    deadline: primary.deadline || secondary.deadline,
    payoutMin: primary.payoutMin || secondary.payoutMin,
    payoutMax: primary.payoutMax || secondary.payoutMax,
    officialUrl: primary.officialUrl || secondary.officialUrl,
    sourceName: primary.sourceName || secondary.sourceName,
  };
}

/**
 * Calculate data completeness score
 */
function calculateCompleteness(claim: {
  title?: string;
  description?: string;
  deadline?: string | null;
  payoutMin?: number | null;
  payoutMax?: number | null;
  officialUrl?: string;
}): number {
  let score = 0;

  if (claim.title) score += 1;
  if (claim.description && claim.description.length > 50) score += 2;
  if (claim.deadline) score += 2;
  if (claim.payoutMin) score += 1;
  if (claim.payoutMax) score += 1;
  if (claim.officialUrl) score += 2;

  return score;
}
