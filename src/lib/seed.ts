import { prisma } from "./prisma";
import { calculateClaimScore } from "./scoring";

const INITIAL_CLAIMS = [
  {
    slug: "facebook-privacy-settlement",
    title: "Facebook Privacy Settlement",
    description:
      "Settlement regarding Facebook's collection and use of biometric data through its facial recognition technology without proper consent.",
    country: "US",
    category: "data-breach",
    sourceUrl: "https://topclassactions.com/lawsuit-settlements/privacy/facebook-bipa-settlement/",
    sourceName: "TopClassActions",
    officialUrl: "https://www.facebookbipaclassactionsettlement.com",
    deadline: new Date("2026-08-15"),
    openDate: new Date("2025-01-15"),
    estimatedMin: 30,
    estimatedMax: 100,
    needReceipt: false,
    needPurchase: false,
    needAccount: true,
    accountType: "facebook",
    payPaypal: true,
    payVenmo: false,
    payCheck: true,
    payBank: false,
    payEtransfer: false,
    eligibleStates: [],
    aiSummary:
      "Facebook users in Illinois may be eligible for payment if they used Facebook's facial recognition features. No receipt required - just proof of Facebook account.",
    status: "active",
    isVerified: true,
  },
  {
    slug: "t-mobile-data-breach",
    title: "T-Mobile Data Breach Settlement",
    description:
      "Settlement related to T-Mobile's 2021 data breach that exposed personal information of approximately 76.6 million people.",
    country: "US",
    category: "data-breach",
    sourceUrl: "https://topclassactions.com/lawsuit-settlements/privacy/t-mobile-data-breach-settlement/",
    sourceName: "TopClassActions",
    officialUrl: "https://www.tmobilesettlement.com",
    deadline: new Date("2026-09-30"),
    openDate: new Date("2025-03-01"),
    estimatedMin: 25,
    estimatedMax: 75,
    needReceipt: false,
    needPurchase: false,
    needAccount: false,
    accountType: null,
    payPaypal: true,
    payVenmo: false,
    payCheck: true,
    payBank: false,
    payEtransfer: false,
    eligibleStates: [],
    aiSummary:
      "If you were a T-Mobile customer or had your data exposed in the 2021 breach, you may qualify for a cash payment. No receipt required.",
    status: "active",
    isVerified: true,
  },
  {
    slug: "google-location-tracking",
    title: "Google Location Tracking Settlement",
    description:
      "Settlement regarding Google's tracking of user locations even when location history was turned off.",
    country: "US",
    category: "class-action",
    sourceUrl: "https://topclassactions.com/lawsuit-settlements/privacy/google-location-tracking-settlement/",
    sourceName: "TopClassActions",
    officialUrl: "https://www.googlelocationsharingsettlement.com",
    deadline: new Date("2026-07-20"),
    openDate: new Date("2025-02-01"),
    estimatedMin: 15,
    estimatedMax: 50,
    needReceipt: false,
    needPurchase: false,
    needAccount: true,
    accountType: "google",
    payPaypal: false,
    payVenmo: false,
    payCheck: true,
    payBank: false,
    payEtransfer: false,
    eligibleStates: [],
    aiSummary:
      "Google users may be eligible for payment if Google tracked their location data without proper consent. Requires Google account.",
    status: "active",
    isVerified: true,
  },
  {
    slug: "capital-one-data-breach",
    title: "Capital One Data Breach Settlement",
    description:
      "Settlement related to Capital One's 2019 data breach that exposed personal information of approximately 100 million people.",
    country: "US",
    category: "data-breach",
    sourceUrl: "https://topclassactions.com/lawsuit-settlements/privacy/capital-one-data-breach-settlement/",
    sourceName: "TopClassActions",
    officialUrl: "https://www.capitalonesettlement.com",
    deadline: new Date("2026-11-01"),
    openDate: new Date("2025-04-01"),
    estimatedMin: 50,
    estimatedMax: 200,
    needReceipt: false,
    needPurchase: false,
    needAccount: false,
    accountType: null,
    payPaypal: false,
    payVenmo: false,
    payCheck: false,
    payBank: true,
    payEtransfer: false,
    eligibleStates: [],
    aiSummary:
      "Capital One customers affected by the 2019 data breach may qualify for a cash payment. No receipt required - just proof of account.",
    status: "active",
    isVerified: true,
  },
  {
    slug: "equifax-settlement",
    title: "Equifax Data Breach Settlement",
    description:
      "Settlement related to Equifax's 2017 data breach that exposed personal information of approximately 147 million people.",
    country: "US",
    category: "data-breach",
    sourceUrl: "https://topclassactions.com/lawsuit-settlements/privacy/equifax-data-breach-settlement/",
    sourceName: "TopClassActions",
    officialUrl: "https://www.equifaxbreachsettlement.com",
    deadline: new Date("2026-12-31"),
    openDate: new Date("2025-01-01"),
    estimatedMin: 20,
    estimatedMax: 125,
    needReceipt: false,
    needPurchase: false,
    needAccount: false,
    accountType: null,
    payPaypal: false,
    payVenmo: false,
    payCheck: true,
    payBank: false,
    payEtransfer: false,
    eligibleStates: [],
    aiSummary:
      "Consumers affected by the 2017 Equifax data breach may qualify for a cash payment. No receipt required.",
    status: "active",
    isVerified: true,
  },
  {
    slug: "canada-telecom-settlement",
    title: "Canadian Telecom Overcharge Settlement",
    description:
      "Settlement regarding Canadian telecom companies overcharging customers for various services.",
    country: "CA",
    category: "consumer-settlement",
    sourceUrl: "https://www.classaction.org/news/canadian-telecom-settlement",
    sourceName: "ClassAction.org",
    officialUrl: "https://www.canadiantelecomsettlement.ca",
    deadline: new Date("2026-10-15"),
    openDate: new Date("2025-05-01"),
    estimatedMin: 40,
    estimatedMax: 150,
    needReceipt: true,
    needPurchase: true,
    needAccount: false,
    accountType: null,
    payPaypal: false,
    payVenmo: false,
    payCheck: false,
    payBank: false,
    payEtransfer: true,
    eligibleStates: [],
    aiSummary:
      "Canadian telecom customers who were overcharged may qualify for a refund. Receipt required.",
    status: "active",
    isVerified: true,
  },
];

