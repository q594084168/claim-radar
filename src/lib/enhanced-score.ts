// Enhanced Score System for ClaimRadar V2
// Incorporates auto-tags for better scoring

export interface EnhancedScore {
  total: number;
  payout: number;
  difficulty: number;
  speed: number;
  ease: number;
  seoValue: number;
  tags: string[];
}

/**
 * Calculate enhanced score with tags
 */
export function calculateEnhancedScore(claim: {
  estimatedMin?: number | null;
  estimatedMax?: number | null;
  needReceipt?: boolean;
  payPaypal?: boolean;
  payCheck?: boolean;
  payBank?: boolean;
  deadline?: string | null;
  tags?: string[];
}): EnhancedScore {
  // ============ PAYOUT SCORE (0-40) ============
  const maxPayout = claim.estimatedMax || 0;
  let payout = 0;

  if (maxPayout >= 500) payout = 40;
  else if (maxPayout >= 200) payout = 35;
  else if (maxPayout >= 100) payout = 30;
  else if (maxPayout >= 50) payout = 25;
  else if (maxPayout >= 20) payout = 20;
  else if (maxPayout >= 10) payout = 15;
  else if (maxPayout > 0) payout = 10;

  // ============ DIFFICULTY SCORE (0-35) ============
  let difficulty = 35; // Start with max (easiest)

  if (claim.needReceipt) difficulty -= 15;
  if (!claim.payPaypal && !claim.payBank) difficulty -= 5;

  // Bonus for easy claims
  if (claim.tags?.includes("no-receipt")) difficulty += 5;
  if (claim.tags?.includes("easy-claim")) difficulty += 5;

  difficulty = Math.max(0, Math.min(35, difficulty));

  // ============ SPEED SCORE (0-15) ============
  let speed = 10; // Default

  if (claim.deadline) {
    const daysLeft = getDaysUntilDeadline(claim.deadline);

    if (daysLeft <= 0) speed = 0; // Expired
    else if (daysLeft <= 7) speed = 15; // Urgent
    else if (daysLeft <= 30) speed = 12; // Soon
    else if (daysLeft <= 90) speed = 10; // Normal
    else speed = 8; // New
  }

  // ============ EASE SCORE (0-10) ============
  let ease = 5; // Default

  if (claim.payPaypal) ease = 10;
  else if (claim.payBank) ease = 8;
  else if (claim.payCheck) ease = 5;

  // ============ SEO VALUE SCORE (0-10) ============
  let seoValue = 5; // Default

  if (claim.tags) {
    // Bonus for high-value SEO tags
    if (claim.tags.includes("no-receipt")) seoValue += 2;
    if (claim.tags.includes("paypal")) seoValue += 2;
    if (claim.tags.includes("high-value")) seoValue += 2;
    if (claim.tags.includes("urgent")) seoValue += 1;
  }

  seoValue = Math.min(10, seoValue);

  // ============ CALCULATE TOTAL ============
  const total = payout + difficulty + speed + ease + seoValue;

  return {
    total: Math.min(100, total),
    payout,
    difficulty,
    speed,
    ease,
    seoValue,
    tags: claim.tags || [],
  };
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 50) return "Average";
  return "Below Average";
}

/**
 * Get score color
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
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
