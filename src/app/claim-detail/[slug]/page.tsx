"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Claim {
  id: string;
  slug: string;
  title: string;
  description: string;
  country: string;
  category: string;
  deadline: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  needReceipt: boolean;
  payPaypal: boolean;
  payCheck: boolean;
  payBank: boolean;
  officialUrl: string;
  sourceName: string;
  publishedAt: string;
  status: string;
  tags: {
    tags: string[];
    seoSlugs: string[];
    categories: string[];
  };
  score: {
    total: number;
    payout: number;
    difficulty: number;
    speed: number;
    ease: number;
    seoValue: number;
  };
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
}

function getCountryName(country: string): string {
  const names: Record<string, string> = { US: "United States", CA: "Canada", AU: "Australia" };
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
  return "Below Average";
}

function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ClaimDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClaim();
  }, [slug]);

  const fetchClaim = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/enhanced-claims?limit=1000`);
      const data = await response.json();

      if (data.success) {
        const found = data.claims.find((c: Claim) => c.slug === slug);
        if (found) {
          setClaim(found);
        } else {
          setError("Claim not found");
        }
      } else {
        setError("Failed to load claim");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load claim");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Claim Not Found</h1>
          <p className="mt-2 text-gray-500">{error}</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = claim.deadline ? getDaysUntilDeadline(claim.deadline) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
          <li>→</li>
          <li><Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link></li>
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
                  <span className="text-3xl">{getCountryFlag(claim.country)}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getCategoryLabel(claim.category)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {claim.sourceName}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{claim.title}</h1>
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getScoreColor(claim.score.total)}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold">{claim.score.total}</div>
                  <div className="text-xs">/100</div>
                  <div className="text-xs mt-1">{getScoreLabel(claim.score.total)}</div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-lg">{claim.description}</p>
          </div>

          {/* Key Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Key Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💵</span>
                <div>
                  <div className="text-sm text-gray-500">Estimated Payout</div>
                  <div className="text-lg font-bold text-gray-900">
                    {claim.estimatedMin && claim.estimatedMax
                      ? `$${claim.estimatedMin} - $${claim.estimatedMax}`
                      : "Varies"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="text-lg font-bold text-gray-900">
                    {claim.deadline
                      ? new Date(claim.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : "Check official site"}
                  </div>
                  {daysLeft !== null && (
                    <div className={`text-sm font-medium ${daysLeft < 30 ? "text-red-600" : "text-gray-500"}`}>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-sm text-gray-500">Coverage</div>
                  <div className="text-lg font-bold text-gray-900">{getCountryName(claim.country)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">💳</span>
                <div>
                  <div className="text-sm text-gray-500">Payment Methods</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {claim.payPaypal && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">PayPal</span>}
                    {claim.payCheck && <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">Check</span>}
                    {claim.payBank && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Bank Transfer</span>}
                    {!claim.payPaypal && !claim.payCheck && !claim.payBank && <span className="text-gray-500">Check official site</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Requirements</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className={`text-xl ${claim.needReceipt ? "text-orange-500" : "text-green-500"}`}>
                  {claim.needReceipt ? "📋" : "✓"}
                </span>
                <span className={claim.needReceipt ? "text-orange-700" : "text-green-700"}>
                  {claim.needReceipt ? "Receipt or proof of purchase required" : "No receipt required"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl text-green-500">✓</span>
                <span className="text-gray-700">Must be a resident of {getCountryName(claim.country)}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl text-green-500">✓</span>
                <span className="text-gray-700">Must meet eligibility requirements (check official site for details)</span>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 How to Apply</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                <span className="text-gray-700">Visit the official settlement website using the link below</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                <span className="text-gray-700">Read the eligibility requirements carefully</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                <span className="text-gray-700">Fill out the claim form with your information</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">4</div>
                <span className="text-gray-700">Submit before the deadline and wait for payment</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Score Breakdown</h2>
            <div className="space-y-4">
              <ScoreBar label="Payout Potential" score={claim.score.payout} max={40} color="bg-green-500" />
              <ScoreBar label="Ease of Application" score={claim.score.difficulty} max={35} color="bg-blue-500" />
              <ScoreBar label="Payment Speed" score={claim.score.speed} max={15} color="bg-yellow-500" />
              <ScoreBar label="Payment Method" score={claim.score.ease} max={10} color="bg-purple-500" />
              <ScoreBar label="SEO Value" score={claim.score.seoValue} max={10} color="bg-orange-500" />
            </div>
          </div>

          {/* Tags */}
          {claim.tags.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🏷️ Tags</h2>
              <div className="flex flex-wrap gap-2">
                {claim.tags.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">❓ Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Am I eligible for this settlement?</h3>
                <p className="text-gray-600">
                  Eligibility requirements vary by settlement. Generally, you must be a resident of {getCountryName(claim.country)} and meet the specific criteria outlined in the settlement. Check the official website for detailed requirements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do I need receipts to file a claim?</h3>
                <p className="text-gray-600">
                  {claim.needReceipt
                    ? "Yes, this settlement requires receipts or proof of purchase. Make sure you have the necessary documentation before applying."
                    : "No, this settlement does not require receipts. You can apply with just your basic information."}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How much money will I receive?</h3>
                <p className="text-gray-600">
                  {claim.estimatedMin && claim.estimatedMax
                    ? `Estimated payouts range from $${claim.estimatedMin} to $${claim.estimatedMax}. The actual amount depends on the number of claims filed and other factors.`
                    : "The payout amount varies depending on the settlement terms and number of claims filed. Check the official website for more details."}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">When will I receive payment?</h3>
                <p className="text-gray-600">
                  Payment timelines vary by settlement. Typically, payments are distributed after the claims deadline and court approval. This can take several months. Check the official website for specific timeline information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How will I receive payment?</h3>
                <p className="text-gray-600">
                  {claim.payPaypal
                    ? "This settlement offers PayPal as a payment method for faster access to your funds."
                    : claim.payBank
                    ? "This settlement offers bank transfer as a payment method."
                    : "Payment methods vary by settlement. Check the official website for available options."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Apply CTA */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to Claim?</h3>
            <a
              href={claim.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mb-4"
            >
              Apply on Official Site →
            </a>
            <p className="text-xs text-gray-500 text-center mb-4">
              You'll be taken to the official settlement website
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>⚠️ Important:</strong> Always verify you're on the official settlement website before submitting personal information.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Quick Facts</h4>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Source</dt>
                  <dd className="font-medium text-gray-900">{claim.sourceName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Published</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(claim.publishedAt).toLocaleDateString()}
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
                <div>
                  <dt className="text-gray-500">Country</dt>
                  <dd className="font-medium text-gray-900">
                    {getCountryFlag(claim.country)} {getCountryName(claim.country)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Category</dt>
                  <dd className="font-medium text-gray-900">{getCategoryLabel(claim.category)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Related Claims */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Claims</h3>
            <p className="text-sm text-gray-500 mb-4">
              Browse more claims in the {getCategoryLabel(claim.category)} category
            </p>
            <Link
              href={`/api/enhanced-claims?category=${claim.category}`}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View All {getCategoryLabel(claim.category)} Claims →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max, color }: { label: string; score: number; max: number; color: string }) {
  const percentage = (score / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{score}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
