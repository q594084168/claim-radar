// Epiq Claims Administrator Crawler
// Epiq is one of the largest claims administrators with structured data

import { fetchHTML, fetchSitemap, globalRateLimiter } from "../fetcher";
import { parseCaseListUrls, parseCaseDetail, ParsedCase } from "../parser";

const EPIQ_DOMAIN = "www.epiqglobal.com";
const EPIQ_BASE_URL = `https://${EPIQ_DOMAIN}`;

// URL patterns for settlement cases
const CASE_URL_PATTERNS = [
  /settlement/i,
  /claim/i,
  /case/i,
  /class-action/i,
];

/**
 * Crawl Epiq for settlement cases
 */
export async function crawlEpiq(): Promise<ParsedCase[]> {
  console.log("Starting Epiq crawl...");
  const cases: ParsedCase[] = [];

  try {
    // Strategy 1: Try sitemap first
    const sitemapUrls = await crawlEpiqSitemap();
    if (sitemapUrls.length > 0) {
      console.log(`Found ${sitemapUrls.length} URLs from Epiq sitemap`);
      for (const url of sitemapUrls.slice(0, 20)) { // Limit to 20 for V1
        await globalRateLimiter.wait(EPIQ_DOMAIN);
        const caseData = await crawlEpiqCasePage(url);
        if (caseData) {
          cases.push(caseData);
        }
      }
    }

    // Strategy 2: Crawl known case listing pages
    if (cases.length === 0) {
      console.log("Falling back to Epiq case listing pages...");
      const listingUrls = [
        `${EPIQ_BASE_URL}/settlements`,
        `${EPIQ_BASE_URL}/claims-administration`,
        `${EPIQ_BASE_URL}/class-action-settlements`,
      ];

      for (const listingUrl of listingUrls) {
        await globalRateLimiter.wait(EPIQ_DOMAIN);
        const caseUrls = await crawlEpiqListingPage(listingUrl);
        console.log(`Found ${caseUrls.length} case URLs from ${listingUrl}`);

        for (const caseUrl of caseUrls.slice(0, 10)) {
          await globalRateLimiter.wait(EPIQ_DOMAIN);
          const caseData = await crawlEpiqCasePage(caseUrl);
          if (caseData) {
            cases.push(caseData);
          }
        }
      }
    }

    console.log(`Epiq crawl complete: ${cases.length} cases found`);
    return cases;
  } catch (error) {
    console.error("Error crawling Epiq:", error);
    return cases;
  }
}

/**
 * Crawl Epiq sitemap for case URLs
 */
async function crawlEpiqSitemap(): Promise<string[]> {
  const sitemapUrls = [
    `${EPIQ_BASE_URL}/sitemap.xml`,
    `${EPIQ_BASE_URL}/sitemap_index.xml`,
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
 * Crawl Epiq listing page for case URLs
 */
async function crawlEpiqListingPage(listingUrl: string): Promise<string[]> {
  const result = await fetchHTML({ url: listingUrl });

  if (!result.success || !result.html) {
    return [];
  }

  return parseCaseListUrls(result.html, "epiq", CASE_URL_PATTERNS);
}

/**
 * Crawl individual Epiq case page
 */
async function crawlEpiqCasePage(url: string): Promise<ParsedCase | null> {
  const result = await fetchHTML({ url });

  if (!result.success || !result.html) {
    return null;
  }

  return parseCaseDetail(result.html, url, "epiq");
}
