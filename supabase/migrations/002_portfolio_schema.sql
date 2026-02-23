-- BTC4Fire Phase 3 — Portfolio Tracker Schema
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================================
-- BTC PURCHASES (per-user purchase log)
-- ============================================================
CREATE TABLE IF NOT EXISTS btc_purchases (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  btc_amount         NUMERIC(20, 8) NOT NULL CHECK (btc_amount > 0),
  purchase_price_usd NUMERIC(14, 2) NOT NULL CHECK (purchase_price_usd > 0),
  purchase_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS btc_purchases_user_id_idx ON btc_purchases(user_id);
CREATE INDEX IF NOT EXISTS btc_purchases_date_idx    ON btc_purchases(purchase_date DESC);

-- RLS: users see and manage only their own purchases
ALTER TABLE btc_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchases_select" ON btc_purchases;
DROP POLICY IF EXISTS "purchases_insert" ON btc_purchases;
DROP POLICY IF EXISTS "purchases_update" ON btc_purchases;
DROP POLICY IF EXISTS "purchases_delete" ON btc_purchases;

CREATE POLICY "purchases_select" ON btc_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "purchases_insert" ON btc_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "purchases_update" ON btc_purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "purchases_delete" ON btc_purchases FOR DELETE USING (auth.uid() = user_id);
