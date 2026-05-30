import { US_STATES } from "@/data/us-states";

interface Claim {
  id: string;
  slug: string;
  title: string;
  country: string;
  category: string;
  deadline: string;
  estimatedMin: number;
  estimatedMax: number;
  needReceipt: boolean;
  payPaypal: boolean;
  scoreTotal: number;
  eligibleStates: string[];
}

interface SEOPage {
  path: string;
  title: string;
  description: string;
  type: "claim" | "state" | "condition" | "opportunity";
}

/**
 * Generate all SEO pages for a given set of claims
 */
export function generateSEOPages(claims: Claim[]): SEOPage[] {
  const pages: SEOPage[] = [];

  // 1. Claim pages
  claims.forEach((claim) => {
    pages.push({
      path: `/${claim.country.toLowerCase()}/${claim.slug}`,
      title: `${claim.title} - Settlement Claim | ClaimRadar`,
      description: `File a claim for the ${claim.title}. Estimated payout: $${claim.estimatedMin}-$${claim.estimatedMax}. ${claim.needReceipt ? "Receipt required." : "No receipt required."}`,
      type: "claim",
    });
  });

  // 2. State pages (US only)
  const usClaims = claims.filter((c) => c.country === "US");
  if (usClaims.length > 0) {
    US_STATES.forEach((state) => {
      const stateClaims = usClaims.filter(
        (c) =>
          c.eligibleStates.length === 0 ||
          c.eligibleStates.includes(state.code)
      );

      if (stateClaims.length > 0) {
        pages.push({
          path: `/us/${state.code.toLowerCase()}`,
          title: `Class Action Settlements in ${state.name} | ClaimRadar`,
          description: `Find active settlements available to ${state.name} residents. ${stateClaims.length} claims available.`,
          type: "state",
        });
      }
    });
  }

  // 3. Condition pages
  const conditions = [
    {
      slug: "no-receipt-claims",
      title: "No Receipt Settlements",
      description: "Claims that don't require receipts",
      filter: (c: Claim) => !c.needReceipt,
    },
    {
      slug: "paypal-settlements",
      title: "PayPal Settlements",
      description: "Claims that pay via PayPal",
      filter: (c: Claim) => c.payPaypal,
    },
    {
      slug: "settlements-without-proof",
      title: "Settlements Without Proof",
      description: "Claims that don't require proof of purchase",
      filter: (c: Claim) => !c.needReceipt,
    },
    {
      slug: "data-breach-payouts",
      title: "Data Breach Payouts",
      description: "Compensation for data breaches",
      filter: (c: Claim) => c.category === "data-breach",
    },
    {
      slug: "class-action-claims",
      title: "Class Action Claims",
      description: "Active class action settlements",
      filter: (c: Claim) => c.category === "class-action",
    },
    {
      slug: "consumer-refunds",
      title: "Consumer Refunds",
      description: "Refunds for products and services",
      filter: (c: Claim) => c.category === "consumer-settlement",
    },
    {
      slug: "expiring-soon",
      title: "Expiring Soon",
      description: "Claims with deadlines approaching",
      filter: (c: Claim) => {
        const daysLeft = Math.ceil(
          (new Date(c.deadline).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        return daysLeft <= 30 && daysLeft > 0;
      },
    },
  ];

  conditions.forEach((condition) => {
    const filteredClaims = claims.filter(condition.filter);
    if (filteredClaims.length > 0) {
      pages.push({
        path: `/us/${condition.slug}`,
        title: `${condition.title} | ClaimRadar`,
        description: `${condition.description}. ${filteredClaims.length} active claims available.`,
        type: "condition",
      });
    }
  });

  // 4. Opportunity pages
  const opportunities = [
    {
      slug: "highest-paying-settlements",
      title: "Highest Paying Settlements",
      description: "Settlements with the biggest payouts",
    },
    {
      slug: "best-settlements-2026",
      title: "Best Settlements 2026",
      description: "Top-rated settlements by Claim Score",
    },
    {
      slug: "fastest-payments-settlements",
      title: "Fastest Payments Settlements",
      description: "Claims that pay quickly via PayPal",
    },
  ];

  opportunities.forEach((opp) => {
    pages.push({
      path: `/us/${opp.slug}`,
      title: `${opp.title} | ClaimRadar`,
      description: opp.description,
      type: "opportunity",
    });
  });

  return pages;
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(page: SEOPage) {
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      siteName: "ClaimRadar",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.title,
      description: page.description,
    },
  };
}

/**
 * Generate sitemap entries
 */
export function generateSitemapEntries(
  pages: SEOPage[],
  baseUrl: string = "https://claimradar.com"
) {
  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.type === "claim" ? "weekly" : "daily",
    priority: page.type === "opportunity" ? 0.9 : page.type === "condition" ? 0.8 : 0.7,
  }));
}

/**
 * Calculate page statistics
 */
export function calculatePageStats(claims: Claim[]) {
  const totalClaims = claims.length;
  const noReceiptClaims = claims.filter((c) => !c.needReceipt).length;
  const paypalClaims = claims.filter((c) => c.payPaypal).length;
  const avgPayout =
    claims.reduce((sum, c) => sum + (c.estimatedMin + c.estimatedMax) / 2, 0) /
    totalClaims;

  return {
    totalClaims,
    noReceiptClaims,
    paypalClaims,
    avgPayout: Math.round(avgPayout),
    totalStates: US_STATES.length,
  };
}
