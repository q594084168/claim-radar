import Link from "next/link";
import { ClaimCard } from "@/components/ClaimCard";

// Mock data for V1.5 - only PayPal/Venmo claims
const MOCK_CLAIMS = [
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
    id: "6",
    slug: "canada-telecom-settlement",
    title: "Canadian Telecom Overcharge Settlement",
    category: "consumer-settlement",
    deadline: "2026-10-15",
    estimatedMin: 40,
    estimatedMax: 150,
    needReceipt: true,
    payPaypal: false,
    scoreTotal: 72,
  },
];

export default function FastestPaymentsSettlementsPage() {
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
            Fastest Payments Settlements
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ⚡ Fastest Paying Class Action Settlements (PayPal & Venmo)
        </h1>
        <p className="text-gray-500 mt-2">
          Don't wait months for a check. These settlements pay via PayPal or
          Venmo for the fastest access to your money.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {MOCK_CLAIMS.length}
          </div>
          <div className="text-sm text-gray-500">Fast Pay Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {MOCK_CLAIMS.filter((c) => c.payPaypal).length}
          </div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {MOCK_CLAIMS.filter((c) => !c.needReceipt).length}
          </div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">1-2 weeks</div>
          <div className="text-sm text-gray-500">Avg. PayPal Speed</div>
        </div>
      </div>

      {/* Why PayPal Section */}
      <section className="bg-blue-50 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          💳 Why Choose PayPal Settlements?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Get paid in 1-2 weeks instead of waiting months for a check.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📬</span>
            <div>
              <h3 className="font-semibold text-gray-900">No Mail Delays</h3>
              <p className="text-sm text-gray-600">
                No risk of lost or stolen checks in the mail.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h3 className="font-semibold text-gray-900">Instant Access</h3>
              <p className="text-sm text-gray-600">
                Use your money immediately or transfer to your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Claims List */}
      <div className="space-y-6 mb-12">
        {MOCK_CLAIMS.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
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
              How fast are PayPal settlements?
            </h3>
            <p className="text-gray-600">
              PayPal payments are typically processed within 1-2 weeks after
              claim approval, compared to 4-8 weeks for check payments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Do I need a PayPal account?
            </h3>
            <p className="text-gray-600">
              Yes, you'll need a PayPal account to receive payment. If you don't
              have one, you can create a free account at paypal.com.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Are there fees for receiving PayPal payments?
            </h3>
            <p className="text-gray-600">
              No, settlement payments via PayPal are typically fee-free. You
              receive the full settlement amount.
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
              Biggest payouts available
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
          <Link
            href="/us/no-receipt-claims"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">
              ✅ No Receipt Claims
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Easy claims without receipts
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
