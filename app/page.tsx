"use client";

import { useEffect, useState } from "react";
import NetworkCard from "@/components/NetworkCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface NetworkInfo {
  ip: string;
  location: {
    city: string;
    region: string;
    country: string;
    countryCode: string;
    postal: string;
    latitude: number | null;
    longitude: number | null;
    timezone: string;
    isp: string;
    asn: string;
  };
  browser: string;
  os: string;
  device: string;
  userAgent: string;
  headers: {
    acceptLanguage: string;
    acceptEncoding: string;
    connection: string;
    referer: string;
    origin: string;
  };
  timestamp: string;
}

export default function Home() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  const fetchNetworkInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/network-info");
      if (!response.ok) {
        throw new Error("Failed to fetch network information");
      }
      const data = await response.json();
      setNetworkInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Network Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
              Discover your IP address, location, ISP, and network information
            </p>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={fetchNetworkInfo}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
              <p className="font-semibold">Error: {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !networkInfo && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Network Info Cards */}
          {networkInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NetworkCard
                title="IP Address"
                icon="🌐"
                value={networkInfo.ip}
                description="Your public IP address"
              />
              <NetworkCard
                title="Location"
                icon="📍"
                value={`${networkInfo.location.city}, ${networkInfo.location.region}`}
                description={networkInfo.location.country}
              />
              <NetworkCard
                title="ISP"
                icon="🏢"
                value={networkInfo.location.isp}
                description={`ASN: ${networkInfo.location.asn}`}
              />
              <NetworkCard
                title="Country"
                icon="🌍"
                value={networkInfo.location.country}
                description={`Code: ${networkInfo.location.countryCode}`}
              />
              <NetworkCard
                title="Timezone"
                icon="🕐"
                value={networkInfo.location.timezone}
                description="Your timezone"
              />
              <NetworkCard
                title="Browser"
                icon="🌐"
                value={networkInfo.browser}
                description={`${networkInfo.os} on ${networkInfo.device}`}
              />
              {networkInfo.location.postal && (
                <NetworkCard
                  title="Postal Code"
                  icon="📮"
                  value={networkInfo.location.postal}
                  description="Your postal code"
                />
              )}
              {networkInfo.location.latitude && networkInfo.location.longitude && (
                <NetworkCard
                  title="Coordinates"
                  icon="🗺️"
                  value={`${networkInfo.location.latitude.toFixed(4)}, ${networkInfo.location.longitude.toFixed(4)}`}
                  description="Latitude, Longitude"
                />
              )}
              <NetworkCard
                title="Connection"
                icon="🔌"
                value={networkInfo.headers.connection}
                description="Connection type"
              />
            </div>
          )}

          {/* Additional Details Section */}
          {networkInfo && (
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                Additional Details
              </h2>
              <div className="space-y-4">
                <DetailRow
                  label="User Agent"
                  value={networkInfo.userAgent}
                  copyable
                />
                <DetailRow
                  label="Accept Language"
                  value={networkInfo.headers.acceptLanguage}
                />
                <DetailRow
                  label="Accept Encoding"
                  value={networkInfo.headers.acceptEncoding}
                />
                <DetailRow
                  label="Referer"
                  value={networkInfo.headers.referer}
                />
                <DetailRow
                  label="Origin"
                  value={networkInfo.headers.origin}
                />
                <DetailRow
                  label="Timestamp"
                  value={new Date(networkInfo.timestamp).toLocaleString()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-gray-800 dark:text-gray-200 break-all">
            {value}
          </p>
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

