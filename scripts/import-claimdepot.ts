// Script to import ClaimDepot data into Supabase
// Run: npx tsx scripts/import-claimdepot.ts

import { crawlClaimDepot } from "../src/lib/data-acquisition/crawlers/claimdepot";
import { convertToDatabaseFormat } from "../src/lib/data-acquisition/orchestrator";

const SUPABASE_URL = "https://vqvearbuktkdkfwsocjk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdmVhcmJ1a3RrZGtmd3NvY2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE3NzEyOCwiZXhwIjoyMDk1NzUzMTI4fQ.J4CuK0o3pB3wCaiXrqED_awVnSIAoKhl45qN9VdQ1EQ";

async function importClaimDepot() {
  console.log("🚀 Starting ClaimDepot data import...");

  try {
    // Step 1: Crawl ClaimDepot from sitemap
    console.log("📡 Crawling ClaimDepot from sitemap...");
    const allCases = await crawlClaimDepot();
    console.log(`✅ Found ${allCases.length} claims`);

    // Step 2: Process and store each claim
    let imported = 0;
    let skipped = 0;

    for (const caseData of allCases) {
      try {
        const dbFormat = convertToDatabaseFormat(caseData);

        // Insert into Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/claims`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Prefer": "resolution=merge-duplicates",
          },
          body: JSON.stringify({
            id: dbFormat.slug,
            slug: dbFormat.slug,
            title: dbFormat.title,
            description: dbFormat.description,
            country: dbFormat.country,
            category: dbFormat.category,
            source_url: dbFormat.sourceUrl,
            source_name: "ClaimDepot",
            official_url: dbFormat.officialUrl,
            deadline: dbFormat.deadline,
            estimated_min: dbFormat.estimatedMin,
            estimated_max: dbFormat.estimatedMax,
            need_receipt: dbFormat.needReceipt,
            pay_paypal: dbFormat.payPaypal,
            pay_check: dbFormat.payCheck,
            pay_bank: dbFormat.payBank,
            status: dbFormat.status,
          }),
        });

        if (response.ok) {
          imported++;
        } else {
          console.error(`❌ Error importing ${dbFormat.title}:`, await response.text());
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error importing ${caseData.title}:`, error);
        skipped++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Imported: ${imported}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📊 Total: ${allCases.length}`);
  } catch (error) {
    console.error("❌ Error during import:", error);
  }
}

importClaimDepot();
