// Script to generate static data file at build time
// This runs during `npm run build` to pre-generate data

import { crawlClaimDepot } from "../src/lib/data-acquisition/crawlers/claimdepot";
import { convertToDatabaseFormat } from "../src/lib/data-acquisition/orchestrator";
import { generateTags } from "../src/lib/auto-tag";
import { calculateEnhancedScore } from "../src/lib/enhanced-score";
import { promises as fs } from "fs";
import path from "path";

const OUTPUT_FILE = path.join(process.cwd(), "public", "claims-data.json");

async function buildData() {
  console.log("🔨 Building static data...");

  try {
    // Crawl ClaimDepot
    console.log("📡 Fetching data from ClaimDepot...");
    const cases = await crawlClaimDepot();
    console.log(`✅ Found ${cases.length} claims`);

    // Process and format data
    const processedClaims = cases.slice(0, 100).map((c) => {
      const dbFormat = convertToDatabaseFormat(c);

      // Generate tags
      const tags = generateTags({
        title: dbFormat.title,
        description: dbFormat.description,
        needReceipt: dbFormat.needReceipt,
        payPaypal: dbFormat.payPaypal,
        payCheck: dbFormat.payCheck,
        payBank: dbFormat.payBank,
        estimatedMin: dbFormat.estimatedMin,
        estimatedMax: dbFormat.estimatedMax,
        deadline: dbFormat.deadline,
        country: dbFormat.country,
        category: dbFormat.category,
      });

      // Calculate score
      const score = calculateEnhancedScore({
        estimatedMin: dbFormat.estimatedMin,
        estimatedMax: dbFormat.estimatedMax,
        needReceipt: dbFormat.needReceipt,
        payPaypal: dbFormat.payPaypal,
        payCheck: dbFormat.payCheck,
        payBank: dbFormat.payBank,
        deadline: dbFormat.deadline,
        tags: tags.tags,
      });

      return {
        id: dbFormat.slug,
        slug: dbFormat.slug,
        title: dbFormat.title,
        description: dbFormat.description,
        country: dbFormat.country,
        category: dbFormat.category,
        deadline: dbFormat.deadline,
        estimatedMin: dbFormat.estimatedMin,
        estimatedMax: dbFormat.estimatedMax,
        needReceipt: dbFormat.needReceipt,
        payPaypal: dbFormat.payPaypal,
        payCheck: dbFormat.payCheck,
        payBank: dbFormat.payBank,
        officialUrl: dbFormat.officialUrl,
        sourceName: "ClaimDepot",
        status: dbFormat.status,
        tags,
        score,
      };
    });

    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public");
    await fs.mkdir(publicDir, { recursive: true });

    // Write to file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(processedClaims, null, 2));

    console.log(`✅ Data written to ${OUTPUT_FILE}`);
    console.log(`📊 Total claims: ${processedClaims.length}`);
  } catch (error) {
    console.error("❌ Error building data:", error);
    // Don't fail the build, just log the error
    process.exit(0);
  }
}

buildData();
