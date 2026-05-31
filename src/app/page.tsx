"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { analyzeClaim, ClaimAnalysis } from "@/lib/claim-analyzer";

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
  score: {
    total: number;
  };
  tags: {
    tags: string[];
  };
  analysis?: ClaimAnalysis;
}

interface Stats {
  total: number;
  noReceiptCount: number;
  highValueCount: number;
  avgScore: number;
}

// Fix HTML entities
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

// Format payout
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

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "data-breach": "Data Breach", "class-action": "Class Action", "consumer-settlement": "Consumer",
  };
  return labels[category] || category;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

// US States for filter
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export default function HomePage() {
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState("all");
  const [selectedValue, setSelectedValue] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // all, actionable, news

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
        console.log("Using cached data");
        setAllClaims(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // Fetch from Supabase database (instant)
      const response = await fetch("/api/supabase-direct?limit=200");
      const data = await response.json();

      if (data.success && data.claims && data.claims.length > 0) {
        setAllClaims(data.claims);
        // Cache in localStorage
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

  // Filtered claims with analysis
  const filteredClaims = useMemo(() => {
    return allClaims
      .map((claim) => ({
        ...claim,
        analysis: analyzeClaim({
          title: claim.title,
          description: claim.description,
          officialUrl: claim.officialUrl,
          deadline: claim.deadline,
          estimatedMin: claim.estimatedMin,
          estimatedMax: claim.estimatedMax,
          tags: claim.tags?.tags || [],
        }),
      }))
      .filter((claim) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const titleMatch = claim.title?.toLowerCase().includes(query);
          const descMatch = claim.description?.toLowerCase().includes(query);
          if (!titleMatch && !descMatch) return false;
        }

        // Type filter (actionable/news)
        if (selectedType === "actionable" && claim.analysis.category !== "actionable") return false;
        if (selectedType === "news" && claim.analysis.category !== "news") return false;

        // Receipt filter
        if (selectedReceipt === "no-receipt" && claim.needReceipt) return false;
        if (selectedReceipt === "receipt" && !claim.needReceipt) return false;

        // Value filter
        const maxPayout = claim.estimatedMax || 0;
        if (selectedValue === "high" && maxPayout < 500) return false;
        if (selectedValue === "medium" && (maxPayout < 100 || maxPayout >= 500)) return false;
        if (selectedValue === "low" && maxPayout >= 100) return false;

        // Payment filter
        if (selectedPayment === "paypal" && !claim.payPaypal) return false;
        if (selectedPayment === "check" && !claim.payCheck) return false;
        if (selectedPayment === "bank" && !claim.payBank) return false;

        return true;
      });
  }, [allClaims, searchQuery, selectedType, selectedReceipt, selectedValue, selectedPayment]);

  // Stats with analysis
  const stats = useMemo(() => {
    const analyzed = allClaims.map((c) => ({
      ...c,
      analysis: analyzeClaim({
        title: c.title,
        description: c.description,
        officialUrl: c.officialUrl,
        deadline: c.deadline,
        estimatedMin: c.estimatedMin,
        estimatedMax: c.estimatedMax,
        tags: c.tags?.tags || [],
      }),
    }));

    return {
      total: allClaims.length,
      noReceiptCount: allClaims.filter((c) => !c.needReceipt).length,
      highValueCount: allClaims.filter((c) => (c.estimatedMax || 0) >= 500).length,
      avgScore: allClaims.length > 0
        ? Math.round(allClaims.reduce((sum, c) => sum + (c.score?.total || 0), 0) / allClaims.length)
        : 0,
      actionableCount: analyzed.filter((c) => c.analysis.category === "actionable").length,
      newsCount: analyzed.filter((c) => c.analysis.category === "news").length,
      unknownCount: analyzed.filter((c) => c.analysis.category === "unknown").length,
    };
  }, [allClaims]);

  // High value claims (top 6)
  const highValueClaims = useMemo(() => {
    return [...allClaims]
      .sort((a, b) => (b.estimatedMax || 0) - (a.estimatedMax || 0))
      .slice(0, 6);
  }, [allClaims]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedReceipt("all");
    setSelectedValue("all");
    setSelectedPayment("all");
    setSelectedType("all");
  };

  const hasActiveFilters = searchQuery || selectedState || selectedReceipt !== "all" || selectedValue !== "all" || selectedPayment !== "all" || selectedType !== "all";

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
          Real-time data from TopClassActions, Epiq, Kroll, Angeion, and JND.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.actionableCount}</div>
          <div className="text-xs text-gray-500">✅ Can Apply</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.newsCount}</div>
          <div className="text-xs text-gray-500">📰 News Only</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.noReceiptCount}</div>
          <div className="text-xs text-gray-500">No Receipt</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.highValueCount}</div>
          <div className="text-xs text-gray-500">High Value</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {/* Search Box */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search settlements... (e.g., Facebook, Google, data breach)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="actionable">✅ Can Apply</option>
              <option value="news">📰 News Only</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All States</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Receipt Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Receipt</label>
            <select
              value={selectedReceipt}
              onChange={(e) => setSelectedReceipt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Claims</option>
              <option value="no-receipt">✅ No Receipt</option>
              <option value="receipt">📋 Receipt Required</option>
            </select>
          </div>

          {/* Value Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Values</option>
              <option value="high">💰 High ($500+)</option>
              <option value="medium">💵 Medium ($100-$499)</option>
              <option value="low">💲 Low (&lt;$100)</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Payment</label>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Methods</option>
              <option value="paypal">💳 PayPal</option>
              <option value="check">📧 Check</option>
              <option value="bank">🏦 Bank Transfer</option>
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

      {/* High Value Claims Section */}
      {!hasActiveFilters && highValueClaims.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Highest Value Claims</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highValueClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </div>
      )}

      {/* All Claims / Filtered Claims */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
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
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Link */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          📊 View Full Dashboard →
        </Link>
      </div>
    </div>
  );
}

// Claim Card Component
function ClaimCard({ claim }: { claim: Claim & { analysis?: ClaimAnalysis } }) {
  const maxPayout = claim.estimatedMax || 0;
  const isHighValue = maxPayout >= 500;
  const analysis = claim.analysis;

  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 ${isHighValue ? "ring-2 ring-purple-200" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getCountryFlag(claim.country)}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {claim.sourceName}
          </span>
          {analysis && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              analysis.category === "actionable"
                ? "bg-green-100 text-green-800"
                : analysis.category === "news"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {analysis.category === "actionable" ? "✅ Can Apply" : analysis.category === "news" ? "📰 News" : "❓ Unknown"}
            </span>
          )}
          {isHighValue && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              💰 High Value
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Score</div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(claim.score?.total || 0)}`}>
            {claim.score?.total || 0}/100
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
        {decodeHTMLEntities(claim.title)}
      </h3>

      {/* Info */}
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
        {claim.payPaypal && (
          <div className="flex items-center gap-2">
            <span className="text-blue-500">💳 PayPal</span>
          </div>
        )}
      </div>

      {/* View Details */}
      <Link
        href={`/claim-detail/${claim.slug}`}
        className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
      >
        View Details →
      </Link>
    </div>
  );
}
