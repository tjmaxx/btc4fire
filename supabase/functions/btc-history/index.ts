import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getHistoricalBTCData } from '../_shared/coingecko.ts';

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    const data = await getHistoricalBTCData(days);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
