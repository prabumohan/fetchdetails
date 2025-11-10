"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [ip, setIp] = useState<string>("Loading...");

  useEffect(() => {
    fetch("/api/network-info")
      .then((res) => res.json())
      .then((data) => setIp(data.ip || "Unknown"))
      .catch(() => setIp("Error"));
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Your IP Address</h1>
        <div className="text-2xl font-mono">{ip}</div>
      </div>
    </main>
  );
}
