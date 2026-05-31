"use client";

import { useState, useEffect, useMemo } from "react";
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
  payCheck: boolean;
  payBank: boolean;
  officialUrl: string;
  sourceName: string;
  status: string;
  score?: { total: number };
  tags?: { tags: string[] };
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

function formatPayout(min: number | null, max: number | null): string {
  if (!min && !max) return "Varies";
  if (min === max) return `$${min}`;
  if (min && max) return `$${min} - $${max}`;
  if (min) return `From $${min}`;
  return `Up to $${max}`;
}

export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Check localStorage cache first
      const cached = localStorage.getItem("claimradar_data");
      const cacheTime = localStorage.getItem("claimradar_cache_time");
      const now = Date.now();

      if (cached && cacheTime && (now - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000) {
        setClaims(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // Fetch from static-data API
      const response = await fetch("/api/static-data");
      const data = await response.json();

      if (data.success && data.claims && data.claims.length > 0) {
        setClaims(data.claims);
        localStorage.setItem("claimradar_data", JSON.stringify(data.claims));
        localStorage.setItem("claimradar_cache_time", now.toString());
      } else {
        setError("No data available");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: claims.length,
      bySource: claims.reduce((acc, c) => {
        acc[c.sourceName] = (acc[c.sourceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byCountry: claims.reduce((acc, c) => {
        acc[c.country] = (acc[c.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byCategory: claims.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      noReceiptCount: claims.filter((c) => !c.needReceipt).length,
      highValueCount: claims.filter((c) => (c.estimatedMax || 0) >= 500).length,
      avgScore: claims.length > 0
        ? Math.round(claims.reduce((sum, c) => sum + (c.score?.total || 0), 0) / claims.length)
        : 0,
    };
  }, [claims]);

  // Filter claims
  const filteredClaims = useMemo(() => {
    if (filter === "all") return claims;
    return claims.filter((c) => c.sourceName === filter);
  }, [claims, filter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading data...</p>
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
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">📊 Dashboard</h1>
        <p className="text-gray-500 mt-2">
          {stats.total} claims from ClaimDepot
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Claims</div>
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

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📁 Categories</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <span
              key={category}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              {getCategoryLabel(category)}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Claims List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            📋 Claims ({filteredClaims.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClaims.slice(0, 18).map((claim) => (
            <div key={claim.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xl">{getCountryFlag(claim.country)}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.score?.total || 0)}`}>
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
                <div className="flex items-center gap-2">
                  <span>💵</span>
                  <span>{formatPayout(claim.estimatedMin, claim.estimatedMax)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {claim.needReceipt ? (
                    <span className="text-orange-500">📋 Receipt needed</span>
                  ) : (
                    <span className="text-green-500">✅ No receipt</span>
                  )}
                </div>
              </div>

              <Link
                href={`/claim-detail/${claim.slug}`}
                className="w-full flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-50"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => {
            localStorage.removeItem("claimradar_data");
            localStorage.removeItem("claimradar_cache_time");
            fetchData();
          }}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}
