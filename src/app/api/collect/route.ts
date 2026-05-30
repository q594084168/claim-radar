import { NextRequest, NextResponse } from "next/server";
import { fetchAndExtract } from "@/lib/data-collector";
import { parseClaimWithAI, generateSlug } from "@/lib/ai-parser";
import { calculateClaimScore } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Step 1: Fetch and extract content
    const page = await fetchAndExtract(url);

    // Step 2: Parse with AI
    const extracted = await parseClaimWithAI(page.content, url);

    // Step 3: Calculate score
    const score = calculateClaimScore({
      estimatedMin: extracted.estimatedMin,
      estimatedMax: extracted.estimatedMax,
      needReceipt: extracted.needReceipt,
      needPurchase: extracted.needPurchase,
      needAccount: extracted.needAccount,
      country: extracted.country,
      eligibleStates: extracted.eligibleStates,
      payPaypal: extracted.payPaypal,
      payVenmo: extracted.payVenmo,
      payCheck: extracted.payCheck,
      payBank: extracted.payBank,
      payEtransfer: extracted.payEtransfer,
      deadline: extracted.deadline ? new Date(extracted.deadline) : null,
    });

    // Step 4: Generate slug
    const slug = generateSlug(extracted.title);

    return NextResponse.json({
      success: true,
      data: {
        ...extracted,
        slug,
        score,
        sourceUrl: url,
        rawContent: page.content.slice(0, 5000), // Store first 5000 chars
      },
    });
  } catch (error) {
    console.error("Collection error:", error);
    return NextResponse.json(
      { error: "Failed to collect and parse claim data" },
      { status: 500 }
    );
  }
}
