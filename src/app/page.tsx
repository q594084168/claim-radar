"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  officialUrl: string;
  sourceName: string;
  score: {
    total: number;
  };
  tags: {
    tags: string[];
  };
}

interface Stats {
  total: number;
  byCountry: Record<string, number>;
  byCategory: Record<string, number>;
  byTag: Record<string, number>;
  avgScore: number;
  noReceiptCount: number;
  paypalCount: number;
  highValueCount: number;
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "data-breach": "Data Breach",
    "class-action": "Class Action",
    "consumer-settlement": "Consumer",
  };
  return labels[category] || category;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export default function HomePage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch("/api/enhanced-claims?stats=true");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats({
          ...statsData.stats,
          highValueCount: statsData.stats.byTag?.["high-value"] || 0,
        });
      }

      // Fetch claims
      const claimsRes = await fetch("/api/enhanced-claims?limit=12");
      const claimsData = await claimsRes.json();
      if (claimsData.success) {
        setClaims(claimsData.claims);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
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
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-500">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Find Settlements
          <br />
          <span className="text-blue-600">You Can Actually Claim</span>
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Real-time data from TopClassActions, Epiq, Kroll, Angeion, and JND.
          No fake claims, no outdated information.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            📊 View Dashboard
          </Link>
          <button onClick={fetchData} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Real Claims</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.noReceiptCount}</div>
            <div className="text-sm text-gray-500">No Receipt</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.highValueCount}</div>
            <div className="text-sm text-gray-500">High Value</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.avgScore}</div>
            <div className="text-sm text-gray-500">Avg Score</div>
          </div>
        </div>
      )}

      {/* Claims Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📋 Latest Claims</h2>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getCountryFlag(claim.country)}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.score?.total || 0)}`}>
                  {claim.score?.total || 0}/100
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                {claim.title}
              </h3>
              <div className="space-y-1 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <span>📁</span>
                  <span>{getCategoryLabel(claim.category)}</span>
                </div>
                {claim.estimatedMin && claim.estimatedMax && (
                  <div className="flex items-center gap-2">
                    <span>💵</span>
                    <span>${claim.estimatedMin} - ${claim.estimatedMax}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {claim.needReceipt ? (
                    <span className="text-orange-500">📋 Receipt needed</span>
                  ) : (
                    <span className="text-green-500">✅ No receipt</span>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <Link
                  href={`/claim-detail/${claim.slug}`}
                  className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/api/enhanced-claims?noReceipt=true" className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-green-800 mb-2">✅ No Receipt Claims</h3>
          <p className="text-sm text-green-600">Browse claims that don't require receipts</p>
        </Link>
        <Link href="/api/enhanced-claims?highValue=true" className="bg-purple-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-purple-800 mb-2">💰 High Value Claims</h3>
          <p className="text-sm text-purple-600">Find claims with highest payouts</p>
        </Link>
        <Link href="/api/enhanced-claims?tag=data-breach" className="bg-red-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-red-800 mb-2">🔓 Data Breach Claims</h3>
          <p className="text-sm text-red-600">Browse data breach settlements</p>
        </Link>
      </div>
    </div>
  );
}
