import { AIExtractedData } from "@/types/claim";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const EXTRACTION_PROMPT = `You are a legal claims data extractor. Analyze the following settlement/claim page content and extract structured data.

Return ONLY valid JSON with this exact structure:
{
  "title": "string - the claim/settlement name",
  "description": "string - brief 1-2 sentence description",
  "country": "US" | "CA" | "AU",
  "category": "data-breach" | "class-action" | "consumer-settlement",
  "deadline": "YYYY-MM-DD or null if not found",
  "openDate": "YYYY-MM-DD or null if not found",
  "estimatedMin": number or null (minimum estimated payout in USD),
  "estimatedMax": number or null (maximum estimated payout in USD),
  "needReceipt": boolean,
  "needPurchase": boolean,
  "needAccount": boolean,
  "accountType": "string or null (e.g., facebook, google)",
  "needResidency": boolean,
  "payPaypal": boolean,
  "payVenmo": boolean,
  "payCheck": boolean,
  "payBank": boolean,
  "payEtransfer": boolean,
  "eligibleStates": ["array of state codes, empty if all states"],
  "summary": "string - 2-3 sentence plain English summary for users"
}

Important rules:
- If payout amount is mentioned as "up to $X", set estimatedMax to X
- If only one amount is mentioned, set both min and max to that amount
- For category: "data-breach" = data泄露, "class-action" = 集体诉讼, "consumer-settlement" = 消费者赔偿
- If country is not explicitly stated, infer from context (state names, legal system)
- eligibleStates: use 2-letter codes like "CA", "NY", empty array means all states eligible
`;

export async function parseClaimWithAI(
  content: string,
  sourceUrl: string
): Promise<AIExtractedData> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  const apiUrl = process.env.OPENAI_API_KEY ? OPENAI_API_URL : DEEPSEEK_API_URL;
  const model = process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "deepseek-chat";

  if (!apiKey) {
    throw new Error("No AI API key configured");
  }

  // Truncate content to avoid token limits
  const truncatedContent = content.slice(0, 12000);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        {
          role: "user",
          content: `Source URL: ${sourceUrl}\n\nPage Content:\n${truncatedContent}`,
        },
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const extracted = JSON.parse(data.choices[0].message.content);

  return validateAndCleanExtractedData(extracted);
}

function validateAndCleanExtractedData(data: any): AIExtractedData {
  return {
    title: data.title || "Unknown Claim",
    description: data.description || "",
    country: ["US", "CA", "AU"].includes(data.country) ? data.country : "US",
    category: ["data-breach", "class-action", "consumer-settlement"].includes(
      data.category
    )
      ? data.category
      : "class-action",
    deadline: data.deadline || null,
    openDate: data.openDate || null,
    estimatedMin: data.estimatedMin ?? null,
    estimatedMax: data.estimatedMax ?? null,
    needReceipt: Boolean(data.needReceipt),
    needPurchase: Boolean(data.needPurchase),
    needAccount: Boolean(data.needAccount),
    accountType: data.accountType || null,
    needResidency: Boolean(data.needResidency),
    payPaypal: Boolean(data.payPaypal),
    payVenmo: Boolean(data.payVenmo),
    payCheck: Boolean(data.payCheck),
    payBank: Boolean(data.payBank),
    payEtransfer: Boolean(data.payEtransfer),
    eligibleStates: Array.isArray(data.eligibleStates) ? data.eligibleStates : [],
    summary: data.summary || "",
  };
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * Generate meta title for SEO
 */
export function generateMetaTitle(
  title: string,
  country: string,
  category: string
): string {
  const countryNames: Record<string, string> = {
    US: "USA",
    CA: "Canada",
    AU: "Australia",
  };
  return `${title} - ${countryNames[country] || country} ${category
    .replace("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())} Settlement | ClaimRadar`;
}

/**
 * Generate meta description for SEO
 */
export function generateMetaDescription(
  summary: string,
  deadline: string | null,
  estimatedMin: number | null,
  estimatedMax: number | null
): string {
  let desc = summary.slice(0, 120);
  if (deadline) {
    desc += ` Deadline: ${deadline}.`;
  }
  if (estimatedMin && estimatedMax) {
    desc += ` Est. payout: $${estimatedMin}-$${estimatedMax}.`;
  }
  desc += " Check eligibility now.";
  return desc.slice(0, 160);
}
