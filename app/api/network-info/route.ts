import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Use Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

// Country code to country name mapping
const countryNames: Record<string, string> = {
  "US": "United States", "GB": "United Kingdom", "CA": "Canada", "AU": "Australia",
  "DE": "Germany", "FR": "France", "IT": "Italy", "ES": "Spain", "NL": "Netherlands",
  "BE": "Belgium", "CH": "Switzerland", "AT": "Austria", "SE": "Sweden", "NO": "Norway",
  "DK": "Denmark", "FI": "Finland", "PL": "Poland", "IE": "Ireland", "PT": "Portugal",
  "GR": "Greece", "CZ": "Czech Republic", "HU": "Hungary", "RO": "Romania", "BG": "Bulgaria",
  "HR": "Croatia", "SK": "Slovakia", "SI": "Slovenia", "LT": "Lithuania", "LV": "Latvia",
  "EE": "Estonia", "LU": "Luxembourg", "MT": "Malta", "CY": "Cyprus", "IS": "Iceland",
  "JP": "Japan", "CN": "China", "IN": "India", "KR": "South Korea", "SG": "Singapore",
  "MY": "Malaysia", "TH": "Thailand", "ID": "Indonesia", "PH": "Philippines", "VN": "Vietnam",
  "BR": "Brazil", "MX": "Mexico", "AR": "Argentina", "CL": "Chile", "CO": "Colombia",
  "PE": "Peru", "VE": "Venezuela", "ZA": "South Africa", "EG": "Egypt", "NG": "Nigeria",
  "KE": "Kenya", "GH": "Ghana", "MA": "Morocco", "AE": "United Arab Emirates", "SA": "Saudi Arabia",
  "IL": "Israel", "TR": "Turkey", "RU": "Russia", "UA": "Ukraine", "NZ": "New Zealand",
};

function getCountryName(code: string): string {
  return countryNames[code] || code;
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP from Cloudflare headers (most reliable)
    const ip = request.headers.get("cf-connecting-ip") || 
               request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               request.headers.get("x-real-ip") || 
               "Unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get Cloudflare geolocation headers (no external API needed!)
    const countryCode = request.headers.get("cf-ipcountry") || "Unknown";
    const city = request.headers.get("cf-ipcity") || "Unknown";
    const continent = request.headers.get("cf-ipcontinent") || "Unknown";
    const latitude = request.headers.get("cf-iplatitude");
    const longitude = request.headers.get("cf-iplongitude");
    const timezone = request.headers.get("cf-iptimezone") || "UTC";
    const asn = request.headers.get("cf-ipasn") || "Unknown";
    const asnOrg = request.headers.get("cf-ipasnum") || "Unknown";

    // Get other headers
    const acceptLanguage = request.headers.get("accept-language") || "Unknown";
    const acceptEncoding = request.headers.get("accept-encoding") || "Unknown";
    const connection = request.headers.get("connection") || "Unknown";
    const referer = request.headers.get("referer") || "Direct";
    const origin = request.headers.get("origin") || "Unknown";

    // Parse user agent for browser/OS info
    const browserInfo = parseUserAgent(userAgent);

    // Build location info from Cloudflare headers
    const location = {
      city: city !== "Unknown" ? city : "Unknown",
      region: continent !== "Unknown" ? continent : "Unknown",
      country: countryCode !== "Unknown" ? getCountryName(countryCode) : "Unknown",
      countryCode: countryCode !== "Unknown" ? countryCode : "Unknown",
      postal: "Unknown", // Not available from Cloudflare headers
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      timezone: timezone,
      isp: asnOrg !== "Unknown" ? asnOrg : "Unknown",
      asn: asn !== "Unknown" ? asn : "Unknown",
    };

    const networkInfo = {
      ip: ip,
      location: location,
      browser: browserInfo.browser,
      os: browserInfo.os,
      device: browserInfo.device,
      userAgent: userAgent,
      headers: {
        acceptLanguage,
        acceptEncoding,
        connection,
        referer,
        origin,
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
    // Return a basic response even on error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch network information",
        details: errorMessage,
        ip: request.headers.get("cf-connecting-ip") || "Unknown",
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

function parseUserAgent(userAgent: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  if (!userAgent || userAgent === "Unknown") {
    return { browser, os, device };
  }

  // Browser detection
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    browser = "Opera";
  }

  // OS detection
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS X") || userAgent.includes("macOS")) {
    os = "macOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
    device = "Mobile";
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
    device = userAgent.includes("iPad") ? "Tablet" : "Mobile";
  }

  return { browser, os, device };
}
