import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get IP from headers (works with or without Cloudflare)
    const cfIp = request.headers.get("cf-connecting-ip");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    
    let ip = "Unknown";
    if (cfIp) {
      ip = cfIp;
    } else if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    } else if (realIp) {
      ip = realIp;
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";
    
    // Get Cloudflare geolocation headers (will be "Unknown" if not available)
    // These are only available when deployed on Cloudflare Pages
    const countryCode = request.headers.get("cf-ipcountry") || "Unknown";
    const city = request.headers.get("cf-ipcity") || "Unknown";
    const continent = request.headers.get("cf-ipcontinent") || "Unknown";
    const timezone = request.headers.get("cf-iptimezone") || "UTC";
    const isp = request.headers.get("cf-ipasnum") || "Unknown";
    const asn = request.headers.get("cf-ipasn") || "Unknown";
    
    // Parse coordinates
    const latStr = request.headers.get("cf-iplatitude");
    const lonStr = request.headers.get("cf-iplongitude");
    let lat: number | null = null;
    let lon: number | null = null;
    
    if (latStr) {
      const parsed = parseFloat(latStr);
      if (!isNaN(parsed)) lat = parsed;
    }
    if (lonStr) {
      const parsed = parseFloat(lonStr);
      if (!isNaN(parsed)) lon = parsed;
    }

    // Simple browser detection
    let browser = "Unknown";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
    else if (userAgent.includes("Edg")) browser = "Edge";

    // Simple OS detection
    let os = "Unknown";
    let device = "Desktop";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) { os = "Android"; device = "Mobile"; }
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) { os = "iOS"; device = "Mobile"; }

    // Build response
    const response = {
      ip: ip,
      location: {
        city: city !== "Unknown" ? city : "Unknown",
        region: continent !== "Unknown" ? continent : "Unknown",
        country: countryCode !== "Unknown" ? countryCode : "Unknown",
        countryCode: countryCode !== "Unknown" ? countryCode : "Unknown",
        postal: "Unknown", // Not available from Cloudflare headers
        latitude: lat,
        longitude: lon,
        timezone: timezone,
        isp: isp !== "Unknown" ? isp : "Unknown",
        asn: asn !== "Unknown" ? asn : "Unknown",
      },
      browser: browser,
      os: os,
      device: device,
      userAgent: userAgent,
      headers: {
        acceptLanguage: request.headers.get("accept-language") || "Unknown",
        acceptEncoding: request.headers.get("accept-encoding") || "Unknown",
        connection: request.headers.get("connection") || "Unknown",
        referer: request.headers.get("referer") || "Direct",
        origin: request.headers.get("origin") || "Unknown",
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Internal server error", message: errorMsg },
      { status: 500 }
    );
  }
}
