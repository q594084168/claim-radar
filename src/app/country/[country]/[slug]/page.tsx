import Link from "next/link";
import { ClaimFAQ } from "@/components/FAQ";
import { ClaimTimeline } from "@/components/Timeline";
import { ClaimStructuredData } from "@/components/StructuredData";
import { ClaimPageLinks } from "@/components/InternalLinks";

// Mock data for V1
const MOCK_CLAIMS: Record<string, any> = {
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
    officialUrl: "https://www.facebookbipaclassactionsettlement.com",
    sourceName: "Epiq",
    scorePayout: 35,
    scoreDifficulty: 20,
    scoreCoverage: 15,
    scoreSpeed: 10,
    scoreRisk: 8,
    scoreTotal: 88,
    eligibleStates: [],
    summary:
      "Facebook users in Illinois may be eligible for payment if they used Facebook's facial recognition features. No receipt required - just proof of Facebook account.",
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
    officialUrl: "https://www.tmobilesettlement.com",
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

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
}

function getCountryName(country: string): string {
  const names: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    AU: "Australia",
  };
  return names[country] || country;
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

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
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
            href="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(claim.deadline);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Structured Data */}
      <ClaimStructuredData
        title={claim.title}
        description={claim.description}
        url={`https://claimradar.com/${claim.country.toLowerCase()}/${claim.slug}`}
        datePublished={claim.openDate}
        dateModified={new Date().toISOString()}
        estimatedMin={claim.estimatedMin}
        estimatedMax={claim.estimatedMax}
        deadline={claim.deadline}
      />

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
            <Link
              href={`/${claim.country.toLowerCase()}`}
              className="hover:text-gray-700"
            >
              {getCountryFlag(claim.country)} {getCountryName(claim.country)}
            </Link>
          </li>
          <li>→</li>
          <li>
            <Link
              href={`/${claim.country.toLowerCase()}/${claim.category}`}
              className="hover:text-gray-700"
            >
              {getCategoryLabel(claim.category)}
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
                  <span className="text-3xl">
                    {getCountryFlag(claim.country)}
                  </span>
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

          {/* Key Info */}
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
                      ? `All ${getCountryName(claim.country)}`
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
              <RequirementItem
                met={!claim.needReceipt}
                label="No receipt required"
              />
              <RequirementItem
                met={!claim.needPurchase}
                label="No proof of purchase needed"
              />
              <RequirementItem
                met={!claim.needAccount}
                label={claim.needAccount ? `Need ${claim.accountType} account` : "No account required"}
              />
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🤖 AI Summary
            </h2>
            <p className="text-gray-700">{claim.summary}</p>
          </div>

          {/* Claim Score Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 Claim Score Breakdown
            </h2>
            <div className="space-y-4">
              <ScoreBar
                label="Payout"
                score={claim.scorePayout}
                max={40}
                color="bg-green-500"
              />
              <ScoreBar
                label="Difficulty"
                score={claim.scoreDifficulty}
                max={25}
                color="bg-blue-500"
              />
              <ScoreBar
                label="Coverage"
                score={claim.scoreCoverage}
                max={15}
                color="bg-purple-500"
              />
              <ScoreBar
                label="Speed"
                score={claim.scoreSpeed}
                max={10}
                color="bg-yellow-500"
              />
              <ScoreBar
                label="Risk"
                score={claim.scoreRisk}
                max={10}
                color="bg-orange-500"
              />
            </div>
          </div>

          {/* Timeline */}
          <ClaimTimeline
            openDate={claim.openDate}
            deadline={claim.deadline}
          />

          {/* FAQ */}
          <div className="mt-6">
            <ClaimFAQ
              claimTitle={claim.title}
              needReceipt={claim.needReceipt}
              payPaypal={claim.payPaypal}
              estimatedMin={claim.estimatedMin}
              estimatedMax={claim.estimatedMax}
            />
          </div>

          {/* Internal Links */}
          <div className="mt-6">
            <ClaimPageLinks />
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
              Apply on Official Site →
            </a>
            <p className="text-xs text-gray-500 text-center">
              You'll be taken to the official settlement website
            </p>

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

          {/* Similar Claims */}
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
                    href={`/${similar.country.toLowerCase()}/${similar.slug}`}
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

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xl ${met ? "text-green-500" : "text-red-500"}`}>
        {met ? "✅" : "❌"}
      </span>
      <span className={met ? "text-gray-700" : "text-gray-500"}>{label}</span>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  max,
  color,
}: {
  label: string;
  score: number;
  max: number;
  color: string;
}) {
  const percentage = (score / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {score}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
