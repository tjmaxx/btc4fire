import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getSupabaseClient } from '../_shared/supabase-client.ts';

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('trading_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
