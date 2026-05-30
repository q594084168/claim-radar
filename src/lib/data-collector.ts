import * as cheerio from "cheerio";

export interface CollectedPage {
  url: string;
  title: string;
  content: string;
  html: string;
}

/**
 * Fetch a page and extract text content
 */
export async function fetchAndExtract(url: string): Promise<CollectedPage> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ClaimRadar/1.0; +https://claimradar.com)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove script, style, nav, footer, ads
  $(
    "script, style, nav, footer, header, .ad, .advertisement, .sidebar"
  ).remove();

  // Extract main content
  const title = $("title").text().trim() || $("h1").first().text().trim();
  const content = $("body").text().replace(/\s+/g, " ").trim();

  return { url, title, content, html };
}

/**
 * Parse sitemap and return URLs
 */
export async function parseSitemap(sitemapUrl: string): Promise<string[]> {
  const response = await fetch(sitemapUrl);
  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const urls: string[] = [];
  $("url > loc").each((_, el) => {
    urls.push($(el).text());
  });

  return urls;
}

/**
 * Parse RSS feed and return items
 */
export async function parseRSS(
  rssUrl: string
): Promise<Array<{ title: string; link: string; pubDate: string }>> {
  const response = await fetch(rssUrl);
  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const items: Array<{ title: string; link: string; pubDate: string }> = [];

  $("item").each((_, el) => {
    items.push({
      title: $(el).find("title").text(),
      link: $(el).find("link").text(),
      pubDate: $(el).find("pubDate").text(),
    });
  });

  return items;
}

/**
 * Generate claim slug from title
 */
export function generateClaimSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Source configurations for data collection
 */
export const DATA_SOURCES = {
  // Level 1: Official settlement administrators
  official: [
    {
      name: "Epiq",
      url: "https://www.epiqglobal.com/en/settlements",
      type: "page" as const,
    },
    {
      name: "Kroll",
      url: "https://www.krollsettlementadministration.com",
      type: "page" as const,
    },
  ],

  // Level 2: Aggregation sites
  aggregators: [
    {
      name: "TopClassActions",
      rss: "https://topclassactions.com/feed/",
      type: "rss" as const,
    },
    {
      name: "ClassAction.org",
      rss: "https://www.classaction.org/news/feed",
      type: "rss" as const,
    },
  ],

  // Level 3: News sources
  news: [
    {
      name: "Google News - Class Action",
      url: "https://news.google.com/rss/search?q=class+action+settlement",
      type: "rss" as const,
    },
  ],
};
