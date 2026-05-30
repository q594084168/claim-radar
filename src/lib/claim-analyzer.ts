// Claim Analyzer - Determine if a claim is actionable or just news

export interface ClaimAnalysis {
  isActionable: boolean;
  confidence: number; // 0-100
  reason: string;
  category: "actionable" | "news" | "unknown";
  signals: string[];
}

/**
 * Analyze if a claim is actionable (can apply) or just news
 */
export function analyzeClaim(claim: {
  title: string;
  description: string;
  officialUrl: string;
  deadline: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  tags: string[];
}): ClaimAnalysis {
  const signals: string[] = [];
  let actionableScore = 0;
  let newsScore = 0;

  const titleLower = claim.title.toLowerCase();
  const descLower = claim.description?.toLowerCase() || "";
  const urlLower = claim.officialUrl?.toLowerCase() || "";

  // ============ ACTIONABLE SIGNALS ============

  // 1. Has settlement/claim URL patterns
  if (urlLower.includes("settlement") || urlLower.includes("claim")) {
    actionableScore += 30;
    signals.push("✅ Has settlement URL");
  }

  // 2. Has deadline (indicates active claim period)
  if (claim.deadline) {
    const daysLeft = getDaysUntilDeadline(claim.deadline);
    if (daysLeft > 0) {
      actionableScore += 25;
      signals.push("✅ Has active deadline");
    } else {
      newsScore += 10;
      signals.push("⚠️ Deadline passed");
    }
  }

  // 3. Has payout estimate
  if (claim.estimatedMin || claim.estimatedMax) {
    actionableScore += 15;
    signals.push("✅ Has payout estimate");
  }

  // 4. Title contains action words
  const actionWords = ["file a claim", "submit claim", "apply now", "claim deadline", "how to claim", "settlement"];
  if (actionWords.some((word) => titleLower.includes(word))) {
    actionableScore += 20;
    signals.push("✅ Title indicates actionable");
  }

  // 5. Description contains application language
  const applyPhrases = ["file a claim", "submit your claim", "apply for", "claim form", "deadline to file"];
  if (applyPhrases.some((phrase) => descLower.includes(phrase))) {
    actionableScore += 20;
    signals.push("✅ Description mentions applying");
  }

  // 6. Has no-receipt tag (easier to apply)
  if (claim.tags?.includes("no-receipt")) {
    actionableScore += 5;
    signals.push("✅ No receipt required");
  }

  // ============ NEWS SIGNALS ============

  // 1. Title is a list/roundup article
  const newsPatterns = [
    /^\d+\s+(class action|settlement|claim)/i,
    /roundup/i,
    /digest/i,
    /weekly/i,
    /monthly/i,
    /top \d+/i,
    /best \d+/i,
    /new \d+/i,
  ];
  if (newsPatterns.some((pattern) => pattern.test(claim.title))) {
    newsScore += 40;
    signals.push("📰 News/roundup article");
  }

  // 2. URL is a news site, not settlement site
  const newsDomains = ["topclassactions.com", "classaction.org", "news.google.com", "reuters.com", "bloomberg.com"];
  if (newsDomains.some((domain) => urlLower.includes(domain))) {
    newsScore += 20;
    signals.push("📰 News source URL");
  }

  // 3. Title contains news words
  const newsWords = ["announces", "report", "study", "finds", "investigation", "lawsuit filed", "sues"];
  if (newsWords.some((word) => titleLower.includes(word))) {
    newsScore += 25;
    signals.push("📰 News language in title");
  }

  // 4. No clear application info
  if (!descLower.includes("claim") && !descLower.includes("apply") && !descLower.includes("file")) {
    newsScore += 15;
    signals.push("⚠️ No application info");
  }

  // 5. Generic/educational content
  const educationalPhrases = ["what is", "how does", "guide to", "explained", "everything you need to know"];
  if (educationalPhrases.some((phrase) => titleLower.includes(phrase))) {
    newsScore += 30;
    signals.push("📰 Educational content");
  }

  // ============ CALCULATE RESULT ============

  const totalScore = actionableScore - newsScore;
  const confidence = Math.min(100, Math.abs(totalScore));

  let category: "actionable" | "news" | "unknown";
  let isActionable: boolean;
  let reason: string;

  if (totalScore >= 30) {
    category = "actionable";
    isActionable = true;
    reason = "This appears to be an active settlement you can apply for.";
  } else if (totalScore <= -20) {
    category = "news";
    isActionable = false;
    reason = "This appears to be a news article or informational content, not an active claim.";
  } else {
    category = "unknown";
    isActionable = false;
    reason = "Unable to determine if this is an active claim. Check the official website.";
  }

  return {
    isActionable,
    confidence,
    reason,
    category,
    signals,
  };
}

/**
 * Batch analyze multiple claims
 */
export function analyzeClaims(claims: Array<{
  title: string;
  description: string;
  officialUrl: string;
  deadline: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  tags: string[];
}>): {
  actionable: number;
  news: number;
  unknown: number;
  total: number;
} {
  let actionable = 0;
  let news = 0;
  let unknown = 0;

  for (const claim of claims) {
    const analysis = analyzeClaim(claim);
    if (analysis.category === "actionable") actionable++;
    else if (analysis.category === "news") news++;
    else unknown++;
  }

  return {
    actionable,
    news,
    unknown,
    total: claims.length,
  };
}

function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
