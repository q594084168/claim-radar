import Link from "next/link";

// Mock data for V1
const MOCK_CLAIMS = [
  {
    id: "1",
    slug: "facebook-privacy-settlement",
    title: "Facebook Privacy Settlement",
    country: "US",
    category: "data-breach",
    deadline: "2026-08-15",
    estimatedMin: 30,
    estimatedMax: 100,
    needReceipt: false,
    payPaypal: true,
    scoreTotal: 88,
    status: "active",
  },
  {
    id: "2",
    slug: "t-mobile-data-breach",
    title: "T-Mobile Data Breach Settlement",
    country: "US",
    category: "data-breach",
    deadline: "2026-09-30",
    estimatedMin: 25,
    estimatedMax: 75,
    needReceipt: false,
    payPaypal: true,
    scoreTotal: 85,
    status: "active",
  },
  {
    id: "3",
    slug: "google-location-tracking",
    title: "Google Location Tracking Settlement",
    country: "US",
    category: "class-action",
    deadline: "2026-07-20",
    estimatedMin: 15,
    estimatedMax: 50,
    needReceipt: false,
    payCheck: true,
    scoreTotal: 65,
    status: "active",
  },
  {
    id: "4",
    slug: "capital-one-data-breach",
    title: "Capital One Data Breach Settlement",
    country: "US",
    category: "data-breach",
    deadline: "2026-11-01",
    estimatedMin: 50,
    estimatedMax: 200,
    needReceipt: false,
    payBank: true,
    scoreTotal: 90,
    status: "active",
  },
  {
    id: "5",
    slug: "canada-telecom-settlement",
    title: "Canadian Telecom Overcharge Settlement",
    country: "CA",
    category: "consumer-settlement",
    deadline: "2026-10-15",
    estimatedMin: 40,
    estimatedMax: 150,
    needReceipt: true,
    payEtransfer: true,
    scoreTotal: 58,
    status: "active",
  },
  {
    id: "6",
    slug: "canada-privacy-breach",
    title: "Canadian Privacy Data Breach",
    country: "CA",
    category: "data-breach",
    deadline: "2026-12-01",
    estimatedMin: 20,
    estimatedMax: 80,
    needReceipt: false,
    payEtransfer: true,
    scoreTotal: 72,
    status: "active",
  },
];

const COUNTRY_INFO: Record<string, { name: string; flag: string; description: string }> = {
  us: {
    name: "United States",
    flag: "🇺🇸",
    description: "Class action settlements, data breach claims, and consumer refunds available in the US.",
  },
  ca: {
    name: "Canada",
    flag: "🇨🇦",
    description: "Canadian class actions, privacy breach settlements, and consumer protection claims.",
  },
  au: {
    name: "Australia",
    flag: "🇦🇺",
    description: "Australian class actions and consumer compensation claims.",
  },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
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

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const countryInfo = COUNTRY_INFO[country];

  if (!countryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Country Not Found</h1>
          <p className="mt-4 text-gray-500">
            The country you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const countryClaims = MOCK_CLAIMS.filter(
    (c) => c.country.toLowerCase() === country
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Home
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-5xl">{countryInfo.flag}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {countryInfo.name} Settlements
            </h1>
            <p className="text-gray-500 mt-1">{countryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {countryClaims.length}
          </div>
          <div className="text-sm text-gray-500">Active Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {countryClaims.filter((c) => !c.needReceipt).length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {countryClaims.filter((c) => c.payPaypal).length}
          </div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${Math.min(...countryClaims.map((c) => c.estimatedMin))}-
            {Math.max(...countryClaims.map((c) => c.estimatedMax))}
          </div>
          <div className="text-sm text-gray-500">Payout Range</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={`/${country}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium"
        >
          All Claims
        </Link>
        <Link
          href={`/${country}/data-breach`}
          className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Data Breach
        </Link>
        <Link
          href={`/${country}/class-action`}
          className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Class Action
        </Link>
        <Link
          href={`/${country}/consumer-settlement`}
          className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Consumer Settlement
        </Link>
      </div>

      {/* Claims List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countryClaims.map((claim) => {
          const daysLeft = getDaysUntilDeadline(claim.deadline);

          return (
            <Link
              key={claim.id}
              href={`/${claim.country.toLowerCase()}/${claim.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{countryInfo.flag}</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.scoreTotal)}`}
                >
                  {claim.scoreTotal}/100
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {claim.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>📁</span>
                  <span>{getCategoryLabel(claim.category)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>💵</span>
                  <span>
                    ${claim.estimatedMin} - ${claim.estimatedMax}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span
                    className={daysLeft < 30 ? "text-red-600 font-medium" : ""}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Expiring soon"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {claim.needReceipt ? (
                    <span className="text-orange-500">📋 Receipt needed</span>
                  ) : (
                    <span className="text-green-500">✅ No receipt needed</span>
                  )}
                </div>

                {claim.payPaypal && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">💳 PayPal available</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {countryClaims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No active claims found for this country.
          </p>
        </div>
      )}
    </div>
  );
}
