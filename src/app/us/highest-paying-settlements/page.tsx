import Link from "next/link";

// Mock data for V1.5
const MOCK_CLAIMS = [
  {
    id: "4",
    slug: "capital-one-data-breach",
    title: "Capital One Data Breach Settlement",
    category: "data-breach",
    deadline: "2026-11-01",
    estimatedMin: 50,
    estimatedMax: 200,
    needReceipt: false,
    payBank: true,
    scoreTotal: 90,
  },
  {
    id: "1",
    slug: "facebook-privacy-settlement",
    title: "Facebook Privacy Settlement",
    category: "data-breach",
    deadline: "2026-08-15",
    estimatedMin: 30,
    estimatedMax: 100,
    needReceipt: false,
    payPaypal: true,
    scoreTotal: 88,
  },
  {
    id: "2",
    slug: "t-mobile-data-breach",
    title: "T-Mobile Data Breach Settlement",
    category: "data-breach",
    deadline: "2026-09-30",
    estimatedMin: 25,
    estimatedMax: 75,
    needReceipt: false,
    payPaypal: true,
    scoreTotal: 85,
  },
  {
    id: "5",
    slug: "equifax-settlement",
    title: "Equifax Data Breach Settlement",
    category: "data-breach",
    deadline: "2026-12-31",
    estimatedMin: 20,
    estimatedMax: 125,
    needReceipt: false,
    payCheck: true,
    scoreTotal: 80,
  },
  {
    id: "3",
    slug: "google-location-tracking",
    title: "Google Location Tracking Settlement",
    category: "class-action",
    deadline: "2026-07-20",
    estimatedMin: 15,
    estimatedMax: 50,
    needReceipt: false,
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

export default function HighestPayingSettlementsPage() {
  // Sort by highest payout
  const sortedClaims = [...MOCK_CLAIMS].sort(
    (a, b) => b.estimatedMax - a.estimatedMax
  );

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
          <li className="text-gray-900 font-medium">
            Highest Paying Settlements
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          💰 Highest Paying Class Action Settlements in the US (2026)
        </h1>
        <p className="text-gray-500 mt-2">
          Find the settlements with the biggest payouts. These claims offer the
          highest potential compensation for eligible participants.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            ${Math.max(...sortedClaims.map((c) => c.estimatedMax))}
          </div>
          <div className="text-sm text-gray-500">Highest Payout</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {sortedClaims.length}
          </div>
          <div className="text-sm text-gray-500">High-Value Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {sortedClaims.filter((c) => !c.needReceipt).length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {sortedClaims.filter((c) => c.payPaypal).length}
          </div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-6 mb-12">
        {sortedClaims.map((claim, index) => {
          const daysLeft = getDaysUntilDeadline(claim.deadline);

          return (
            <Link
              key={claim.id}
              href={`/claim/${claim.slug}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  #{index + 1}
                </div>

                {/* Content */}
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
                      <div className="text-sm text-gray-500">
                        Estimated Payout
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ${claim.estimatedMin} - ${claim.estimatedMax}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">
                        {getCategoryLabel(claim.category)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Deadline</div>
                      <div
                        className={`font-medium ${daysLeft < 30 ? "text-red-600" : ""}`}
                      >
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : "Expiring soon"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Requirements</div>
                      <div className="flex flex-wrap gap-1">
                        {claim.needReceipt ? (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            Receipt
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            No Receipt
                          </span>
                        )}
                        {claim.payPaypal && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            PayPal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* FAQ */}
      <section className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is the highest paying settlement in 2026?
            </h3>
            <p className="text-gray-600">
              The Capital One Data Breach Settlement offers the highest
              potential payout at up to $200 per claimant.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              How do I get the maximum payout?
            </h3>
            <p className="text-gray-600">
              To get the maximum payout, file your claim before the deadline,
              provide all required documentation, and follow the official
              instructions carefully.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Are high-paying settlements harder to qualify for?
            </h3>
            <p className="text-gray-600">
              Not necessarily. Many high-paying settlements, like the Capital One
              and T-Mobile settlements, don't require receipts or proof of
              purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔗 Related Pages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/us/no-receipt-claims"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ✅ No Receipt Claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              High-paying claims without receipt requirements
            </p>
          </Link>
          <Link
            href="/us/fastest-payments-settlements"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ⚡ Fastest Payments
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Get paid quickly with PayPal settlements
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
              Top-rated settlements by Claim Score
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
