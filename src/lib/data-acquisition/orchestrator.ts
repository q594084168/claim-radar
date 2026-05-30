// Data Acquisition Orchestrator
// Coordinates all Claims Administrator crawlers

import { crawlEpiq } from "./crawlers/epiq";
import { crawlKroll } from "./crawlers/kroll";
import { crawlAngeion } from "./crawlers/angeion";
import { crawlJND } from "./crawlers/jnd";
import { crawlClaimDepot } from "./crawlers/claimdepot";
import { ParsedCase } from "./parser";

export interface CrawlResult {
  source: string;
  cases: ParsedCase[];
  success: boolean;
  error: string | null;
  crawledAt: Date;
}

export interface OrchestratorResult {
  results: CrawlResult[];
  totalCases: number;
  successfulSources: number;
  failedSources: number;
  completedAt: Date;
}

/**
 * Run all crawlers and collect results
 */
export async function runAllCrawlers(): Promise<OrchestratorResult> {
  console.log("Starting data acquisition from all Claims Administrators...");

  const results: CrawlResult[] = [];
  const crawlers = [
    { name: "Epiq", crawl: crawlEpiq },
    { name: "Kroll", crawl: crawlKroll },
    { name: "Angeion", crawl: crawlAngeion },
    { name: "JND", crawl: crawlJND },
    { name: "ClaimDepot", crawl: crawlClaimDepot },
  ];

  // Run crawlers sequentially to avoid overwhelming servers
  for (const crawler of crawlers) {
    console.log(`\nRunning ${crawler.name} crawler...`);
    try {
      const cases = await crawler.crawl();
      results.push({
        source: crawler.name,
        cases,
        success: true,
        error: null,
        crawledAt: new Date(),
      });
      console.log(`${crawler.name}: ${cases.length} cases found`);
    } catch (error) {
      console.error(`${crawler.name} failed:`, error);
      results.push({
        source: crawler.name,
        cases: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        crawledAt: new Date(),
      });
    }
  }

  // Calculate statistics
  const totalCases = results.reduce((sum, r) => sum + r.cases.length, 0);
  const successfulSources = results.filter((r) => r.success).length;
  const failedSources = results.filter((r) => !r.success).length;

  console.log(`\n=== Data Acquisition Complete ===`);
  console.log(`Total cases found: ${totalCases}`);
  console.log(`Successful sources: ${successfulSources}`);
  console.log(`Failed sources: ${failedSources}`);

  return {
    results,
    totalCases,
    successfulSources,
    failedSources,
    completedAt: new Date(),
  };
}

/**
 * Run a specific crawler by name
 */
export async function runCrawler(
  source: string
): Promise<CrawlResult> {
  const crawlers: Record<string, () => Promise<ParsedCase[]>> = {
    epiq: crawlEpiq,
    kroll: crawlKroll,
    angeion: crawlAngeion,
    jnd: crawlJND,
    claimdepot: crawlClaimDepot,
  };

  const crawl = crawlers[source.toLowerCase()];

  if (!crawl) {
    return {
      source,
      cases: [],
      success: false,
      error: `Unknown source: ${source}`,
      crawledAt: new Date(),
    };
  }

  try {
    const cases = await crawl();
    return {
      source,
      cases,
      success: true,
      error: null,
      crawledAt: new Date(),
    };
  } catch (error) {
    return {
      source,
      cases: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      crawledAt: new Date(),
    };
  }
}

/**
 * Convert ParsedCase to database format
 */
export function convertToDatabaseFormat(parsedCase: ParsedCase): any {
  // Generate slug from title
  const slug = parsedCase.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

  // Determine country from title/description
  let country = "US";
  const text = `${parsedCase.title} ${parsedCase.description}`.toLowerCase();
  if (text.includes("canada") || text.includes("canadian")) {
    country = "CA";
  } else if (text.includes("australia") || text.includes("australian")) {
    country = "AU";
  }

  // Determine category
  let category = "class-action";
  if (text.includes("data breach") || text.includes("privacy")) {
    category = "data-breach";
  } else if (text.includes("consumer") || text.includes("refund")) {
    category = "consumer-settlement";
  }

  return {
    slug,
    title: parsedCase.title,
    description: parsedCase.description,
    country,
    category,
    sourceUrl: parsedCase.url,
    sourceName: parsedCase.source,
    officialUrl: parsedCase.url,
    deadline: parsedCase.deadline ? new Date(parsedCase.deadline) : null,
    estimatedMin: parsedCase.payoutMin,
    estimatedMax: parsedCase.payoutMax,
    needReceipt: parsedCase.eligibility.some(
      (e) => e.toLowerCase().includes("receipt") || e.toLowerCase().includes("proof")
    ),
    payPaypal: parsedCase.paymentMethods.includes("PayPal"),
    payCheck: parsedCase.paymentMethods.includes("Check"),
    payBank: parsedCase.paymentMethods.includes("Bank Transfer"),
    status: parsedCase.status,
    isVerified: false,
    aiSummary: parsedCase.description.slice(0, 500),
    aiExtractedAt: new Date(),
    rawContent: parsedCase.rawHtml,
  };
}
