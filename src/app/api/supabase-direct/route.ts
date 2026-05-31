import { NextRequest, NextResponse } from "next/server";

// Supabase configuration
const SUPABASE_URL = "https://vqvearbuktkdkfwsocjk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdmVhcmJ1a3RrZGtmd3NvY2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNzcxMjgsImV4cCI6MjA5NTc1MzEyOH0.kanxAc_bJpWB-7wU-45X__AGtJIjYkmYHa3nbElfGG4";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statsOnly = searchParams.get("stats") === "true";
    const limit = parseInt(searchParams.get("limit") || "100");

    // Fetch from Supabase
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/claims?select=*&order=score_total.desc&limit=${limit}`,
      {
        headers: {
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "apikey": SUPABASE_ANON_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();

    // Transform data
    const claims = data.map((claim: any) => ({
      id: claim.id,
      slug: claim.slug,
      title: claim.title,
      description: claim.description,
      country: claim.country,
      category: claim.category,
      deadline: claim.deadline,
      estimatedMin: claim.estimated_min,
      estimatedMax: claim.estimated_max,
      needReceipt: claim.need_receipt,
      payPaypal: claim.pay_paypal,
      payCheck: claim.pay_check,
      payBank: claim.pay_bank,
      officialUrl: claim.official_url,
      sourceName: claim.source_name,
      status: claim.status,
      score: {
        total: claim.score_total,
      },
    }));

    // Return stats only
    if (statsOnly) {
      const stats = {
        total: claims.length,
        byCountry: claims.reduce((acc: any, c: any) => {
          acc[c.country] = (acc[c.country] || 0) + 1;
          return acc;
        }, {}),
        byCategory: claims.reduce((acc: any, c: any) => {
          acc[c.category] = (acc[c.category] || 0) + 1;
          return acc;
        }, {}),
        noReceiptCount: claims.filter((c: any) => !c.needReceipt).length,
        highValueCount: claims.filter((c: any) => (c.estimatedMax || 0) >= 500).length,
        avgScore: claims.length > 0
          ? Math.round(claims.reduce((sum: number, c: any) => sum + (c.score?.total || 0), 0) / claims.length)
          : 0,
      };

      return NextResponse.json({
        success: true,
        stats,
        source: "supabase",
      });
    }

    return NextResponse.json({
      success: true,
      claims,
      total: claims.length,
      source: "supabase",
    });
  } catch (error) {
    console.error("Supabase API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load data" },
      { status: 500 }
    );
  }
}
