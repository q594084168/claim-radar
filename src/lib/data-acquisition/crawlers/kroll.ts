// Kroll Claims Administrator Crawler
// Kroll is a major claims administrator with frequent updates

import { fetchHTML, fetchSitemap, globalRateLimiter } from "../fetcher";
import { parseCaseListUrls, parseCaseDetail, ParsedCase } from "../parser";

const KROLL_DOMAIN = "www.krollsettlementadministration.com";
const KROLL_BASE_URL = `https://${KROLL_DOMAIN}`;

// URL patterns for settlement cases
const CASE_URL_PATTERNS = [
  /settlement/i,
  /claim/i,
  /case/i,
  /class-action/i,
];

/**
 * Crawl Kroll for settlement cases
 */
export async function crawlKroll(): Promise<ParsedCase[]> {
  console.log("Starting Kroll crawl...");
  const cases: ParsedCase[] = [];

  try {
    // Strategy 1: Try sitemap first
    const sitemapUrls = await crawlKrollSitemap();
    if (sitemapUrls.length > 0) {
      console.log(`Found ${sitemapUrls.length} URLs from Kroll sitemap`);
      for (const url of sitemapUrls.slice(0, 20)) {
        await globalRateLimiter.wait(KROLL_DOMAIN);
        const caseData = await crawlKrollCasePage(url);
        if (caseData) {
          cases.push(caseData);
        }
      }
    }

    // Strategy 2: Crawl known case listing pages
    if (cases.length === 0) {
      console.log("Falling back to Kroll case listing pages...");
      const listingUrls = [
        `${KROLL_BASE_URL}/cases`,
        `${KROLL_BASE_URL}/settlements`,
        `${KROLL_BASE_URL}/active-cases`,
      ];

      for (const listingUrl of listingUrls) {
        await globalRateLimiter.wait(KROLL_DOMAIN);
        const caseUrls = await crawlKrollListingPage(listingUrl);
        console.log(`Found ${caseUrls.length} case URLs from ${listingUrl}`);

        for (const caseUrl of caseUrls.slice(0, 10)) {
          await globalRateLimiter.wait(KROLL_DOMAIN);
          const caseData = await crawlKrollCasePage(caseUrl);
          if (caseData) {
            cases.push(caseData);
          }
        }
      }
    }

    console.log(`Kroll crawl complete: ${cases.length} cases found`);
    return cases;
  } catch (error) {
    console.error("Error crawling Kroll:", error);
    return cases;
  }
}

/**
 * Crawl Kroll sitemap for case URLs
 */
async function crawlKrollSitemap(): Promise<string[]> {
  const sitemapUrls = [
    `${KROLL_BASE_URL}/sitemap.xml`,
    `${KROLL_BASE_URL}/sitemap_index.xml`,
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
 * Crawl Kroll listing page for case URLs
 */
async function crawlKrollListingPage(listingUrl: string): Promise<string[]> {
  const result = await fetchHTML({ url: listingUrl });

  if (!result.success || !result.html) {
    return [];
  }

  return parseCaseListUrls(result.html, "kroll", CASE_URL_PATTERNS);
}

/**
 * Crawl individual Kroll case page
 */
async function crawlKrollCasePage(url: string): Promise<ParsedCase | null> {
  const result = await fetchHTML({ url });

  if (!result.success || !result.html) {
    return null;
  }

  return parseCaseDetail(result.html, url, "kroll");
}
