import Link from "next/link";
import { US_STATES } from "@/data/us-states";

// Mock data for V1.5 - will be replaced with database queries
const MOCK_CLAIMS: Array<{
  id: string;
  slug: string;
  title: string;
  country: string;
  category: string;
  deadline: string;
  estimatedMin: number;
  estimatedMax: number;
  needReceipt: boolean;
  payPaypal?: boolean;
  payBank?: boolean;
  payCheck?: boolean;
  scoreTotal: number;
  eligibleStates: string[];
}> = [
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
    eligibleStates: ["IL", "CA", "NY", "TX", "FL"],
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
    eligibleStates: [], // All states
  },
  {
    id: "3",
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
    eligibleStates: [], // All states
  },
  {
    id: "4",
    slug: "california-privacy-settlement",
    title: "California Privacy Settlement",
    country: "US",
    category: "class-action",
    deadline: "2026-10-15",
    estimatedMin: 40,
    estimatedMax: 120,
    needReceipt: false,
    payPaypal: true,
    scoreTotal: 82,
    eligibleStates: ["CA"],
  },
  {
    id: "5",
    slug: "texas-consumer-settlement",
    title: "Texas Consumer Protection Settlement",
    country: "US",
    category: "consumer-settlement",
    deadline: "2026-12-01",
    estimatedMin: 35,
    estimatedMax: 90,
    needReceipt: true,
    payCheck: true,
    scoreTotal: 65,
    eligibleStates: ["TX"],
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

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateInfo = US_STATES.find(
    (s) =>
      s.code.toLowerCase() === state.toLowerCase() ||
      s.name.toLowerCase().replace(/\s+/g, "-") === state.toLowerCase()
  );

  if (!stateInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">State Not Found</h1>
          <p className="mt-4 text-gray-500">
            The state you're looking for doesn't exist.
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

  // Filter claims eligible for this state
  const stateClaims = MOCK_CLAIMS.filter(
    (claim) =>
      claim.eligibleStates.length === 0 ||
      claim.eligibleStates.includes(stateInfo.code)
  );

  const noReceiptClaims = stateClaims.filter((c) => !c.needReceipt);
  const paypalClaims = stateClaims.filter((c) => c.payPaypal);
  const highPayoutClaims = [...stateClaims].sort(
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
          <li className="text-gray-900 font-medium">{stateInfo.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          🏛️ Class Action Settlements in {stateInfo.name}
        </h1>
        <p className="text-gray-500 mt-2">
          Find settlements available to {stateInfo.name} residents. Browse active
          claims, check eligibility, and get paid.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stateClaims.length}
          </div>
          <div className="text-sm text-gray-500">Active Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {noReceiptClaims.length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {paypalClaims.length}
          </div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${Math.min(...stateClaims.map((c) => c.estimatedMin))}-
            {Math.max(...stateClaims.map((c) => c.estimatedMax))}
          </div>
          <div className="text-sm text-gray-500">Payout Range</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/us/${stateInfo.code.toLowerCase()}/no-receipt`}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200"
        >
          ✅ No Receipt Claims
        </Link>
        <Link
          href={`/us/${stateInfo.code.toLowerCase()}/paypal`}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200"
        >
          💳 PayPal Claims
        </Link>
        <Link
          href={`/us/${stateInfo.code.toLowerCase()}/highest-paying`}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200"
        >
          💰 Highest Paying
        </Link>
      </div>

      {/* Claims List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stateClaims.map((claim) => {
          const daysLeft = getDaysUntilDeadline(claim.deadline);

          return (
            <Link
              key={claim.id}
              href={`/us/${claim.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🇺🇸</span>
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

      {/* FAQ Section */}
      <section className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              How many settlements are available in {stateInfo.name}?
            </h3>
            <p className="text-gray-600">
              Currently, there are {stateClaims.length} active settlements
              available to {stateInfo.name} residents.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Do I need receipts to file a claim?
            </h3>
            <p className="text-gray-600">
              {noReceiptClaims.length} out of {stateClaims.length} claims don't
              require receipts. Look for claims marked with "No receipt needed"
              for easier applications.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              How much money can I get?
            </h3>
            <p className="text-gray-600">
              Payouts range from $
              {Math.min(...stateClaims.map((c) => c.estimatedMin))} to $
              {Math.max(...stateClaims.map((c) => c.estimatedMax))} depending on
              the settlement.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Can I get paid via PayPal?
            </h3>
            <p className="text-gray-600">
              {paypalClaims.length} settlements offer PayPal as a payment method
              for faster access to your money.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="mb-12">
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
              Browse all claims that don't require receipts
            </p>
          </Link>
          <Link
            href="/us/paypal-settlements"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              💳 PayPal Settlements
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Get paid faster with PayPal
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
              Find the highest payout settlements
            </p>
          </Link>
        </div>
      </section>

      {/* Other States */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🗺️ Browse by State
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {US_STATES.slice(0, 12).map((s) => (
            <Link
              key={s.code}
              href={`/us/${s.code.toLowerCase()}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                s.code === stateInfo.code
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
