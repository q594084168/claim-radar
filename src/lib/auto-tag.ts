// Auto-Tagging System for ClaimRadar SEO
// Automatically generates SEO tags for claims

export interface ClaimTags {
  tags: string[];
  seoSlugs: string[];
  categories: string[];
}

/**
 * Generate SEO tags for a claim
 */
export function generateTags(claim: {
  title: string;
  description?: string;
  needReceipt?: boolean;
  payPaypal?: boolean;
  payCheck?: boolean;
  payBank?: boolean;
  estimatedMin?: number | null;
  estimatedMax?: number | null;
  deadline?: string | null;
  country?: string;
  category?: string;
}): ClaimTags {
  const tags: string[] = [];
  const seoSlugs: string[] = [];
  const categories: string[] = [];

  // ============ RECEIPT TAGS ============
  if (!claim.needReceipt) {
    tags.push("no-receipt");
    tags.push("no-proof");
    tags.push("easy-claim");
    seoSlugs.push("no-receipt");
  } else {
    tags.push("receipt-required");
    seoSlugs.push("with-receipt");
  }

  // ============ PAYMENT METHOD TAGS ============
  if (claim.payPaypal) {
    tags.push("paypal");
    tags.push("fast-payment");
    seoSlugs.push("paypal");
  }

  if (claim.payCheck) {
    tags.push("check-payment");
    seoSlugs.push("check");
  }

  if (claim.payBank) {
    tags.push("bank-transfer");
    tags.push("direct-deposit");
    seoSlugs.push("bank-transfer");
  }

  // ============ PAYOUT VALUE TAGS ============
  const maxPayout = claim.estimatedMax || 0;

  if (maxPayout >= 500) {
    tags.push("high-value");
    tags.push("big-payout");
    seoSlugs.push("high-value");
    categories.push("high-value");
  } else if (maxPayout >= 100) {
    tags.push("medium-value");
    categories.push("medium-value");
  } else if (maxPayout > 0) {
    tags.push("low-value");
    categories.push("low-value");
  }

  // ============ DEADLINE TAGS ============
  if (claim.deadline) {
    const daysLeft = getDaysUntilDeadline(claim.deadline);

    if (daysLeft <= 0) {
      tags.push("expired");
      categories.push("expired");
    } else if (daysLeft <= 7) {
      tags.push("urgent");
      tags.push("ending-soon");
      seoSlugs.push("ending-soon");
      categories.push("urgent");
    } else if (daysLeft <= 30) {
      tags.push("closing-soon");
      seoSlugs.push("closing-soon");
      categories.push("closing-soon");
    } else if (daysLeft <= 90) {
      tags.push("open");
      categories.push("open");
    } else {
      tags.push("new");
      categories.push("new");
    }
  }

  // ============ CATEGORY TAGS ============
  if (claim.category) {
    tags.push(claim.category);
    categories.push(claim.category);
  }

  // ============ COUNTRY TAGS ============
  if (claim.country) {
    tags.push(claim.country.toLowerCase());
    categories.push(claim.country.toLowerCase());
  }

  // ============ CONTENT-BASED TAGS ============
  const text = `${claim.title} ${claim.description || ""}`.toLowerCase();

  // Data breach
  if (text.includes("data breach") || text.includes("privacy")) {
    tags.push("data-breach");
    tags.push("privacy");
    categories.push("data-breach");
  }

  // Class action
  if (text.includes("class action") || text.includes("lawsuit")) {
    tags.push("class-action");
    categories.push("class-action");
  }

  // Consumer
  if (text.includes("consumer") || text.includes("refund")) {
    tags.push("consumer");
    categories.push("consumer");
  }

  // Financial
  if (text.includes("bank") || text.includes("credit") || text.includes("financial")) {
    tags.push("financial");
    categories.push("financial");
  }

  // Tech companies
  const techCompanies = ["facebook", "google", "apple", "amazon", "microsoft", "t-mobile", "at&t", "verizon"];
  for (const company of techCompanies) {
    if (text.includes(company)) {
      tags.push(company.replace(/\s/g, "-"));
      categories.push("tech");
    }
  }

  // ============ GENERATE SEO SLUGS ============
  // Add country to slugs
  if (claim.country) {
    seoSlugs.push(claim.country.toLowerCase());
  }

  // Deduplicate
  const uniqueTags = [...new Set(tags)];
  const uniqueSlugs = [...new Set(seoSlugs)];
  const uniqueCategories = [...new Set(categories)];

  return {
    tags: uniqueTags,
    seoSlugs: uniqueSlugs,
    categories: uniqueCategories,
  };
}

/**
 * Generate SEO-friendly URLs for a claim
 */
export function generateSeoUrls(
  claimSlug: string,
  tags: string[]
): string[] {
  const urls: string[] = [];

  // Base URL
  urls.push(`/claim/${claimSlug}`);

  // Generate tag-based URLs
  const tagGroups = {
    receipt: ["no-receipt", "with-receipt", "receipt-required"],
    payment: ["paypal", "check", "bank-transfer"],
    value: ["high-value", "medium-value", "low-value"],
    urgency: ["urgent", "ending-soon", "closing-soon", "new"],
  };

  for (const [group, groupTags] of Object.entries(tagGroups)) {
    const matchingTags = tags.filter((t) => groupTags.includes(t));
    if (matchingTags.length > 0) {
      urls.push(`/claim/${claimSlug}-${matchingTags[0]}`);
    }
  }

  return [...new Set(urls)];
}

/**
 * Generate internal links for a claim
 */
export function generateInternalLinks(
  currentClaim: {
    tags: string[];
    categories: string[];
  },
  allClaims: Array<{
    slug: string;
    title: string;
    tags: string[];
    categories: string[];
    scoreTotal?: number;
  }>
): {
  related: Array<{ slug: string; title: string }>;
  sameCategory: Array<{ slug: string; title: string }>;
  highValue: Array<{ slug: string; title: string }>;
} {
  const related: Array<{ slug: string; title: string }> = [];
  const sameCategory: Array<{ slug: string; title: string }> = [];
  const highValue: Array<{ slug: string; title: string }> = [];

  for (const claim of allClaims) {
    // Skip self
    if (claim.tags === currentClaim.tags) continue;

    // Find related (share tags)
    const sharedTags = claim.tags.filter((t) =>
      currentClaim.tags.includes(t)
    );
    if (sharedTags.length >= 2) {
      related.push({ slug: claim.slug, title: claim.title });
    }

    // Find same category
    const sharedCategories = claim.categories.filter((c) =>
      currentClaim.categories.includes(c)
    );
    if (sharedCategories.length > 0) {
      sameCategory.push({ slug: claim.slug, title: claim.title });
    }

    // Find high value
    if (claim.scoreTotal && claim.scoreTotal >= 80) {
      highValue.push({ slug: claim.slug, title: claim.title });
    }
  }

  return {
    related: related.slice(0, 5),
    sameCategory: sameCategory.slice(0, 5),
    highValue: highValue.slice(0, 5),
  };
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
