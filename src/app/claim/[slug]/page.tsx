import Link from "next/link";

// Mock data for V1.5 - complete claim information
const MOCK_CLAIMS: Record<string, any> = {
  "google-location-tracking": {
    id: "3",
    slug: "google-location-tracking",
    title: "Google Location Tracking Settlement",
    description:
      "Settlement regarding Google's tracking of user locations even when location history was turned off. This settlement resolves allegations that Google violated user privacy by collecting location data without proper consent.",
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
    payPaypal: false,
    payCheck: true,
    officialUrl: "https://www.google.com/search?q=Google+Location+Tracking+Settlement+official+website",
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
    requirements: [
      "Must have had a Google account between 2014-2020",
      "Must have had location history enabled",
      "Must be a US resident",
    ],
    howToApply: [
      "Search for the official settlement website using the link provided",
      "Fill out the claim form with your Google account information",
      "Provide your contact details and mailing address",
      "Submit the form before the deadline",
    ],
    documentsNeeded: [
      "Google account email address",
      "Proof of US residency (driver's license or state ID)",
    ],
    timeline: [
      { date: "2025-02-01", event: "Claims opened", status: "completed" },
      { date: "2026-07-20", event: "Claims deadline", status: "upcoming" },
      { date: "TBD", event: "Court approval hearing", status: "upcoming" },
      { date: "TBD", event: "Payments distributed", status: "upcoming" },
    ],
    faq: [
      {
        question: "Am I eligible for this settlement?",
        answer:
          "You may be eligible if you had a Google account with location history enabled between 2014-2020 and were a US resident during that time.",
      },
      {
        question: "Do I need receipts to file a claim?",
        answer:
          "No, you don't need receipts. You only need your Google account information and proof of US residency.",
      },
      {
        question: "How much money will I receive?",
        answer:
          "Estimated payouts range from $15 to $50, depending on the number of claims filed. The average payout is expected to be around $25.",
      },
      {
        question: "When will I receive payment?",
        answer:
          "Payments will be distributed after the court approves the settlement and all claims are processed. This typically takes 3-6 months after the claims deadline.",
      },
      {
        question: "How will I receive payment?",
        answer:
          "Payments will be made by check mailed to the address you provide in your claim form.",
      },
    ],
  },
  "facebook-privacy-settlement": {
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
    officialUrl: "https://www.google.com/search?q=Facebook+BIPA+Settlement+official+website",
    sourceName: "Epiq",
    scorePayout: 35,
    scoreDifficulty: 20,
    scoreCoverage: 15,
    scoreSpeed: 10,
    scoreRisk: 8,
    scoreTotal: 88,
    eligibleStates: ["IL"],
    summary:
      "Facebook users in Illinois may be eligible for payment if they used Facebook's facial recognition features. No receipt required.",
    status: "active",
    requirements: [
      "Must have had a Facebook account",
      "Must have been an Illinois resident between 2011-2021",
      "Must have used Facebook's facial recognition features",
    ],
    howToApply: [
      "Search for the official settlement website using the link provided",
      "Fill out the claim form with your Facebook account information",
      "Provide proof of Illinois residency",
      "Submit the form before the deadline",
    ],
    documentsNeeded: [
      "Facebook account email or phone number",
      "Proof of Illinois residency (driver's license or utility bill)",
    ],
    timeline: [
      { date: "2025-01-15", event: "Claims opened", status: "completed" },
      { date: "2026-08-15", event: "Claims deadline", status: "upcoming" },
      { date: "TBD", event: "Court approval hearing", status: "upcoming" },
      { date: "TBD", event: "Payments distributed", status: "upcoming" },
    ],
    faq: [
      {
        question: "Am I eligible for this settlement?",
        answer:
          "You may be eligible if you had a Facebook account and were an Illinois resident between 2011-2021, and used Facebook's facial recognition features.",
      },
      {
        question: "Do I need receipts to file a claim?",
        answer:
          "No, you don't need receipts. You only need your Facebook account information and proof of Illinois residency.",
      },
      {
        question: "How much money will I receive?",
        answer:
          "Estimated payouts range from $30 to $100, depending on the number of claims filed. The average payout is expected to be around $45.",
      },
      {
        question: "When will I receive payment?",
        answer:
          "Payments will be distributed after the court approves the settlement and all claims are processed. This typically takes 3-6 months after the claims deadline.",
      },
      {
        question: "How will I receive payment?",
        answer:
          "You can choose to receive payment via PayPal or by check mailed to your address.",
      },
    ],
  },
  "t-mobile-data-breach": {
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
    officialUrl: "https://www.google.com/search?q=T-Mobile+Data+Breach+Settlement+official+website",
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
    requirements: [
      "Must have been a T-Mobile customer or had data exposed in the 2021 breach",
      "Must be a US resident",
    ],
    howToApply: [
      "Search for the official settlement website using the link provided",
      "Fill out the claim form with your contact information",
      "Provide your T-Mobile account information (if applicable)",
      "Submit the form before the deadline",
    ],
    documentsNeeded: [
      "Proof of identity (driver's license or state ID)",
      "T-Mobile account information (if available)",
    ],
    timeline: [
      { date: "2025-03-01", event: "Claims opened", status: "completed" },
      { date: "2026-09-30", event: "Claims deadline", status: "upcoming" },
      { date: "TBD", event: "Court approval hearing", status: "upcoming" },
      { date: "TBD", event: "Payments distributed", status: "upcoming" },
    ],
    faq: [
      {
        question: "Am I eligible for this settlement?",
        answer:
          "You may be eligible if you were a T-Mobile customer or had your personal data exposed in the 2021 data breach.",
      },
      {
        question: "Do I need receipts to file a claim?",
        answer:
          "No, you don't need receipts. You only need to provide your contact information and proof of identity.",
      },
      {
        question: "How much money will I receive?",
        answer:
          "Estimated payouts range from $25 to $75, depending on the number of claims filed. The average payout is expected to be around $35.",
      },
      {
        question: "When will I receive payment?",
        answer:
          "Payments will be distributed after the court approves the settlement and all claims are processed. This typically takes 3-6 months after the claims deadline.",
      },
      {
        question: "How will I receive payment?",
        answer:
          "You can choose to receive payment via PayPal or by check mailed to your address.",
      },
    ],
  },
  "capital-one-data-breach": {
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
    payPaypal: false,
    payBank: true,
    officialUrl: "https://www.google.com/search?q=Capital+One+Data+Breach+Settlement+official+website",
    sourceName: "JND Legal Administration",
    scorePayout: 40,
    scoreDifficulty: 25,
    scoreCoverage: 15,
    scoreSpeed: 7,
    scoreRisk: 8,
    scoreTotal: 95,
    eligibleStates: [],
    summary:
      "Capital One customers affected by the 2019 data breach may qualify for a cash payment. No receipt required.",
    status: "active",
    requirements: [
      "Must have been a Capital One customer or had data exposed in the 2019 breach",
      "Must be a US resident",
    ],
    howToApply: [
      "Search for the official settlement website using the link provided",
      "Fill out the claim form with your contact information",
      "Provide your Capital One account information (if applicable)",
      "Submit the form before the deadline",
    ],
    documentsNeeded: [
      "Proof of identity (driver's license or state ID)",
      "Capital One account information (if available)",
    ],
    timeline: [
      { date: "2025-04-01", event: "Claims opened", status: "completed" },
      { date: "2026-11-01", event: "Claims deadline", status: "upcoming" },
      { date: "TBD", event: "Court approval hearing", status: "upcoming" },
      { date: "TBD", event: "Payments distributed", status: "upcoming" },
    ],
    faq: [
      {
        question: "Am I eligible for this settlement?",
        answer:
          "You may be eligible if you were a Capital One customer or had your personal data exposed in the 2019 data breach.",
      },
      {
        question: "Do I need receipts to file a claim?",
        answer:
          "No, you don't need receipts. You only need to provide your contact information and proof of identity.",
      },
      {
        question: "How much money will I receive?",
        answer:
          "Estimated payouts range from $50 to $200, depending on the number of claims filed. The average payout is expected to be around $85.",
      },
      {
        question: "When will I receive payment?",
        answer:
          "Payments will be distributed after the court approves the settlement and all claims are processed. This typically takes 3-6 months after the claims deadline.",
      },
      {
        question: "How will I receive payment?",
        answer:
          "Payments will be made by bank transfer to the account you specify in your claim form.",
      },
    ],
  },
  "equifax-settlement": {
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
    payPaypal: false,
    payCheck: true,
    officialUrl: "https://www.google.com/search?q=Equifax+Data+Breach+Settlement+official+website",
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
    requirements: [
      "Must have had personal data exposed in the 2017 Equifax breach",
      "Must be a US resident",
    ],
    howToApply: [
      "Search for the official settlement website using the link provided",
      "Fill out the claim form with your contact information",
      "Provide proof of identity",
      "Submit the form before the deadline",
    ],
    documentsNeeded: [
      "Proof of identity (driver's license or state ID)",
      "Social Security Number (last 4 digits)",
    ],
    timeline: [
      { date: "2025-01-01", event: "Claims opened", status: "completed" },
      { date: "2026-12-31", event: "Claims deadline", status: "upcoming" },
      { date: "TBD", event: "Court approval hearing", status: "upcoming" },
      { date: "TBD", event: "Payments distributed", status: "upcoming" },
    ],
    faq: [
      {
        question: "Am I eligible for this settlement?",
        answer:
          "You may be eligible if your personal data was exposed in the 2017 Equifax data breach.",
      },
      {
        question: "Do I need receipts to file a claim?",
        answer:
          "No, you don't need receipts. You only need to provide your contact information and proof of identity.",
      },
      {
        question: "How much money will I receive?",
        answer:
          "Estimated payouts range from $20 to $125, depending on the number of claims filed. The average payout is expected to be around $45.",
      },
      {
        question: "When will I receive payment?",
        answer:
          "Payments will be distributed after the court approves the settlement and all claims are processed. This typically takes 3-6 months after the claims deadline.",
      },
      {
        question: "How will I receive payment?",
        answer:
          "Payments will be made by check mailed to the address you provide in your claim form.",
      },
    ],
  },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "data-breach": "Data Breach",
    "class-action": "Class Action",
    "consumer-settlement": "Consumer Settlement",
  };
  return labels[category] || category;
}

