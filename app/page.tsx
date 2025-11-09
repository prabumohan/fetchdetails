"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [ip, setIp] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/network-info")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip || "Unknown");
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to get IP address");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">
          Your IP Address
        </h1>
        
        {loading && (
          <div className="text-2xl text-gray-600">Loading...</div>
        )}
        
        {error && (
          <div className="text-2xl text-red-600">{error}</div>
        )}
        
        {!loading && !error && ip && (
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="text-5xl md:text-7xl font-mono font-bold text-indigo-600 mb-4">
              {ip}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ip);
                alert("IP address copied to clipboard!");
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Copy IP
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
