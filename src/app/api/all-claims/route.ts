import { NextRequest, NextResponse } from "next/server";
import { collectRealData } from "@/lib/real-data-collector";
import { runAllCrawlers, convertToDatabaseFormat } from "@/lib/data-acquisition/orchestrator";

// Cache for combined data
let cachedData: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const noReceipt = searchParams.get("noReceipt");
    const paypal = searchParams.get("paypal");
    const source = searchParams.get("source");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check if we need to refresh data
    const now = Date.now();
    if (!cachedData || forceRefresh || (now - lastFetchTime) > CACHE_DURATION) {
      console.log("Fetching data from all sources...");

      // Fetch from RSS sources (TopClassActions, etc.)
      const rssData = await collectRealData();
      console.log(`RSS sources: ${rssData.length} claims`);

      // Fetch from Claims Administrators (Epiq, Kroll, Angeion, JND)
      let adminData: any[] = [];
      try {
        const crawlResult = await runAllCrawlers();
        adminData = crawlResult.results
          .filter((r) => r.success)
          .flatMap((r) => r.cases.map(convertToDatabaseFormat));
        console.log(`Claims Administrators: ${adminData.length} claims`);
      } catch (error) {
        console.error("Error crawling Claims Administrators:", error);
      }

      // Combine all data
      cachedData = [...rssData, ...adminData];
      lastFetchTime = now;
      console.log(`Total combined data: ${cachedData.length} claims`);
    }

    let filteredClaims = [...cachedData];

    // Apply filters
    if (country) {
      filteredClaims = filteredClaims.filter(
        (c) => c.country?.toLowerCase() === country.toLowerCase()
      );
    }

    if (category) {
      filteredClaims = filteredClaims.filter(
        (c) => c.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (noReceipt === "true") {
      filteredClaims = filteredClaims.filter((c) => !c.needReceipt);
    }

    if (paypal === "true") {
      filteredClaims = filteredClaims.filter((c) => c.payPaypal);
    }

    if (source) {
      filteredClaims = filteredClaims.filter(
        (c) => c.sourceName?.toLowerCase().includes(source.toLowerCase())
      );
    }

    // Apply pagination
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const total = filteredClaims.length;
    const paginatedClaims = filteredClaims.slice(offset, offset + limit);

    // Calculate statistics
    const stats = {
      total: cachedData.length,
      bySource: {} as Record<string, number>,
      byCountry: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    cachedData.forEach((claim) => {
      // Count by source
      const source = claim.sourceName || "Unknown";
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;

      // Count by country
      const country = claim.country || "Unknown";
      stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;

      // Count by category
      const category = claim.category || "Unknown";
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    return NextResponse.json({
      claims: paginatedClaims,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      stats,
      meta: {
        lastUpdated: new Date(lastFetchTime).toISOString(),
        cacheExpiry: new Date(lastFetchTime + CACHE_DURATION).toISOString(),
        sources: ["TopClassActions", "Epiq", "Kroll", "Angeion", "JND"],
      },
    });
  } catch (error) {
    console.error("Error in all-claims API:", error);
    return NextResponse.json(
      { error: "Failed to fetch claims data" },
      { status: 500 }
    );
  }
}
