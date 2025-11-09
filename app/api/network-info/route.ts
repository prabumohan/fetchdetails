import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Use Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers (Cloudflare specific header)
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    
    const ip = cfConnectingIp || 
               (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || 
               realIp || 
               "Unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get other headers
    const acceptLanguage = request.headers.get("accept-language") || "Unknown";
    const acceptEncoding = request.headers.get("accept-encoding") || "Unknown";
    const connection = request.headers.get("connection") || "Unknown";
    const referer = request.headers.get("referer") || "Direct";
    const origin = request.headers.get("origin") || "Unknown";

    // Parse user agent for browser/OS info
    const browserInfo = parseUserAgent(userAgent);

    // Get timezone - use UTC as default for Edge runtime compatibility
    const timezone = "UTC";

    // Try to get location info from IP (using a free service)
    // Temporarily disabled external API to isolate the issue
    // Will re-enable once basic functionality is confirmed
    const locationData: any = null;

    const networkInfo = {
      ip: ip,
      location: {
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
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Return a basic response even on error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: "Failed to fetch network information",
        details: errorMessage,
        stack: stack,
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
