import Link from "next/link";

// Mock data for V1.5 - claims expiring within 30 days
const MOCK_CLAIMS = [
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
    payPaypal: false,
    payCheck: true,
    scoreTotal: 65,
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

export default function ExpiringSoonPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Home
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-5xl">⏰</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expiring Soon
            </h1>
            <p className="text-gray-500 mt-1">
              Claims with deadlines approaching within 30 days. Don't miss out!
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {MOCK_CLAIMS.length}
          </div>
          <div className="text-sm text-gray-500">Expiring Soon</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {MOCK_CLAIMS.filter((c) => !c.needReceipt).length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${Math.min(...MOCK_CLAIMS.map((c) => c.estimatedMin))}-
            {Math.max(...MOCK_CLAIMS.map((c) => c.estimatedMax))}
          </div>
          <div className="text-sm text-gray-500">Payout Range</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.min(...MOCK_CLAIMS.map((c) => getDaysUntilDeadline(c.deadline)))} days
          </div>
          <div className="text-sm text-gray-500">Soonest Deadline</div>
        </div>
      </div>

      {/* Urgency Banner */}
      <section className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h2 className="text-lg font-bold text-red-800 mb-2">
              Don't Miss These Deadlines!
            </h2>
            <p className="text-red-700">
              These settlements are closing soon. File your claim now before it's
              too late. Once the deadline passes, you can no longer apply.
            </p>
          </div>
        </div>
      </section>

      {/* Claims List */}
      <div className="space-y-6 mb-12">
        {MOCK_CLAIMS.map((claim) => {
          const daysLeft = getDaysUntilDeadline(claim.deadline);

          return (
            <Link
              key={claim.id}
              href={`/${claim.country.toLowerCase()}/${claim.slug}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    daysLeft <= 7
                      ? "bg-red-500"
                      : daysLeft <= 14
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                  }`}
                >
                  {daysLeft}d
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {claim.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.scoreTotal)}`}
                    >
                      {claim.scoreTotal}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-500">Deadline</div>
                      <div className="font-medium text-red-600">
                        {new Date(claim.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Payout</div>
                      <div className="font-medium text-green-600">
                        ${claim.estimatedMin} - ${claim.estimatedMax}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Receipt</div>
                      <div className="font-medium">
                        {claim.needReceipt ? (
                          <span className="text-orange-500">Required</span>
                        ) : (
                          <span className="text-green-500">Not Required</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Payment</div>
                      <div className="font-medium">
                        {claim.payPaypal ? "PayPal" : "Check"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Internal Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔗 Related Pages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/no-receipt-claims"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ✅ No Receipt Claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Easy claims without receipts
            </p>
          </Link>
          <Link
            href="/us/highest-paying-settlements"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              💰 Highest Paying Claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Find the biggest payouts
            </p>
          </Link>
          <Link
            href="/us/best-settlements-2026"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ⭐ Best Settlements 2026
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Top-rated by Claim Score
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
