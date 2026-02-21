import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getTechnicalData } from '../_shared/coingecko.ts';
import { calculateRSI, calculateMACD, scoreSignal } from '../_shared/indicators.ts';
import { getSupabaseClient } from '../_shared/supabase-client.ts';

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const techData = await getTechnicalData(60);
    const prices = techData.prices.map((p: { price: number }) => p.price);

    if (prices.length < 35) {
      return new Response(
        JSON.stringify({ error: 'Insufficient price history for signal generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentPrice = prices[prices.length - 1];
    const rsi = calculateRSI(prices);
    const sma20 = prices.slice(-20).reduce((a: number, b: number) => a + b, 0) / 20;
    const sma50 =
      prices.slice(-50).reduce((a: number, b: number) => a + b, 0) /
      Math.min(50, prices.length);
    const { macdLine, signalLine } = calculateMACD(prices);

    const { signal_type, score, reasoning } = scoreSignal(
      rsi,
      sma20,
      sma50,
      macdLine,
      signalLine
    );

    const record = {
      signal_type,
      score,
      rsi: rsi !== null ? parseFloat(rsi.toFixed(2)) : null,
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      macd: macdLine !== null ? parseFloat(macdLine.toFixed(4)) : null,
      macd_signal: signalLine !== null ? parseFloat(signalLine.toFixed(4)) : null,
      price_at_signal: parseFloat(currentPrice.toFixed(2)),
      reasoning,
    };

    // Persist to Supabase (best-effort, non-blocking)
    const supabase = getSupabaseClient();
    supabase
      .from('trading_signals')
      .insert(record)
      .then(({ error }: { error: { message: string } | null }) => {
        if (error) console.warn('Signal DB write failed:', error.message);
      });

    return new Response(
      JSON.stringify({ ...record, created_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
