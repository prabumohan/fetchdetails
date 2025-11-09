import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Simple country code mapping
const getCountryName = (code: string): string => {
  const map: Record<string, string> = {
    "US": "United States", "GB": "United Kingdom", "CA": "Canada", "AU": "Australia",
    "DE": "Germany", "FR": "France", "IT": "Italy", "ES": "Spain", "NL": "Netherlands",
    "JP": "Japan", "CN": "China", "IN": "India", "BR": "Brazil", "MX": "Mexico",
  };
  return map[code] || code;
};

function parseUserAgent(ua: string) {
  if (!ua || ua === "Unknown") {
    return { browser: "Unknown", os: "Unknown", device: "Desktop" };
  }

  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X") || ua.includes("macOS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) { os = "Android"; device = "Mobile"; }
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) {
    os = "iOS";
    device = ua.includes("iPad") ? "Tablet" : "Mobile";
  }

  return { browser, os, device };
}

export async function GET(request: NextRequest) {
  try {
    // Get IP
    const ip = request.headers.get("cf-connecting-ip") || 
               (() => {
                 const ff = request.headers.get("x-forwarded-for");
                 return ff ? ff.split(",")[0].trim() : null;
               })() ||
               request.headers.get("x-real-ip") || 
               "Unknown";

    // Get Cloudflare headers safely
    const countryCode = request.headers.get("cf-ipcountry") || "Unknown";
    const city = request.headers.get("cf-ipcity") || "Unknown";
    const continent = request.headers.get("cf-ipcontinent") || "Unknown";
    const latStr = request.headers.get("cf-iplatitude");
    const lonStr = request.headers.get("cf-iplongitude");
    const timezone = request.headers.get("cf-iptimezone") || "UTC";
    const asn = request.headers.get("cf-ipasn") || "Unknown";
    const isp = request.headers.get("cf-ipasnum") || "Unknown";

    // Parse coordinates safely
    let latitude: number | null = null;
    let longitude: number | null = null;
    if (latStr) {
      const lat = parseFloat(latStr);
      if (!isNaN(lat)) latitude = lat;
    }
    if (lonStr) {
      const lon = parseFloat(lonStr);
      if (!isNaN(lon)) longitude = lon;
    }

    // Get other headers
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const browserInfo = parseUserAgent(userAgent);

    const networkInfo = {
      ip,
      location: {
        city: city === "Unknown" ? "Unknown" : city,
        region: continent === "Unknown" ? "Unknown" : continent,
        country: countryCode === "Unknown" ? "Unknown" : getCountryName(countryCode),
        countryCode: countryCode === "Unknown" ? "Unknown" : countryCode,
        postal: "Unknown",
        latitude,
        longitude,
        timezone,
        isp: isp === "Unknown" ? "Unknown" : isp,
        asn: asn === "Unknown" ? "Unknown" : asn,
      },
      browser: browserInfo.browser,
      os: browserInfo.os,
      device: browserInfo.device,
      userAgent,
      headers: {
        acceptLanguage: request.headers.get("accept-language") || "Unknown",
        acceptEncoding: request.headers.get("accept-encoding") || "Unknown",
        connection: request.headers.get("connection") || "Unknown",
        referer: request.headers.get("referer") || "Direct",
        origin: request.headers.get("origin") || "Unknown",
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(networkInfo, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Failed to fetch network information",
        details: msg,
        ip: request.headers.get("cf-connecting-ip") || "Unknown",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
