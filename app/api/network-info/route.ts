export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || 
             request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
             request.headers.get("x-real-ip") || 
             "Unknown";

  return new Response(JSON.stringify({ ip: ip }), {
    headers: { "Content-Type": "application/json" },
  });
}
