// Angeion Group Claims Administrator Crawler
// Angeion has high-quality data with complete fields

import { fetchHTML, fetchSitemap, globalRateLimiter } from "../fetcher";
import { parseCaseListUrls, parseCaseDetail, ParsedCase } from "../parser";

const ANGEION_DOMAIN = "www.angeiongroup.com";
const ANGEION_BASE_URL = `https://${ANGEION_DOMAIN}`;

// URL patterns for settlement cases
const CASE_URL_PATTERNS = [
  /settlement/i,
  /claim/i,
  /case/i,
  /class-action/i,
];

/**
 * Crawl Angeion for settlement cases
 */
export async function crawlAngeion(): Promise<ParsedCase[]> {
  console.log("Starting Angeion crawl...");
  const cases: ParsedCase[] = [];

  try {
    // Strategy 1: Try sitemap first
    const sitemapUrls = await crawlAngeionSitemap();
    if (sitemapUrls.length > 0) {
      console.log(`Found ${sitemapUrls.length} URLs from Angeion sitemap`);
      for (const url of sitemapUrls.slice(0, 20)) {
        await globalRateLimiter.wait(ANGEION_DOMAIN);
        const caseData = await crawlAngeionCasePage(url);
        if (caseData) {
          cases.push(caseData);
        }
      }
    }

    // Strategy 2: Crawl known case listing pages
    if (cases.length === 0) {
      console.log("Falling back to Angeion case listing pages...");
      const listingUrls = [
        `${ANGEION_BASE_URL}/cases`,
        `${ANGEION_BASE_URL}/active-settlements`,
        `${ANGEION_BASE_URL}/settlements`,
      ];

      for (const listingUrl of listingUrls) {
        await globalRateLimiter.wait(ANGEION_DOMAIN);
        const caseUrls = await crawlAngeionListingPage(listingUrl);
        console.log(`Found ${caseUrls.length} case URLs from ${listingUrl}`);

        for (const caseUrl of caseUrls.slice(0, 10)) {
          await globalRateLimiter.wait(ANGEION_DOMAIN);
          const caseData = await crawlAngeionCasePage(caseUrl);
          if (caseData) {
            cases.push(caseData);
          }
        }
      }
    }

    console.log(`Angeion crawl complete: ${cases.length} cases found`);
    return cases;
  } catch (error) {
    console.error("Error crawling Angeion:", error);
    return cases;
  }
}

/**
 * Crawl Angeion sitemap for case URLs
 */
async function crawlAngeionSitemap(): Promise<string[]> {
  const sitemapUrls = [
    `${ANGEION_BASE_URL}/sitemap.xml`,
    `${ANGEION_BASE_URL}/sitemap_index.xml`,
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
 * Crawl Angeion listing page for case URLs
 */
async function crawlAngeionListingPage(listingUrl: string): Promise<string[]> {
  const result = await fetchHTML({ url: listingUrl });

  if (!result.success || !result.html) {
    return [];
  }

  return parseCaseListUrls(result.html, "angeion", CASE_URL_PATTERNS);
}

/**
 * Crawl individual Angeion case page
 */
async function crawlAngeionCasePage(url: string): Promise<ParsedCase | null> {
  const result = await fetchHTML({ url });

  if (!result.success || !result.html) {
    return null;
  }

  return parseCaseDetail(result.html, url, "angeion");
}
