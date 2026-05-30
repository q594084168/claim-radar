// JND Legal Administration Crawler
// JND has highly structured data, perfect for automated extraction

import { fetchHTML, fetchSitemap, globalRateLimiter } from "../fetcher";
import { parseCaseListUrls, parseCaseDetail, ParsedCase } from "../parser";

const JND_DOMAIN = "www.jndla.com";
const JND_BASE_URL = `https://${JND_DOMAIN}`;

// URL patterns for settlement cases
const CASE_URL_PATTERNS = [
  /settlement/i,
  /claim/i,
  /case/i,
  /class-action/i,
];

/**
 * Crawl JND for settlement cases
 */
export async function crawlJND(): Promise<ParsedCase[]> {
  console.log("Starting JND crawl...");
  const cases: ParsedCase[] = [];

  try {
    // Strategy 1: Try sitemap first
    const sitemapUrls = await crawlJNDSitemap();
    if (sitemapUrls.length > 0) {
      console.log(`Found ${sitemapUrls.length} URLs from JND sitemap`);
      for (const url of sitemapUrls.slice(0, 20)) {
        await globalRateLimiter.wait(JND_DOMAIN);
        const caseData = await crawlJNDCasePage(url);
        if (caseData) {
          cases.push(caseData);
        }
      }
    }

    // Strategy 2: Crawl known case listing pages
    if (cases.length === 0) {
      console.log("Falling back to JND case listing pages...");
      const listingUrls = [
        `${JND_BASE_URL}/cases`,
        `${JND_BASE_URL}/open-settlements`,
        `${JND_BASE_URL}/settlements`,
      ];

      for (const listingUrl of listingUrls) {
        await globalRateLimiter.wait(JND_DOMAIN);
        const caseUrls = await crawlJNDListingPage(listingUrl);
        console.log(`Found ${caseUrls.length} case URLs from ${listingUrl}`);

        for (const caseUrl of caseUrls.slice(0, 10)) {
          await globalRateLimiter.wait(JND_DOMAIN);
          const caseData = await crawlJNDCasePage(caseUrl);
          if (caseData) {
            cases.push(caseData);
          }
        }
      }
    }

    console.log(`JND crawl complete: ${cases.length} cases found`);
    return cases;
  } catch (error) {
    console.error("Error crawling JND:", error);
    return cases;
  }
}

/**
 * Crawl JND sitemap for case URLs
 */
async function crawlJNDSitemap(): Promise<string[]> {
  const sitemapUrls = [
    `${JND_BASE_URL}/sitemap.xml`,
    `${JND_BASE_URL}/sitemap_index.xml`,
  ];

  for (const sitemapUrl of sitemapUrls) {
    const urls = await fetchSitemap(sitemapUrl);
    if (urls.length > 0) {
      return urls.filter((url) =>
        CASE_URL_PATTERNS.some((pattern) => pattern.test(url))
      );
    }
  }

  return [];
}

/**
 * Crawl JND listing page for case URLs
 */
async function crawlJNDListingPage(listingUrl: string): Promise<string[]> {
  const result = await fetchHTML({ url: listingUrl });

  if (!result.success || !result.html) {
    return [];
  }

  return parseCaseListUrls(result.html, "jnd", CASE_URL_PATTERNS);
}

/**
 * Crawl individual JND case page
 */
async function crawlJNDCasePage(url: string): Promise<ParsedCase | null> {
  const result = await fetchHTML({ url });

  if (!result.success || !result.html) {
    return null;
  }

  return parseCaseDetail(result.html, url, "jnd");
}
