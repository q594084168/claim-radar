export type Country = "US" | "CA" | "AU";

export type ClaimCategory =
  | "data-breach"
  | "class-action"
  | "consumer-settlement";

export type ClaimStatus = "active" | "expired" | "pending" | "closed";

export type PaymentMethod =
  | "paypal"
  | "venmo"
  | "check"
  | "bank"
  | "etransfer";

export interface ClaimScore {
  payout: number; // 0-40
  difficulty: number; // 0-25
  coverage: number; // 0-15
  speed: number; // 0-10
  risk: number; // 0-10
  total: number; // 0-100
}

export interface AIExtractedData {
  title: string;
  description: string;
  country: Country;
  category: ClaimCategory;
  deadline: string | null;
  openDate: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  needReceipt: boolean;
  needPurchase: boolean;
  needAccount: boolean;
  accountType: string | null;
  needResidency: boolean;
  payPaypal: boolean;
  payVenmo: boolean;
  payCheck: boolean;
  payBank: boolean;
  payEtransfer: boolean;
  eligibleStates: string[];
  summary: string;
}

export interface ClaimWithScore {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  category: string;
  deadline: Date | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  needReceipt: boolean;
  needPurchase: boolean;
  payPaypal: boolean;
  payCheck: boolean;
  status: string;
  scoreTotal: number | null;
  scorePayout: number | null;
  scoreDifficulty: number | null;
  scoreCoverage: number | null;
  scoreSpeed: number | null;
  scoreRisk: number | null;
  officialUrl: string | null;
  sourceName: string | null;
}
