import { NextRequest, NextResponse } from "next/server";

// Mock data for V1 - will be replaced with database queries
const MOCK_CLAIMS = [
  {
    id: "1",
    slug: "facebook-privacy-settlement",
    title: "Facebook Privacy Settlement",
    description:
      "Settlement regarding Facebook's collection and use of biometric data through its facial recognition technology without proper consent.",
    country: "US",
    category: "data-breach",
    deadline: "2026-08-15",
    openDate: "2025-01-15",
    estimatedMin: 30,
    estimatedMax: 100,
    actualAvg: 45,
    needReceipt: false,
    needPurchase: false,
    needAccount: true,
    accountType: "facebook",
    payPaypal: true,
    payCheck: true,
    officialUrl: "https://www.facebookbipaclassactionsettlement.com",
    sourceName: "Epiq",
    scorePayout: 35,
    scoreDifficulty: 20,
    scoreCoverage: 15,
    scoreSpeed: 10,
    scoreRisk: 8,
    scoreTotal: 88,
    eligibleStates: [],
    summary:
      "Facebook users in Illinois may be eligible for payment if they used Facebook's facial recognition features. No receipt required - just proof of Facebook account.",
    status: "active",
  },
  {
    id: "2",
    slug: "t-mobile-data-breach",
    title: "T-Mobile Data Breach Settlement",
    description:
      "Settlement related to T-Mobile's 2021 data breach that exposed personal information of approximately 76.6 million people.",
    country: "US",
    category: "data-breach",
    deadline: "2026-09-30",
    openDate: "2025-03-01",
    estimatedMin: 25,
    estimatedMax: 75,
    actualAvg: 35,
    needReceipt: false,
    needPurchase: false,
    needAccount: false,
    accountType: null,
    payPaypal: true,
    payCheck: true,
    officialUrl: "https://www.tmobilesettlement.com",
    sourceName: "Kroll",
    scorePayout: 30,
    scoreDifficulty: 25,
    scoreCoverage: 15,
    scoreSpeed: 10,
    scoreRisk: 8,
    scoreTotal: 88,
    eligibleStates: [],
    summary:
      "If you were a T-Mobile customer or had your data exposed in the 2021 breach, you may qualify for a cash payment. No receipt required.",
    status: "active",
  },
  {
    id: "3",
    slug: "google-location-tracking",
    title: "Google Location Tracking Settlement",
    description:
      "Settlement regarding Google's tracking of user locations even when location history was turned off.",
    country: "US",
    category: "class-action",
    deadline: "2026-07-20",
    openDate: "2025-02-01",
    estimatedMin: 15,
    estimatedMax: 50,
    actualAvg: 25,
    needReceipt: false,
    needPurchase: false,
    needAccount: true,
    accountType: "google",
    payCheck: true,
    officialUrl: "https://www.googlelocationsharingsettlement.com",
    sourceName: "Angeion Group",
    scorePayout: 20,
    scoreDifficulty: 20,
    scoreCoverage: 15,
    scoreSpeed: 5,
    scoreRisk: 5,
    scoreTotal: 65,
    eligibleStates: [],
    summary:
      "Google users may be eligible for payment if Google tracked their location data without proper consent. Requires Google account.",
    status: "active",
  },
  {
    id: "4",
    slug: "capital-one-data-breach",
    title: "Capital One Data Breach Settlement",
    description:
      "Settlement related to Capital One's 2019 data breach that exposed personal information of approximately 100 million people.",
    country: "US",
    category: "data-breach",
    deadline: "2026-11-01",
    openDate: "2025-04-01",
    estimatedMin: 50,
    estimatedMax: 200,
    actualAvg: 85,
    needReceipt: false,
    needPurchase: false,
    needAccount: false,
    accountType: null,
    payBank: true,
    officialUrl: "https://www.capitalonesettlement.com",
    sourceName: "JND Legal Administration",
    scorePayout: 40,
    scoreDifficulty: 25,
    scoreCoverage: 15,
    scoreSpeed: 7,
    scoreRisk: 8,
    scoreTotal: 95,
    eligibleStates: [],
    summary:
      "Capital One customers affected by the 2019 data breach may qualify for a cash payment. No receipt required - just proof of account.",
    status: "active",
  },
  {
    id: "5",
    slug: "equifax-settlement",
    title: "Equifax Data Breach Settlement",
    description:
      "Settlement related to Equifax's 2017 data breach that exposed personal information of approximately 147 million people.",
    country: "US",
    category: "data-breach",
    deadline: "2026-12-31",
    openDate: "2025-01-01",
    estimatedMin: 20,
    estimatedMax: 125,
    actualAvg: 45,
    needReceipt: false,
    needPurchase: false,
    needAccount: false,
    accountType: null,
    payCheck: true,
    officialUrl: "https://www.equifaxbreachsettlement.com",
    sourceName: "Epiq",
    scorePayout: 30,
    scoreDifficulty: 25,
    scoreCoverage: 15,
    scoreSpeed: 5,
    scoreRisk: 5,
    scoreTotal: 80,
    eligibleStates: [],
    summary:
      "Consumers affected by the 2017 Equifax data breach may qualify for a cash payment. No receipt required.",
    status: "active",
  },
  {
    id: "6",
    slug: "canada-telecom-settlement",
    title: "Canadian Telecom Overcharge Settlement",
    description:
      "Settlement regarding Canadian telecom companies overcharging customers for various services.",
    country: "CA",
    category: "consumer-settlement",
    deadline: "2026-10-15",
    openDate: "2025-05-01",
    estimatedMin: 40,
    estimatedMax: 150,
    actualAvg: 75,
    needReceipt: true,
    needPurchase: true,
    needAccount: false,
    accountType: null,
    payEtransfer: true,
    officialUrl: "https://www.canadiantelecomsettlement.ca",
    sourceName: "KPMG",
    scorePayout: 35,
    scoreDifficulty: 10,
    scoreCoverage: 15,
    scoreSpeed: 7,
    scoreRisk: 5,
    scoreTotal: 72,
    eligibleStates: [],
    summary:
      "Canadian telecom customers who were overcharged may qualify for a refund. Receipt required.",
    status: "active",
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get filter parameters
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const noReceipt = searchParams.get("noReceipt");
  const paypal = searchParams.get("paypal");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let filteredClaims = [...MOCK_CLAIMS];

  // Apply filters
  if (country) {
    filteredClaims = filteredClaims.filter(
      (c) => c.country.toLowerCase() === country.toLowerCase()
    );
  }

  if (category) {
    filteredClaims = filteredClaims.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (noReceipt === "true") {
    filteredClaims = filteredClaims.filter((c) => !c.needReceipt);
  }

  if (paypal === "true") {
    filteredClaims = filteredClaims.filter((c) => c.payPaypal);
  }

  // Apply pagination
  const total = filteredClaims.length;
  const paginatedClaims = filteredClaims.slice(offset, offset + limit);

  return NextResponse.json({
    claims: paginatedClaims,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}
