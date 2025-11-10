import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Try to get IP from various headers
    const cfIp = request.headers.get("cf-connecting-ip");
    const xForwardedFor = request.headers.get("x-forwarded-for");
    const xRealIp = request.headers.get("x-real-ip");
    
    let ip = "Unknown";
    
    if (cfIp) {
      ip = cfIp;
    } else if (xForwardedFor) {
      ip = xForwardedFor.split(",")[0]?.trim() || "Unknown";
    } else if (xRealIp) {
      ip = xRealIp;
    }

    return NextResponse.json({ ip });
  } catch (error) {
    console.error("Error getting IP:", error);
    return NextResponse.json(
      { ip: "Unknown", error: String(error) },
      { status: 500 }
    );
  }
}
