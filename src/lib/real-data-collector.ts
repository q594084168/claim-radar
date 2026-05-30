// Real Data Collection System for ClaimRadar
// Fetches real settlement data from RSS feeds and official sources

export interface RealClaim {
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
  sourceUrl: string;
  publishedAt: string;
  status: string;
}

// RSS Feed Sources
const RSS_SOURCES = [
  {
    name: "TopClassActions",
    url: "https://topclassactions.com/feed/",
    type: "rss",
  },
  {
    name: "ClassAction.org",
    url: "https://www.classaction.org/news/feed",
    type: "rss",
  },
];

/**
 * Fetch and parse RSS feed
 */
export async function fetchRSSFeed(url: string): Promise<any[]> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ClaimRadar/1.0 (Settlement Discovery Bot)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();
    return parseRSSXML(xml);
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, error);
    return [];
  }
}

/**
 * Parse RSS XML to extract items
 */
function parseRSSXML(xml: string): any[] {
  const items: any[] = [];

  // Simple XML parsing for RSS items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXML = match[1];

    const title = extractTag(itemXML, "title");
    const link = extractTag(itemXML, "link");
    const description = extractTag(itemXML, "description");
    const pubDate = extractTag(itemXML, "pubDate");
    const category = extractTag(itemXML, "category");

    if (title && link) {
      items.push({
        title: cleanHTML(title),
        link,
        description: cleanHTML(description || ""),
        pubDate,
        category: category || "",
      });
    }
  }

  return items;
}

/**
 * Extract content from XML tag
 */
function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, "s");
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Clean HTML tags from text
 */
function cleanHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
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
 * Extract settlement information from title and description
 */
function extractSettlementInfo(item: any): Partial<RealClaim> {
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();

  // Determine country
  let country = "US";
  if (title.includes("canada") || title.includes("canadian") || desc.includes("canada")) {
    country = "CA";
  } else if (title.includes("australia") || title.includes("australian")) {
    country = "AU";
  }

  // Determine category
  let category = "class-action";
  if (title.includes("data breach") || title.includes("privacy") || desc.includes("data breach")) {
    category = "data-breach";
  } else if (title.includes("consumer") || title.includes("refund") || desc.includes("consumer")) {
    category = "consumer-settlement";
  }

  // Extract estimated payout (basic pattern matching)
  let estimatedMin: number | null = null;
  let estimatedMax: number | null = null;

  const payoutMatch = desc.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:to|-)\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (payoutMatch) {
    estimatedMin = parseInt(payoutMatch[1].replace(/,/g, ""));
    estimatedMax = parseInt(payoutMatch[2].replace(/,/g, ""));
  } else {
    const singlePayoutMatch = desc.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (singlePayoutMatch) {
      estimatedMin = parseInt(singlePayoutMatch[1].replace(/,/g, ""));
      estimatedMax = estimatedMin;
    }
  }

  // Check for receipt requirements
  const needReceipt = desc.includes("receipt") || desc.includes("proof of purchase");

  // Check for payment methods
  const payPaypal = desc.includes("paypal");
  const payCheck = desc.includes("check") || desc.includes("cheque");
  const payBank = desc.includes("bank transfer") || desc.includes("direct deposit");

  return {
    country,
    category,
    estimatedMin,
    estimatedMax,
    needReceipt,
    payPaypal,
    payCheck,
    payBank,
  };
}

/**
 * Collect real data from all sources
 */
export async function collectRealData(): Promise<RealClaim[]> {
  const allClaims: RealClaim[] = [];

  for (const source of RSS_SOURCES) {
    console.log(`Fetching from ${source.name}...`);
    const items = await fetchRSSFeed(source.url);

    for (const item of items) {
      const info = extractSettlementInfo(item);

      const claim: RealClaim = {
        id: generateSlug(item.title),
        slug: generateSlug(item.title),
        title: item.title,
        description: item.description.slice(0, 500),
        country: info.country || "US",
        category: info.category || "class-action",
        deadline: null, // Would need AI extraction
        estimatedMin: info.estimatedMin ?? null,
        estimatedMax: info.estimatedMax ?? null,
        needReceipt: info.needReceipt || false,
        payPaypal: info.payPaypal || false,
        payCheck: info.payCheck || false,
        payBank: info.payBank || false,
        officialUrl: item.link,
        sourceName: source.name,
        sourceUrl: item.link,
        publishedAt: item.pubDate || new Date().toISOString(),
        status: "active",
      };

      allClaims.push(claim);
    }
  }

  return allClaims;
}

/**
 * Get claims by country
 */
export function getClaimsByCountry(claims: RealClaim[], country: string): RealClaim[] {
  return claims.filter((c) => c.country === country);
}

/**
 * Get claims by category
 */
export function getClaimsByCategory(claims: RealClaim[], category: string): RealClaim[] {
  return claims.filter((c) => c.category === category);
}

/**
 * Get claims that don't require receipts
 */
export function getNoReceiptClaims(claims: RealClaim[]): RealClaim[] {
  return claims.filter((c) => !c.needReceipt);
}

/**
 * Get claims with PayPal payment
 */
export function getPaypalClaims(claims: RealClaim[]): RealClaim[] {
  return claims.filter((c) => c.payPaypal);
}
