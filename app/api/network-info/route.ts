import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get user's public IP address
    // Priority: Cloudflare header (most reliable) > x-forwarded-for > x-real-ip
    let ip = request.headers.get("cf-connecting-ip");
    if (!ip) {
      const forwarded = request.headers.get("x-forwarded-for");
      if (forwarded) {
        ip = forwarded.split(",")[0].trim();
      } else {
        ip = request.headers.get("x-real-ip") || "Unknown";
      }
    }

    // Get basic info
    const userAgent = request.headers.get("user-agent") || "Unknown";
    
    // Get Cloudflare location headers (if available)
    const country = request.headers.get("cf-ipcountry") || "Unknown";
    const city = request.headers.get("cf-ipcity") || "Unknown";
    const timezone = request.headers.get("cf-iptimezone") || "UTC";
    const isp = request.headers.get("cf-ipasnum") || "Unknown";

    // Simple response
    return NextResponse.json({
      ip: ip,
      country: country,
      city: city,
      timezone: timezone,
      isp: isp,
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get network info", message: String(error) },
      { status: 500 }
    );
  }
}
