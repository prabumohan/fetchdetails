export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Debug: Log that we received a request
    console.log('[DEBUG] API route called');
    
    // Get all relevant headers for debugging
    const cfIp = request.headers.get("cf-connecting-ip");
    const xForwarded = request.headers.get("x-forwarded-for");
    const xRealIp = request.headers.get("x-real-ip");
    
    console.log('[DEBUG] Headers:', {
      'cf-connecting-ip': cfIp,
      'x-forwarded-for': xForwarded,
      'x-real-ip': xRealIp
    });
    
    // Get IP address
    let ip = "Unknown";
    
    if (cfIp) {
      ip = cfIp;
      console.log('[DEBUG] Using cf-connecting-ip:', ip);
    } else if (xForwarded) {
      ip = xForwarded.split(",")[0].trim();
      console.log('[DEBUG] Using x-forwarded-for:', ip);
    } else if (xRealIp) {
      ip = xRealIp;
      console.log('[DEBUG] Using x-real-ip:', ip);
    } else {
      console.log('[DEBUG] No IP headers found, using Unknown');
    }
    
    // Create response
    const response = {
      ip: ip,
      debug: {
        headers: {
          'cf-connecting-ip': cfIp || null,
          'x-forwarded-for': xForwarded || null,
          'x-real-ip': xRealIp || null,
        },
        allHeaders: Object.fromEntries(request.headers.entries())
      }
    };
    
    console.log('[DEBUG] Returning response:', response);
    
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    // Log the full error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('[ERROR] API route error:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: errorMessage,
        stack: errorStack,
        debug: {
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get("user-agent") || "Unknown"
        }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
