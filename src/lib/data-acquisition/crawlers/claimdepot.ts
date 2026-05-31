// ClaimDepot Crawler
// ClaimDepot has 2341 settlement pages with structured data

import { fetchHTML, globalRateLimiter } from "../fetcher";
import { ParsedCase } from "../parser";

const CLAIMDEPOT_DOMAIN = "www.claimdepot.com";
const CLAIMDEPOT_BASE_URL = `https://${CLAIMDEPOT_DOMAIN}`;

/**
 * Crawl ClaimDepot for settlement cases
 */
export async function crawlClaimDepot(): Promise<ParsedCase[]> {
  console.log("Starting ClaimDepot crawl...");
  const cases: ParsedCase[] = [];

  try {
    // Step 1: Get settlement URLs from sitemap (all 2301 URLs)
    const settlementUrls = await getSettlementUrlsFromSitemap();
    console.log(`Found ${settlementUrls.length} settlement URLs from ClaimDepot sitemap`);

    // Step 2: Crawl settlement pages (limit to 100 for speed, can be increased)
    const urlsToCrawl = settlementUrls.slice(0, 100);
    console.log(`Crawling ${urlsToCrawl.length} settlement pages...`);

    for (const url of urlsToCrawl) {
      await globalRateLimiter.wait(CLAIMDEPOT_DOMAIN);
      const caseData = await crawlSettlementPage(url);
      if (caseData) {
        cases.push(caseData);
      }
    }

    console.log(`ClaimDepot crawl complete: ${cases.length} cases found`);
    return cases;
  } catch (error) {
    console.error("Error crawling ClaimDepot:", error);
    return cases;
  }
}

/**
 * Get settlement URLs from sitemap
 */
async function getSettlementUrlsFromSitemap(): Promise<string[]> {
  try {
    const response = await fetch("https://www.claimdepot.com/sitemap.xml");
    const xml = await response.text();

    // Extract settlement URLs from sitemap
    const urlRegex = /https:\/\/www\.claimdepot\.com\/settlements\/[^<]+/g;
    const urls: string[] = [];
    let match;

    while ((match = urlRegex.exec(xml)) !== null) {
      urls.push(match[0]);
    }

    return urls;
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return [];
  }
}

/**
 * Get settlement URLs from the main settlements page
 */
async function getSettlementUrls(): Promise<string[]> {
  const result = await fetchHTML({ url: `${CLAIMDEPOT_BASE_URL}/settlements` });

  if (!result.success || !result.html) {
    return [];
  }

  const urls: string[] = [];
  const urlRegex = /href="(\/settlements\/[^"]+)"/g;
  let match;

  while ((match = urlRegex.exec(result.html)) !== null) {
    const fullUrl = `${CLAIMDEPOT_BASE_URL}${match[1]}`;
    if (!urls.includes(fullUrl)) {
      urls.push(fullUrl);
    }
  }

  return urls;
}

/**
 * Crawl individual settlement page
 */
async function crawlSettlementPage(url: string): Promise<ParsedCase | null> {
  const result = await fetchHTML({ url });

  if (!result.success || !result.html) {
    return null;
  }

  return parseClaimDepotPage(result.html, url);
}

/**
 * Parse ClaimDepot settlement page
 */
function parseClaimDepotPage(html: string, url: string): ParsedCase {
  // Extract title
  const titleMatch = html.match(/<h1[^>]*class="news-main-title"[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : "Unknown Settlement";

  // Extract description
  const descMatch = html.match(/class="hm-text">([^<]+)/);
  const description = descMatch ? descMatch[1].trim() : "";

  // Extract settlement amount
  const amountMatch = html.match(/Settlement Amount[^<]*<[^>]*>[^<]*<[^>]*>([^<]+)/);
  const settlementAmount = amountMatch ? amountMatch[1].trim() : "";

  // Extract estimated payout
  const payoutMatch = html.match(/Estimated Payout per person[^<]*<[^>]*>[^<]*<[^>]*>([^<]+)/);
  const estimatedPayout = payoutMatch ? payoutMatch[1].trim() : "";

  // Extract proof required
  const proofMatch = html.match(/Is Proof Required\?[^<]*<[^>]*>[^<]*<[^>]*>([^<]+)/);
  const proofRequired = proofMatch ? proofMatch[1].trim().toLowerCase() : "";

  // Extract deadline
  const deadlineMatch = html.match(/Claim Deadline[^<]*<[^>]*>[^<]*<[^>]*>([^<]+)/);
  const deadline = deadlineMatch ? deadlineMatch[1].trim() : "";

  // Extract status
  const statusMatch = html.match(/class="case-title-data summary-status">([^<]+)/);
  const status = statusMatch ? statusMatch[1].trim() : "";

  // Extract settlement website
  const websiteMatch = html.match(/Settlement Website[^<]*<[^>]*>[^<]*<[^>]*>[^<]*<a[^>]*href="([^"]+)"/);
  const settlementWebsite = websiteMatch ? websiteMatch[1] : url;

  // Parse payout values
  const payoutMin = extractPayoutValue(estimatedPayout, "min");
  const payoutMax = extractPayoutValue(estimatedPayout, "max");

  // Determine category
  let category = "class-action";
  const titleLower = title.toLowerCase();
  if (titleLower.includes("data breach") || titleLower.includes("privacy")) {
    category = "data-breach";
  } else if (titleLower.includes("consumer") || titleLower.includes("refund")) {
    category = "consumer-settlement";
  }

  return {
    title,
    url,
    description: description.slice(0, 500),
    deadline: deadline || null,
    payoutMin,
    payoutMax,
    eligibility: [],
    paymentMethods: ["Check"], // Default
    status: status.toLowerCase().includes("open") ? "active" : "closed",
    source: "ClaimDepot",
    rawHtml: html.slice(0, 5000),
  };
}

/**
 * Extract payout value from string
 */
function extractPayoutValue(payoutStr: string, type: "min" | "max"): number | null {
  if (!payoutStr) return null;

  // Remove $ and commas
  const cleanStr = payoutStr.replace(/[$,]/g, "");

  // Try to find numbers
  const numbers = cleanStr.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;

  if (type === "min") {
    return parseInt(numbers[0]);
  } else {
    return numbers.length > 1 ? parseInt(numbers[numbers.length - 1]) : parseInt(numbers[0]);
  }
}
