import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Use Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers (works with proxies/load balancers)
    // Note: request.ip is not available in Edge runtime, so we rely on headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare specific
    const ip = forwardedFor?.split(",")[0]?.trim() || 
               realIp || 
               cfConnectingIp || 
               "Unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get other headers
    const acceptLanguage = request.headers.get("accept-language") || "Unknown";
    const acceptEncoding = request.headers.get("accept-encoding") || "Unknown";
    const connection = request.headers.get("connection") || "Unknown";
    const referer = request.headers.get("referer") || "Direct";
    const origin = request.headers.get("origin") || "Unknown";

    // Try to get location info from IP (using a free service)
    let locationData = null;
    try {
      // Using ipapi.co as a free service (you can replace with other services)
      const apiUrl = "https://ipapi.co/" + ip + "/json/";
      const locationResponse = await fetch(apiUrl, {
        headers: {
          "User-Agent": "NetworkDetailsApp/1.0",
        },
      });
      
      if (locationResponse.ok) {
        locationData = await locationResponse.json();
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }

    // Parse user agent for browser/OS info
    const browserInfo = parseUserAgent(userAgent);

    // Get timezone from headers or default
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const networkInfo = {
      ip: ip,
      location: locationData
        ? {
            city: locationData.city || "Unknown",
            region: locationData.region || "Unknown",
            country: locationData.country_name || "Unknown",
            countryCode: locationData.country_code || "Unknown",
            postal: locationData.postal || "Unknown",
            latitude: locationData.latitude || null,
            longitude: locationData.longitude || null,
            timezone: locationData.timezone || timezone,
            isp: locationData.org || "Unknown",
            asn: locationData.asn || "Unknown",
          }
        : {
            city: "Unknown",
            region: "Unknown",
            country: "Unknown",
            countryCode: "Unknown",
            postal: "Unknown",
            latitude: null,
            longitude: null,
            timezone: timezone,
            isp: "Unknown",
            asn: "Unknown",
          },
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
      },
    });
  } catch (error) {
    console.error("Error fetching network info:", error);
    return NextResponse.json(
      { error: "Failed to fetch network information" },
      { status: 500 }
    );
  }
}

function parseUserAgent(userAgent: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

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

