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

// Categories from ClaimDepot
const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "📁" },
  { id: "data-breach", name: "Data Breach", icon: "🔓" },
  { id: "class-action", name: "Class Action", icon: "⚖️" },
  { id: "consumer-settlement", name: "Consumer", icon: "🛒" },
  { id: "antitrust", name: "Antitrust", icon: "🏛️" },
  { id: "privacy", name: "Privacy", icon: "🔒" },
  { id: "securities", name: "Securities", icon: "📈" },
  { id: "labor", name: "Labor", icon: "👷" },
  { id: "insurance", name: "Insurance", icon: "🛡️" },
];

// Status filters from ClaimDepot
const STATUS_FILTERS = [
  { id: "all", name: "All Status", icon: "📋" },
  { id: "open", name: "Open for Claims", icon: "✅" },
  { id: "pending", name: "Pending Court Approval", icon: "⏳" },
  { id: "approved", name: "Settlement Approved", icon: "✓" },
];

// Proof required filters
const PROOF_FILTERS = [
  { id: "all", name: "All Claims", icon: "📋" },
  { id: "no-proof", name: "No Proof Required", icon: "✅" },
  { id: "proof", name: "Proof Required", icon: "📄" },
];

function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  const entities: Record<string, string> = {
    "&#8217;": "'", "&#8216;": "'", "&#8220;": '"', "&#8221;": '"',
    "&#8211;": "–", "&#8212;": "—", "&#038;": "&", "&amp;": "&",
    "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'", "&nbsp;": " ",
  };
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }
  return decoded;
}

function formatPayout(min: number | null, max: number | null): string {
  if (!min && !max) return "Varies";
  if (min === max) return `$${min}`;
  if (min && max) return `$${min} - $${max}`;
  if (min) return `From $${min}`;
  return `Up to $${max}`;
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺" };
  return flags[country] || "🌍";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Open for Claims</span>;
    case "pending":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
    case "approved":
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Approved</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  }
}

export default function HomePage() {
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProof, setSelectedProof] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Check localStorage cache first (7 days)
      const cached = localStorage.getItem("claimradar_data");
      const cacheTime = localStorage.getItem("claimradar_cache_time");
      const now = Date.now();

      if (cached && cacheTime && (now - parseInt(cacheTime)) < 7 * 24 * 60 * 60 * 1000) {
        setAllClaims(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // Fetch from Supabase database
      const response = await fetch("/api/supabase-direct?limit=500");
      const data = await response.json();

      if (data.success && data.claims && data.claims.length > 0) {
        setAllClaims(data.claims);
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

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return allClaims.filter((claim) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = claim.title?.toLowerCase().includes(query);
        const descMatch = claim.description?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && claim.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && claim.status !== selectedStatus) {
        return false;
      }

      // Proof filter
      if (selectedProof === "no-proof" && claim.needReceipt) return false;
      if (selectedProof === "proof" && !claim.needReceipt) return false;

      // Country filter
      if (selectedCountry !== "all" && claim.country !== selectedCountry) {
        return false;
      }

      return true;
    });
  }, [allClaims, searchQuery, selectedCategory, selectedStatus, selectedProof, selectedCountry]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: allClaims.length,
      noProofCount: allClaims.filter((c) => !c.needReceipt).length,
      openCount: allClaims.filter((c) => c.status === "active").length,
      avgScore: allClaims.length > 0
        ? Math.round(allClaims.reduce((sum, c) => sum + (c.score?.total || 0), 0) / allClaims.length)
        : 0,
    };
  }, [allClaims]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedProof("all");
    setSelectedCountry("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedStatus !== "all" || selectedProof !== "all" || selectedCountry !== "all";

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading settlement data...</p>
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Find Settlements <span className="text-blue-600">You Can Claim</span>
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Browse {stats.total} active settlements. Filter by category, proof requirements, and more.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.noProofCount}</div>
          <div className="text-sm text-gray-500">No Proof Required</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.openCount}</div>
          <div className="text-sm text-gray-500">Open for Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.avgScore}</div>
          <div className="text-sm text-gray-500">Avg Score</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search settlements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Proof Required Filter (Primary) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">📄 Proof Required</label>
            <select
              value={selectedProof}
              onChange={(e) => setSelectedProof(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {PROOF_FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.icon} {filter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">📁 Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">📋 Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.icon} {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">🌍 Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">🌍 All Countries</option>
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="AU">🇦🇺 Australia</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200"
            >
              Clear All ✕
            </button>
            <span className="text-sm text-gray-500">
              Showing {filteredClaims.length} of {allClaims.length} claims
            </span>
          </div>
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedProof("no-proof")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedProof === "no-proof"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          ✅ No Proof Required ({stats.noProofCount})
        </button>
        <button
          onClick={() => setSelectedStatus("open")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedStatus === "open"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          ✅ Open for Claims ({stats.openCount})
        </button>
        <button
          onClick={() => setSelectedCategory("data-breach")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === "data-breach"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          🔓 Data Breach
        </button>
        <button
          onClick={() => setSelectedCategory("class-action")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === "class-action"
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          }`}
        >
          ⚖️ Class Action
        </button>
      </div>

      {/* Claims List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {hasActiveFilters ? `🔍 Search Results (${filteredClaims.length})` : `📋 All Claims (${allClaims.length})`}
          </h2>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No claims match your filters.</p>
            <button onClick={clearFilters} className="mt-2 text-blue-600 hover:text-blue-500">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClaims.slice(0, 18).map((claim) => (
              <div key={claim.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCountryFlag(claim.country)}</span>
                    {getStatusBadge(claim.status)}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.score?.total || 0)}`}>
                    {claim.score?.total || 0}/100
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {decodeHTMLEntities(claim.title)}
                </h3>

                {/* Info */}
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span>💵</span>
                    <span>{formatPayout(claim.estimatedMin, claim.estimatedMax)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {claim.needReceipt ? (
                      <span className="text-orange-500">📄 Proof required</span>
                    ) : (
                      <span className="text-green-500">✅ No proof required</span>
                    )}
                  </div>
                  {claim.deadline && (
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>Deadline: {new Date(claim.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* View Details */}
                <Link
                  href={`/claim-detail/${claim.slug}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
