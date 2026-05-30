"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RealClaim {
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

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
}

export default function RealHomePage() {
  const [claims, setClaims] = useState<RealClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchRealClaims();
  }, []);

  const fetchRealClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/real-claims");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setClaims(data.claims);
      setLastUpdated(data.meta.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading real settlement data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Data</h1>
          <p className="mt-2 text-gray-500">{error}</p>
          <button
            onClick={fetchRealClaims}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const usClaims = claims.filter((c) => c.country === "US");
  const caClaims = claims.filter((c) => c.country === "CA");
  const noReceiptClaims = claims.filter((c) => !c.needReceipt);
  const paypalClaims = claims.filter((c) => c.payPaypal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Find Real Settlements
          <br />
          <span className="text-blue-600">You Can Actually Claim</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Real-time data from TopClassActions, ClassAction.org, and official settlement websites.
          No fake claims, no outdated information.
        </p>
        {lastUpdated && (
          <p className="mt-2 text-sm text-gray-400">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <button
              onClick={fetchRealClaims}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{claims.length}</div>
          <div className="text-sm text-gray-500">Real Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{noReceiptClaims.length}</div>
          <div className="text-sm text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{paypalClaims.length}</div>
          <div className="text-sm text-gray-500">PayPal</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">2</div>
          <div className="text-sm text-gray-500">Data Sources</div>
        </div>
      </div>

      {/* Data Sources */}
      <section className="mb-16 bg-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📡 Real Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📰</span>
            <div>
              <h3 className="font-semibold text-gray-900">TopClassActions</h3>
              <p className="text-sm text-gray-600">
                Leading class action settlement news and information
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <h3 className="font-semibold text-gray-900">ClassAction.org</h3>
              <p className="text-sm text-gray-600">
                Comprehensive class action lawsuit database
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* US Claims */}
      {usClaims.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🇺🇸 US Settlements ({usClaims.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usClaims.slice(0, 6).map((claim) => (
              <RealClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </section>
      )}

      {/* Canada Claims */}
      {caClaims.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🇨🇦 Canadian Settlements ({caClaims.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caClaims.slice(0, 6).map((claim) => (
              <RealClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </section>
      )}

      {/* No Receipt Claims */}
      {noReceiptClaims.length > 0 && (
        <section className="mb-16 bg-green-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ No Receipt Required ({noReceiptClaims.length})
          </h2>
          <p className="text-gray-600 mb-6">
            These settlements don't require receipts - just your name and address.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noReceiptClaims.slice(0, 3).map((claim) => (
              <RealClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="mt-16 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">
          ⚠️ Important Disclaimer
        </h3>
        <p className="text-sm text-yellow-700">
          This information is collected from public sources (TopClassActions, ClassAction.org).
          Always verify settlement details on official websites before submitting claims.
          ClaimRadar is not responsible for the accuracy of third-party information.
        </p>
      </section>
    </div>
  );
}

function RealClaimCard({ claim }: { claim: RealClaim }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{getCountryFlag(claim.country)}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {claim.sourceName}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {claim.title}
      </h3>

      <p className="text-sm text-gray-500 mb-4 line-clamp-3">
        {claim.description}
      </p>

      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>📁</span>
          <span>{getCategoryLabel(claim.category)}</span>
        </div>

        {claim.estimatedMin && claim.estimatedMax && (
          <div className="flex items-center gap-2">
            <span>💵</span>
            <span>
              ${claim.estimatedMin} - ${claim.estimatedMax}
            </span>
          </div>
        )}

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

      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href={claim.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View on {claim.sourceName} →
        </a>
      </div>
    </div>
  );
}
