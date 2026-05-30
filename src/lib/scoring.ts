import { ClaimScore } from "@/types/claim";

interface ScoringInput {
  estimatedMin: number | null;
  estimatedMax: number | null;
  needReceipt: boolean;
  needPurchase: boolean;
  needAccount: boolean;
  country: string;
  eligibleStates: string[];
  payPaypal: boolean;
  payVenmo: boolean;
  payCheck: boolean;
  payBank: boolean;
  payEtransfer: boolean;
  deadline: Date | null;
}

/**
 * Calculate Claim Score based on the 5-dimension scoring system
 *
 * Payout (40%): Higher estimated payout = higher score
 * Difficulty (25%): Fewer requirements = higher score
 * Coverage (15%): More states/countries = higher score
 * Speed (10%): Faster payment methods = higher score
 * Risk (10%): Less risk factors = higher score
 */
export function calculateClaimScore(input: ScoringInput): ClaimScore {
  const payout = calculatePayoutScore(input.estimatedMin, input.estimatedMax);
  const difficulty = calculateDifficultyScore(input);
  const coverage = calculateCoverageScore(input.country, input.eligibleStates);
  const speed = calculateSpeedScore(input);
  const risk = calculateRiskScore(input);

  return {
    payout,
    difficulty,
    coverage,
    speed,
    risk,
    total: payout + difficulty + coverage + speed + risk,
  };
}

function calculatePayoutScore(min: number | null, max: number | null): number {
  const avg = ((min ?? 0) + (max ?? 0)) / 2;

  if (avg >= 100) return 40;
  if (avg >= 50) return 35;
  if (avg >= 20) return 30;
  if (avg >= 10) return 20;
  if (avg >= 5) return 15;
  return 10;
}

function calculateDifficultyScore(input: ScoringInput): number {
  let score = 25; // Start with max

  // Deduct for each requirement
  if (input.needReceipt) score -= 10;
  if (input.needPurchase) score -= 5;
  if (input.needAccount) score -= 5;

  return Math.max(0, score);
}

function calculateCoverageScore(country: string, states: string[]): number {
  // If no state restriction, full coverage
  if (states.length === 0) return 15;

  // More states = higher score
  if (states.length >= 40) return 12;
  if (states.length >= 20) return 10;
  if (states.length >= 10) return 7;
  return 5;
}

function calculateSpeedScore(input: ScoringInput): number {
  let score = 0;

  // PayPal/Venmo = fastest
  if (input.payPaypal || input.payVenmo) score += 10;
  // Bank transfer = medium
  else if (input.payBank || input.payEtransfer) score += 7;
  // Check = slowest
  else if (input.payCheck) score += 4;
  else score += 5; // Unknown = medium

  return score;
}

function calculateRiskScore(input: ScoringInput): number {
  let score = 10; // Start with max

  // Deadline risk
  if (input.deadline) {
    const daysUntilDeadline = Math.ceil(
      (input.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDeadline < 7) score -= 5;
    else if (daysUntilDeadline < 30) score -= 2;
  }

  // No official URL = higher risk
  // This would need to be passed in, but for now we'll skip

  return Math.max(0, score);
}

/**
 * Get human-readable score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  if (score >= 20) return "Poor";
  return "Very Poor";
}

/**
 * Get score color class for UI
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  if (score >= 20) return "text-orange-600";
  return "text-red-600";
}
