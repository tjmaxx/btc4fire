import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getSupabaseClient } from '../_shared/supabase-client.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

// ── CoinGecko helpers ────────────────────────────────────────────────────────

interface BTCContext {
  currentPrice: number;
  ath: number;
  athDate: string;
  athChangePct: number;   // negative = below ATH
  change24h: number;
  change7d: number;
  change30d: number;
  high52w: number;        // highest close in last 365 days
  low52w: number;         // lowest close in last 365 days
}

async function fetchBTCContext(): Promise<BTCContext> {
  // 1) Coin detail — gives ATH + rolling % changes
  const coinRes = await fetch(
    `${COINGECKO_URL}/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
  );
  if (!coinRes.ok) throw new Error(`CoinGecko coin API failed: ${coinRes.status}`);
  const coin = await coinRes.json();
  const md = coin.market_data;

  // 2) 365-day history for 52-week high/low
  const histRes = await fetch(
    `${COINGECKO_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily`,
  );
  if (!histRes.ok) throw new Error(`CoinGecko history API failed: ${histRes.status}`);
  const hist = await histRes.json();
  const closePrices: number[] = (hist.prices as [number, number][]).map(([, p]) => p);
  const high52w = Math.max(...closePrices);
  const low52w  = Math.min(...closePrices);

  return {
    currentPrice:   md.current_price.usd,
    ath:            md.ath.usd,
    athDate:        md.ath_date.usd,
    athChangePct:   md.ath_change_percentage.usd,   // e.g. -25.4
    change24h:      md.price_change_percentage_24h  ?? 0,
    change7d:       md.price_change_percentage_7d   ?? 0,
    change30d:      md.price_change_percentage_30d  ?? 0,
    high52w,
    low52w,
  };
}

// ── Signal derivation (deterministic) ───────────────────────────────────────

function deriveSignal(athChangePct: number): string {
  if (athChangePct > -8)  return 'NEAR_ATH';
  if (athChangePct > -25) return 'HOLD';
  if (athChangePct > -50) return 'DCA';
  return 'STRONG_DCA';
}

// ── Gemini message generation ─────────────────────────────────────────────────

async function generateMessage(ctx: BTCContext): Promise<string> {
  const pctFromAth = Math.abs(ctx.athChangePct).toFixed(1);
  const athMonth   = new Date(ctx.athDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const pct52wPos  = (((ctx.currentPrice - ctx.low52w) / (ctx.high52w - ctx.low52w)) * 100).toFixed(0);

  const trend = ctx.change30d > 15  ? 'strong uptrend'
    : ctx.change30d > 5   ? 'mild uptrend'
    : ctx.change30d < -15 ? 'strong downtrend'
    : ctx.change30d < -5  ? 'mild downtrend'
    : 'sideways consolidation';

  const prompt = `You are a Bitcoin FIRE strategy advisor writing the daily market insight for btc4fire.com — a community of long-term Bitcoin holders pursuing Financial Independence (FIRE). They DCA regularly and treat Bitcoin as their primary savings vehicle, like MicroStrategy does at the corporate level.

Today's market snapshot:
• BTC price:             $${ctx.currentPrice.toLocaleString()}
• All-time high:         $${ctx.ath.toLocaleString()} (${athMonth})
• Distance from ATH:     ${ctx.athChangePct > -1 ? 'At or above ATH' : `${pctFromAth}% below ATH`}
• 52-week range:         $${ctx.low52w.toLocaleString()} – $${ctx.high52w.toLocaleString()}
• Position in 52w range: ${pct52wPos}th percentile
• 24h change:            ${ctx.change24h >= 0 ? '+' : ''}${ctx.change24h.toFixed(1)}%
• 7-day change:          ${ctx.change7d  >= 0 ? '+' : ''}${ctx.change7d.toFixed(1)}%
• 30-day trend:          ${trend} (${ctx.change30d >= 0 ? '+' : ''}${ctx.change30d.toFixed(1)}%)

Write a sharp, concise strategic insight (3–4 sentences). Rules:
1. Reference the specific numbers (price, % from ATH, range position).
2. Give a clear action signal for FIRE stackers: strong DCA opportunity / good DCA zone / hold and continue regular DCA / patience — near ATH.
3. Acknowledge short-term volatility but anchor on the long-term thesis.
4. Tone: calm, analytical, conviction-based — like a seasoned Bitcoiner, not a hype trader.
5. Do NOT include phrases like "financial advice", "consult a professional", or legal disclaimers.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API failed: ${err}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text');
  return text.trim();
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient();

    // Return today's cached insight if it exists
    const todayUTC = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const { data: cached } = await supabase
      .from('market_insights')
      .select('*')
      .gte('generated_at', `${todayUTC}T00:00:00Z`)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate a fresh insight
    const ctx     = await fetchBTCContext();
    const message = await generateMessage(ctx);
    const signal  = deriveSignal(ctx.athChangePct);

    const { data: inserted, error: insertErr } = await supabase
      .from('market_insights')
      .insert({
        message,
        signal,
        btc_price:   Math.round(ctx.currentPrice),
        pct_from_ath: parseFloat(ctx.athChangePct.toFixed(2)),
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return new Response(JSON.stringify(inserted), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('market-insight error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
