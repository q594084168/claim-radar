import { NextRequest, NextResponse } from "next/server";
import {
  runAllCrawlers,
  runCrawler,
  convertToDatabaseFormat,
} from "@/lib/data-acquisition/orchestrator";

// In-memory cache for crawl results (in production, use database)
let crawlResults: any[] = [];
let lastCrawlTime = 0;
const CRAWL_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get("source");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check if we need to refresh
    const now = Date.now();
    if (
      !forceRefresh &&
      crawlResults.length > 0 &&
      now - lastCrawlTime < CRAWL_CACHE_DURATION
    ) {
      return NextResponse.json({
        success: true,
        data: crawlResults,
        cached: true,
        lastCrawlTime: new Date(lastCrawlTime).toISOString(),
      });
    }

    // Run crawlers
    let result;
    if (source) {
      // Run specific crawler
      const singleResult = await runCrawler(source);
      result = {
        results: [singleResult],
        totalCases: singleResult.cases.length,
        successfulSources: singleResult.success ? 1 : 0,
        failedSources: singleResult.success ? 0 : 1,
        completedAt: new Date(),
      };
    } else {
      // Run all crawlers
      result = await runAllCrawlers();
    }

    // Convert to database format
    const dbCases = result.results
      .filter((r) => r.success)
      .flatMap((r) => r.cases.map(convertToDatabaseFormat));

    // Update cache
    crawlResults = dbCases;
    lastCrawlTime = now;

    return NextResponse.json({
      success: true,
      data: dbCases,
      stats: {
        totalCases: result.totalCases,
        successfulSources: result.successfulSources,
        failedSources: result.failedSources,
        sources: result.results.map((r) => ({
          name: r.source,
          cases: r.cases.length,
          success: r.success,
          error: r.error,
        })),
      },
      cached: false,
      completedAt: result.completedAt.toISOString(),
    });
  } catch (error) {
    console.error("Crawl API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source } = body;

    if (source) {
      const result = await runCrawler(source);
      const dbCases = result.cases.map(convertToDatabaseFormat);

      return NextResponse.json({
        success: true,
        source,
        cases: dbCases,
        total: dbCases.length,
      });
    } else {
      const result = await runAllCrawlers();
      const dbCases = result.results
        .filter((r) => r.success)
        .flatMap((r) => r.cases.map(convertToDatabaseFormat));

      return NextResponse.json({
        success: true,
        cases: dbCases,
        total: dbCases.length,
        stats: {
          totalCases: result.totalCases,
          successfulSources: result.successfulSources,
          failedSources: result.failedSources,
        },
      });
    }
  } catch (error) {
    console.error("Crawl API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