export async function seed() {
  console.log("Seeding database...");

  for (const claimData of INITIAL_CLAIMS) {
    // Calculate score
    const score = calculateClaimScore({
      estimatedMin: claimData.estimatedMin,
      estimatedMax: claimData.estimatedMax,
      needReceipt: claimData.needReceipt,
      needPurchase: claimData.needPurchase,
      needAccount: claimData.needAccount,
      country: claimData.country,
      eligibleStates: claimData.eligibleStates,
      payPaypal: claimData.payPaypal || false,
      payVenmo: claimData.payVenmo || false,
      payCheck: claimData.payCheck || false,
      payBank: claimData.payBank || false,
      payEtransfer: claimData.payEtransfer || false,
      deadline: claimData.deadline,
    });

    // Upsert claim
    await prisma.claim.upsert({
      where: { slug: claimData.slug },
      update: {
        ...claimData,
        scorePayout: score.payout,
        scoreDifficulty: score.difficulty,
        scoreCoverage: score.coverage,
        scoreSpeed: score.speed,
        scoreRisk: score.risk,
        scoreTotal: score.total,
        updatedAt: new Date(),
      },
      create: {
        ...claimData,
        scorePayout: score.payout,
        scoreDifficulty: score.difficulty,
        scoreCoverage: score.coverage,
        scoreSpeed: score.speed,
        scoreRisk: score.risk,
        scoreTotal: score.total,
      },
    });

    console.log(`Seeded: ${claimData.title}`);
  }

  console.log("Seeding complete!");
}

// Run if called directly
if (require.main === module) {
  seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
