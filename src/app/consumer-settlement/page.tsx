import Link from "next/link";

// Mock data for V1.5
const MOCK_CLAIMS = [
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
    scoreTotal: 72,
  },
];

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function ConsumerSettlementPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Home
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-5xl">🛒</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Consumer Settlements
            </h1>
            <p className="text-gray-500 mt-1">
              Refunds and settlements for defective products or services.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {MOCK_CLAIMS.length}
          </div>
          <div className="text-sm text-gray-500">Active Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {MOCK_CLAIMS.filter((c) => !c.needReceipt).length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {MOCK_CLAIMS.filter((c) => c.payPaypal).length}
          </div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${Math.min(...MOCK_CLAIMS.map((c) => c.estimatedMin))}-
            {Math.max(...MOCK_CLAIMS.map((c) => c.estimatedMax))}
          </div>
          <div className="text-sm text-gray-500">Payout Range</div>
        </div>
      </div>

      {/* Claims List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {MOCK_CLAIMS.map((claim) => {
          const daysLeft = getDaysUntilDeadline(claim.deadline);

          return (
            <Link
              key={claim.id}
              href={`/${claim.country.toLowerCase()}/${claim.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">
                  {claim.country === "CA" ? "🇨🇦" : "🇺🇸"}
                </span>
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
              </div>
            </Link>
          );
        })}
      </div>

      {/* Internal Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔗 Related Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/data-breach"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">🔓 Data Breach</h3>
            <p className="text-sm text-gray-500 mt-1">
              Compensation for data breaches
            </p>
          </Link>
          <Link
            href="/class-action"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">⚖️ Class Action</h3>
            <p className="text-sm text-gray-500 mt-1">
              Group lawsuits against corporations
            </p>
          </Link>
          <Link
            href="/no-receipt-claims"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ✅ No Receipt Claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Claims without receipt requirements
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