function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const claim = MOCK_CLAIMS[slug];

  if (!claim) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Claim Not Found</h1>
          <p className="mt-4 text-gray-500">
            The claim you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/us"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to US Claims
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(claim.deadline);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>→</li>
          <li>
            <Link href="/us" className="hover:text-gray-700">
              🇺🇸 USA
            </Link>
          </li>
          <li>→</li>
          <li className="text-gray-900 font-medium">{claim.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🇺🇸</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getCategoryLabel(claim.category)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {claim.title}
                </h1>
              </div>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-lg border ${getScoreColor(claim.scoreTotal)}`}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold">{claim.scoreTotal}</div>
                  <div className="text-xs">/100</div>
                  <div className="text-xs mt-1">
                    {getScoreLabel(claim.scoreTotal)}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-lg">{claim.description}</p>
          </div>

          {/* Key Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📋 Key Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💵</span>
                <div>
                  <div className="text-sm text-gray-500">Estimated Payout</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${claim.estimatedMin} - ${claim.estimatedMax}
                  </div>
                  {claim.actualAvg && (
                    <div className="text-sm text-green-600">
                      Avg. actual: ${claim.actualAvg}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(claim.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div
                    className={`text-sm font-medium ${daysLeft < 30 ? "text-red-600" : "text-gray-500"}`}
                  >
                    {daysLeft > 0
                      ? `${daysLeft} days remaining`
                      : "Deadline passed"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-sm text-gray-500">Coverage</div>
                  <div className="text-lg font-bold text-gray-900">
                    {claim.eligibleStates.length === 0
                      ? "All United States"
                      : `${claim.eligibleStates.length} states`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💳</span>
                <div>
                  <div className="text-sm text-gray-500">Payment Methods</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {claim.payPaypal && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        PayPal
                      </span>
                    )}
                    {claim.payCheck && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        Check
                      </span>
                    )}
                    {claim.payBank && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                        Bank Transfer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ✅ Requirements
            </h2>
            <div className="space-y-3">
              {claim.requirements.map((req: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-xl text-green-500">✓</span>
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📝 How to Apply
            </h2>
            <div className="space-y-4">
              {claim.howToApply.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Needed */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📄 Documents Needed
            </h2>
            <div className="space-y-3">
              {claim.documentsNeeded.map((doc: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-xl text-blue-500">📋</span>
                  <span className="text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📅 Timeline
            </h2>
            <div className="space-y-4">
              {claim.timeline.map(
                (
                  item: { date: string; event: string; status: string },
                  index: number
                ) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status === "completed" ? "✓" : (index + 1)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.event}
                      </div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {claim.faq.map(
                (
                  item: { question: string; answer: string },
                  index: number
                ) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Apply CTA */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Ready to Claim?
            </h3>
            <a
              href={claim.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mb-4"
            >
              Find Official Website →
            </a>
            <p className="text-xs text-gray-500 text-center mb-4">
              Search for the official settlement website
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>⚠️ Important:</strong> Always verify you're on the official settlement website before submitting personal information. Look for .gov or official settlement administrator domains.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Quick Facts</h4>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Source</dt>
                  <dd className="font-medium text-gray-900">
                    {claim.sourceName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Open Date</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(claim.openDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Related Claims */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Similar Claims
            </h3>
            <div className="space-y-4">
              {Object.values(MOCK_CLAIMS)
                .filter((c: any) => c.slug !== claim.slug)
                .slice(0, 3)
                .map((similar: any) => (
                  <Link
                    key={similar.slug}
                    href={`/claim/${similar.slug}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {similar.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ${similar.estimatedMin} - ${similar.estimatedMax}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
