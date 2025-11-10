export async function onRequest(context) {
  const request = context.request;
  
  // Get IP from Cloudflare headers
  const ip = request.headers.get('cf-connecting-ip') || 
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'Unknown';

  return new Response(JSON.stringify({ ip }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

