import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Get user's public IP address
  const ip = request.headers.get("cf-connecting-ip") || 
             request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
             request.headers.get("x-real-ip") || 
             "Unknown";

  return NextResponse.json({ ip: ip });
}
