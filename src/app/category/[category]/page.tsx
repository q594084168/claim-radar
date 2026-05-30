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
];

const CATEGORY_INFO: Record<string, { name: string; icon: string; description: string }> = {
  "data-breach": {
    name: "Data Breach",
    icon: "🔓",
    description: "Settlements related to data breaches where personal information was compromised.",
  },
  "class-action": {
    name: "Class Action",
    icon: "⚖️",
    description: "Group lawsuits against corporations for various violations.",
  },
  "consumer-settlement": {
    name: "Consumer Settlement",
    icon: "🛒",
    description: "Refunds and settlements for defective products or services.",
  },
  "no-receipt-claims": {
    name: "No Receipt Claims",
    icon: "🎯",
    description: "Claims that don't require proof of purchase - just your name and address.",
  },
  "paypal-settlements": {
    name: "PayPal Settlements",
    icon: "💰",
    description: "Settlements that pay via PayPal for faster access to your money.",
  },
  "expiring-soon": {
    name: "Expiring Soon",
    icon: "⏰",
    description: "Claims with deadlines approaching within 30 days.",
  },
};

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
}

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryInfo = CATEGORY_INFO[category];

  if (!categoryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Category Not Found</h1>
          <p className="mt-4 text-gray-500">
            The category you're looking for doesn't exist.
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

  let filteredClaims = MOCK_CLAIMS;

  // Special filtering for SEO pages
  if (category === "no-receipt-claims") {
    filteredClaims = MOCK_CLAIMS.filter((c) => !c.needReceipt);
  } else if (category === "paypal-settlements") {
    filteredClaims = MOCK_CLAIMS.filter((c) => c.payPaypal);
  } else if (category === "expiring-soon") {
    filteredClaims = MOCK_CLAIMS.filter(
      (c) => getDaysUntilDeadline(c.deadline) <= 30
    );
  } else {
    filteredClaims = MOCK_CLAIMS.filter((c) => c.category === category);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Home
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-5xl">{categoryInfo.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {categoryInfo.name}
            </h1>
            <p className="text-gray-500 mt-1">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredClaims.length}
          </div>
          <div className="text-sm text-gray-500">Active Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredClaims.filter((c) => !c.needReceipt).length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredClaims.filter((c) => c.payPaypal).length}
          </div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${Math.min(...filteredClaims.map((c) => c.estimatedMin))}-
            {Math.max(...filteredClaims.map((c) => c.estimatedMax))}
          </div>
          <div className="text-sm text-gray-500">Payout Range</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/data-breach"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            category === "data-breach"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Data Breach
        </Link>
        <Link
          href="/class-action"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            category === "class-action"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Class Action
        </Link>
        <Link
          href="/consumer-settlement"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            category === "consumer-settlement"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Consumer Settlement
        </Link>
        <Link
          href="/no-receipt-claims"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            category === "no-receipt-claims"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          No Receipt
        </Link>
        <Link
          href="/paypal-settlements"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            category === "paypal-settlements"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          PayPal
        </Link>
        <Link
          href="/expiring-soon"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            category === "expiring-soon"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Expiring Soon
        </Link>
      </div>

      {/* Claims List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClaims.map((claim) => {
          const daysLeft = getDaysUntilDeadline(claim.deadline);

          return (
            <Link
              key={claim.id}
              href={`/${claim.country.toLowerCase()}/${claim.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getCountryFlag(claim.country)}</span>
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

      {filteredClaims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No active claims found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
