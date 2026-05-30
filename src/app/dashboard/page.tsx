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
  status: string;
}

interface Stats {
  total: number;
  bySource: Record<string, number>;
  byCountry: Record<string, number>;
  byCategory: Record<string, number>;
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

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "data-breach": "bg-red-100 text-red-800",
    "class-action": "bg-blue-100 text-blue-800",
    "consumer-settlement": "bg-green-100 text-green-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/all-claims?refresh=true");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setClaims(data.claims);
      setStats(data.stats);
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
          <p className="mt-2 text-sm text-gray-400">
            Fetching from TopClassActions, Epiq, Kroll, Angeion, JND...
          </p>
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
            onClick={fetchClaims}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredClaims =
    filter === "all"
      ? claims
      : claims.filter((c) => c.sourceName?.toLowerCase().includes(filter));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          📊 ClaimRadar Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Real-time settlement data from Claims Administrators and news sources
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Claims</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.keys(stats.bySource).length}
            </div>
            <div className="text-sm text-gray-500">Data Sources</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.byCountry?.US || 0}
            </div>
            <div className="text-sm text-gray-500">US Claims</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.byCountry?.CA || 0}
            </div>
            <div className="text-sm text-gray-500">Canada Claims</div>
          </div>
        </div>
      )}

      {/* Data Sources */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📡 Data Sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.bySource).map(([source, count]) => (
              <button
                key={source}
                onClick={() => setFilter(source === filter ? "all" : source)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  filter === source
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="font-semibold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">{source}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📁 Categories</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <span
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}
              >
                {getCategoryLabel(category)}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Claims List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            📋 {filter === "all" ? "All Claims" : `${filter} Claims`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredClaims.length})
            </span>
          </h2>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Show All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClaims.slice(0, 12).map((claim, index) => (
            <div
              key={claim.id || index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getCountryFlag(claim.country)}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {claim.sourceName}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                {claim.title}
              </h3>

              <p className="text-xs text-gray-500 mb-3 line-clamp-3">
                {claim.description}
              </p>

              <div className="space-y-1 text-xs text-gray-500">
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
                    <span className="text-green-500">✅ No receipt</span>
                  )}
                </div>

                {claim.payPaypal && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">💳 PayPal</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <a
                  href={claim.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchClaims}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Disclaimer:</strong> This data is collected from public sources
          (TopClassActions, Epiq, Kroll, Angeion, JND). Always verify settlement
          details on official websites before submitting claims.
        </p>
      </div>
    </div>
  );
}
