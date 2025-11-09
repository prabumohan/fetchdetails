"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function Home() {
  const [ip, setIp] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/network-info")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setIp(data.ip || "Unknown");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching IP:", err);
        setError(err.message || "Failed to get IP address");
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
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="text-2xl text-red-600 mb-4">Error: {error}</div>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetch("/api/network-info")
                  .then((res) => res.json())
                  .then((data) => {
                    setIp(data.ip || "Unknown");
                    setLoading(false);
                  })
                  .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                  });
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && ip && (
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="text-5xl md:text-7xl font-mono font-bold text-indigo-600 mb-4">
              {ip}
            </div>
            <CopyButton ip={ip} />
          </div>
        )}
      </div>
    </main>
  );
}
