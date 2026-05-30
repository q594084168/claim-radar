// Parser Engine for extracting settlement case information from HTML

import * as cheerio from "cheerio";

export interface ParsedCase {
  title: string;
  url: string;
  description: string;
  deadline: string | null;
  payoutMin: number | null;
  payoutMax: number | null;
  eligibility: string[];
  paymentMethods: string[];
  status: string;
  source: string;
  rawHtml: string;
}

export interface ParsedCaseList {
  cases: ParsedCase[];
  totalFound: number;
  source: string;
  parsedAt: Date;
}

/**
 * Parse case list page and extract case URLs
 */
export function parseCaseListUrls(
  html: string,
  source: string,
  urlPatterns: RegExp[]
): string[] {
  const $ = cheerio.load(html);
  const urls: string[] = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const fullUrl = href.startsWith("http")
        ? href
        : `https://${source}.com${href}`;

      // Check if URL matches any of the patterns
      const matchesPattern = urlPatterns.some((pattern) =>
        pattern.test(fullUrl)
      );

      if (matchesPattern && !urls.includes(fullUrl)) {
        urls.push(fullUrl);
      }
    }
  });

  return urls;
}

/**
 * Parse case detail page and extract structured information
 */
export function parseCaseDetail(
  html: string,
  url: string,
  source: string
): ParsedCase {
  const $ = cheerio.load(html);

  // Extract title
  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Unknown Settlement";

  // Extract description (first few paragraphs)
  const description = extractDescription($);

  // Extract deadline
  const deadline = extractDeadline($);

  // Extract payout range
  const { min: payoutMin, max: payoutMax } = extractPayoutRange($);

  // Extract eligibility requirements
  const eligibility = extractEligibility($);

  // Extract payment methods
  const paymentMethods = extractPaymentMethods($);

  // Determine status
  const status = determineStatus($, deadline);

  return {
    title,
    url,
    description,
    deadline,
    payoutMin,
    payoutMax,
    eligibility,
    paymentMethods,
    status,
    source,
    rawHtml: html.slice(0, 5000), // Store first 5000 chars for reference
  };
}

/**
 * Extract description from page
 */
function extractDescription($: cheerio.CheerioAPI): string {
  // Try common selectors for description
  const selectors = [
    "meta[name='description']",
    "meta[property='og:description']",
    ".description",
    ".summary",
    ".overview",
    "p:first-of-type",
  ];

  for (const selector of selectors) {
    const content = $(selector).attr("content") || $(selector).text();
    if (content && content.length > 50) {
      return cleanText(content).slice(0, 500);
    }
  }

  // Fallback: get first 500 chars of body text
  return cleanText($("body").text()).slice(0, 500);
}

/**
 * Extract deadline from page
 */
function extractDeadline($: cheerio.CheerioAPI): string | null {
  const text = $("body").text();

  // Common deadline patterns
  const patterns = [
    /deadline[:\s]+(\w+\s+\d{1,2},?\s+\d{4})/i,
    /claim\s+deadline[:\s]+(\w+\s+\d{1,2},?\s+\d{4})/i,
    /submit\s+by[:\s]+(\w+\s+\d{1,2},?\s+\d{4})/i,
    /last\s+day[:\s]+(\w+\s+\d{1,2},?\s+\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract payout range from page
 */
function extractPayoutRange($: cheerio.CheerioAPI): {
  min: number | null;
  max: number | null;
} {
  const text = $("body").text();

  // Common payout patterns
  const patterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:to|-)\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    /up\s+to\s+\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /estimated[:\s]+\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /payout[:\s]+\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];

  // Try range pattern first
  const rangeMatch = text.match(patterns[0]);
  if (rangeMatch) {
    return {
      min: parseNumber(rangeMatch[1]),
      max: parseNumber(rangeMatch[2]),
    };
  }

  // Try single value patterns
  for (let i = 1; i < patterns.length; i++) {
    const match = text.match(patterns[i]);
    if (match) {
      const value = parseNumber(match[1]);
      return { min: value, max: value };
    }
  }

  return { min: null, max: null };
}

/**
 * Extract eligibility requirements from page
 */
function extractEligibility($: cheerio.CheerioAPI): string[] {
  const eligibility: string[] = [];
  const text = $("body").text().toLowerCase();

  // Common eligibility patterns
  const patterns = [
    { pattern: /must\s+have\s+been\s+a\s+([^.]+)/gi, group: 1 },
    { pattern: /eligible\s+if\s+you\s+([^.]+)/gi, group: 1 },
    { pattern: /you\s+may\s+qualify\s+if\s+([^.]+)/gi, group: 1 },
  ];

  for (const { pattern, group } of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const requirement = cleanText(match[group]);
      if (requirement.length > 10 && requirement.length < 200) {
        eligibility.push(requirement);
      }
    }
  }

  return [...new Set(eligibility)].slice(0, 10); // Deduplicate and limit
}

/**
 * Extract payment methods from page
 */
function extractPaymentMethods($: cheerio.CheerioAPI): string[] {
  const text = $("body").text().toLowerCase();
  const methods: string[] = [];

  if (text.includes("paypal")) methods.push("PayPal");
  if (text.includes("check") || text.includes("cheque")) methods.push("Check");
  if (text.includes("bank transfer") || text.includes("direct deposit"))
    methods.push("Bank Transfer");
  if (text.includes("venmo")) methods.push("Venmo");
  if (text.includes("zelle")) methods.push("Zelle");
  if (text.includes("eft") || text.includes("electronic fund"))
    methods.push("EFT");

  return methods.length > 0 ? methods : ["Check"]; // Default to Check
}

/**
 * Determine settlement status
 */
function determineStatus(
  $: cheerio.CheerioAPI,
  deadline: string | null
): string {
  const text = $("body").text().toLowerCase();

  if (text.includes("closed") || text.includes("expired")) {
    return "closed";
  }

  if (text.includes("pending") || text.includes("upcoming")) {
    return "pending";
  }

  if (deadline) {
    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date()) {
      return "expired";
    }
  }

  return "active";
}

/**
 * Parse number from string (remove commas)
 */
function parseNumber(str: string): number {
  return parseInt(str.replace(/,/g, ""), 10);
}

/**
 * Clean text (remove extra whitespace, HTML entities, etc.)
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}
