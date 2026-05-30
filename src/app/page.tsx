import Link from "next/link";

// Mock data for V1 - will be replaced with database queries
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
    scoreTotal: 82,
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
    scoreTotal: 78,
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
    scoreTotal: 85,
    status: "active",
  },
  {
    id: "5",
    slug: "equifax-settlement",
    title: "Equifax Data Breach Settlement",
    country: "US",
    category: "data-breach",
    deadline: "2026-12-31",
    estimatedMin: 20,
    estimatedMax: 125,
    needReceipt: false,
    payCheck: true,
    scoreTotal: 72,
    status: "active",
  },
  {
    id: "6",
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

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
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

export default function Home() {
  const latestClaims = MOCK_CLAIMS.slice(0, 4);
  const expiringSoon = [...MOCK_CLAIMS]
    .sort(
      (a, b) =>
        getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline)
    )
    .slice(0, 4);
  const topScored = [...MOCK_CLAIMS]
    .sort((a, b) => b.scoreTotal - a.scoreTotal)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Find Settlements
          <br />
          <span className="text-blue-600">You Can Actually Claim</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          AI-powered discovery of class action settlements, data breach claims,
          and consumer refunds. Know exactly what you qualify for.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <a
              href="/us"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              🇺🇸 Browse US Claims
            </a>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <a
              href="/ca"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              🇨🇦 Browse Canada Claims
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {MOCK_CLAIMS.length}
          </div>
          <div className="text-sm text-gray-500">Active Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">$30-200</div>
          <div className="text-sm text-gray-500">Avg. Payout Range</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">3</div>
          <div className="text-sm text-gray-500">Countries</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">85%</div>
          <div className="text-sm text-gray-500">No Receipt Needed</div>
        </div>
      </div>

      {/* Expiring Soon */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            ⏰ Expiring Soon
          </h2>
          <a
            href="/expiring-soon"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expiringSoon.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </section>

      {/* Top Scored */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            ⭐ Best Claims (By Score)
          </h2>
          <a
            href="/us"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topScored.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </section>

      {/* By Country */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🌎 Browse by Country
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/us"
            className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-5xl mb-4">🇺🇸</div>
            <h3 className="text-xl font-bold text-gray-900">United States</h3>
            <p className="text-gray-500 mt-2">
              Class actions, data breaches, consumer settlements
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              {MOCK_CLAIMS.filter((c) => c.country === "US").length} active
              claims →
            </div>
          </a>
          <a
            href="/ca"
            className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-5xl mb-4">🇨🇦</div>
            <h3 className="text-xl font-bold text-gray-900">Canada</h3>
            <p className="text-gray-500 mt-2">
              Class actions, privacy breaches, consumer refunds
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              {MOCK_CLAIMS.filter((c) => c.country === "CA").length} active
              claims →
            </div>
          </a>
          <a
            href="/au"
            className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-5xl mb-4">🇦🇺</div>
            <h3 className="text-xl font-bold text-gray-900">Australia</h3>
            <p className="text-gray-500 mt-2">
              Class actions, consumer protections
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              {MOCK_CLAIMS.filter((c) => c.country === "AU").length} active
              claims →
            </div>
          </a>
        </div>
      </section>

      {/* By Category */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📂 Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/data-breach"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">🔓</div>
            <h3 className="text-lg font-bold text-gray-900">Data Breach</h3>
            <p className="text-gray-500 text-sm mt-1">
              Compensation for compromised personal data
            </p>
          </a>
          <a
            href="/class-action"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="text-lg font-bold text-gray-900">Class Action</h3>
            <p className="text-gray-500 text-sm mt-1">
              Group lawsuits against corporations
            </p>
          </a>
          <a
            href="/consumer-settlement"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-lg font-bold text-gray-900">
              Consumer Settlement
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Refunds for defective products or services
            </p>
          </a>
        </div>
      </section>

      {/* No Receipt Claims - SEO */}
      <section className="mb-16 bg-blue-50 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎯 Claims That Don&apos;t Require Receipts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Many settlements don&apos;t require proof of purchase. Browse claims
            you can apply for with just your name and address.
          </p>
          <a
            href="/no-receipt-claims"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse No-Receipt Claims →
          </a>
        </div>
      </section>

      {/* PayPal Claims - SEO */}
      <section className="mb-16 bg-purple-50 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            💰 Get Paid via PayPal
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Skip the wait for a check. These settlements pay via PayPal for
            faster access to your money.
          </p>
          <a
            href="/paypal-settlements"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Browse PayPal Claims →
          </a>
        </div>
      </section>
    </div>
  );
}

function ClaimCard({ claim }: { claim: (typeof MOCK_CLAIMS)[0] }) {
  const daysLeft = getDaysUntilDeadline(claim.deadline);

  return (
    <Link
      href={`/claim/${claim.slug}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{getCountryFlag(claim.country)}</span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.scoreTotal)}`}
        >
          {claim.scoreTotal}/100
        </span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
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
            className={
              daysLeft < 30 ? "text-red-600 font-medium" : ""
            }
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
}
