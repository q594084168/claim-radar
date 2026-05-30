import Link from "next/link";
import { ClaimCard } from "@/components/ClaimCard";

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

export default function BestSettlements2026Page() {
  // Sort by score
  const sortedClaims = [...MOCK_CLAIMS].sort(
    (a, b) => b.scoreTotal - a.scoreTotal
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
            Best Settlements 2026
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ⭐ Best Class Action Settlements in 2026
        </h1>
        <p className="text-gray-500 mt-2">
          Top-rated settlements based on our Claim Score algorithm. These
          offers the best combination of payout, ease of application, and
          coverage.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {sortedClaims.length}
          </div>
          <div className="text-sm text-gray-500">Top Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {sortedClaims.filter((c) => c.scoreTotal >= 80).length}
          </div>
          <div className="text-sm text-gray-500">Excellent Score</div>
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
        {sortedClaims.map((claim, index) => (
          <ClaimCard
            key={claim.id}
            claim={claim}
            showRank={index + 1}
          />
        ))}
      </div>

      {/* FAQ */}
      <section className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What makes a settlement "best"?
            </h3>
            <p className="text-gray-600">
              Our Claim Score considers payout amount, application difficulty,
              geographic coverage, payment speed, and risk factors to determine
              the overall quality of a settlement.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              How is the Claim Score calculated?
            </h3>
            <p className="text-gray-600">
              The score is based on 5 dimensions: Payout (40%), Difficulty
              (25%), Coverage (15%), Speed (10%), and Risk (10%). Higher scores
              indicate better opportunities.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Should I only apply for high-score settlements?
            </h3>
            <p className="text-gray-600">
              Not necessarily. Even lower-scored settlements can be worth
              applying for if you meet the eligibility requirements. The score
              helps prioritize but shouldn't be the only factor.
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
            href="/us/highest-paying-settlements"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              💰 Highest Paying
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Settlements with the biggest payouts
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
              Get paid quickly with PayPal
            </p>
          </Link>
          <Link
            href="/us/no-receipt-claims"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ✅ No Receipt Claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Easy claims without receipt requirements
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
