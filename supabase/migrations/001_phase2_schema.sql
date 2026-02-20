-- BTC4Fire Phase 2 Schema
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  btc_hodler_since INTEGER,
  fire_target NUMERIC,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    SPLIT_PART(NEW.email, '@', 1)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ARTICLES (blog / news / guides)
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT NOT NULL DEFAULT 'news', -- news | education | guide | fire
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FORUM THREADS
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- general | trading | fire | beginners
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  locked BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FORUM POSTS (replies)
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update thread reply_count and last_reply_at
CREATE OR REPLACE FUNCTION update_thread_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_threads
  SET reply_count = reply_count + 1,
      last_reply_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_forum_post_created ON forum_posts;
CREATE TRIGGER on_forum_post_created
  AFTER INSERT ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_thread_stats();

-- ============================================================
-- RESOURCES (curated links)
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  category TEXT NOT NULL DEFAULT 'tool', -- book | tool | course | video | article
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own update
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Articles: published = public; author can manage own
DROP POLICY IF EXISTS "articles_select" ON articles;
DROP POLICY IF EXISTS "articles_insert" ON articles;
DROP POLICY IF EXISTS "articles_update" ON articles;
CREATE POLICY "articles_select" ON articles FOR SELECT USING (published = true OR auth.uid() = author_id);
CREATE POLICY "articles_insert" ON articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "articles_update" ON articles FOR UPDATE USING (auth.uid() = author_id);

-- Forum threads: public read, auth users create, author update
DROP POLICY IF EXISTS "threads_select" ON forum_threads;
DROP POLICY IF EXISTS "threads_insert" ON forum_threads;
DROP POLICY IF EXISTS "threads_update" ON forum_threads;
CREATE POLICY "threads_select" ON forum_threads FOR SELECT USING (true);
CREATE POLICY "threads_insert" ON forum_threads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "threads_update" ON forum_threads FOR UPDATE USING (auth.uid() = author_id);

-- Forum posts: public read, auth users create, author update/delete
DROP POLICY IF EXISTS "posts_select" ON forum_posts;
DROP POLICY IF EXISTS "posts_insert" ON forum_posts;
DROP POLICY IF EXISTS "posts_update" ON forum_posts;
DROP POLICY IF EXISTS "posts_delete" ON forum_posts;
CREATE POLICY "posts_select" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON forum_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "posts_update" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_delete" ON forum_posts FOR DELETE USING (auth.uid() = author_id);

-- Resources: public read, auth users create
DROP POLICY IF EXISTS "resources_select" ON resources;
DROP POLICY IF EXISTS "resources_insert" ON resources;
CREATE POLICY "resources_select" ON resources FOR SELECT USING (true);
CREATE POLICY "resources_insert" ON resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed articles
INSERT INTO articles (title, slug, content, excerpt, category, published, featured) VALUES
(
  'Welcome to BTC4Fire',
  'welcome-to-btc4fire',
  E'# Welcome to BTC4Fire\n\nBTC4Fire is your community hub for Bitcoin and FIRE (Financial Independence, Retire Early) enthusiasts.\n\n## What is FIRE?\n\nFIRE stands for Financial Independence, Retire Early. It''s a movement of people who are saving aggressively and investing wisely to retire far earlier than traditional retirement age.\n\n## Why Bitcoin?\n\nBitcoin offers a hedge against inflation and a store of value that many FIRE adherents are incorporating into their strategies. With its capped supply of 21 million coins, Bitcoin represents a fundamentally different asset class.\n\n## What We Offer\n\n- **Real-time Bitcoin data**: Track BTC price, market cap, and technical indicators\n- **Educational content**: Learn about Bitcoin, FIRE strategies, and investing\n- **Community forum**: Connect with like-minded individuals\n- **Resource library**: Curated tools and references for your journey\n\nJoin us on the path to financial freedom!',
  'Your community hub for Bitcoin and FIRE (Financial Independence, Retire Early). Learn, connect, and track your path to financial freedom.',
  'news',
  true,
  true
),
(
  'Bitcoin and FIRE: A Perfect Match?',
  'bitcoin-and-fire-perfect-match',
  E'# Bitcoin and FIRE: A Perfect Match?\n\nMany in the FIRE community have started allocating a portion of their portfolios to Bitcoin. But is this a good idea?\n\n## The Case For Bitcoin in a FIRE Portfolio\n\n### Store of Value\n\nBitcoin''s fixed supply of 21 million coins makes it a compelling store of value in an inflationary environment.\n\n### High Growth Potential\n\nEarly Bitcoin adopters have seen extraordinary returns, though past performance doesn''t guarantee future results.\n\n### Portfolio Diversification\n\nBitcoin has historically had low correlation with traditional assets like stocks and bonds.\n\n## Risks to Consider\n\n- **Volatility**: Bitcoin can drop 50-80% in bear markets\n- **Regulatory risk**: Government regulation could impact value\n- **Custody risk**: Self-custody requires technical knowledge\n\n## A Balanced Approach\n\nMost FIRE practitioners who include Bitcoin keep it to 1-10% of their portfolio — enough to benefit from upside without catastrophic downside risk.\n\n**Start small, learn deeply, and never invest more than you can afford to lose.**',
  'Exploring the intersection of Bitcoin and Financial Independence. Can digital gold accelerate your path to early retirement?',
  'education',
  true,
  false
),
(
  'The 4% Rule and Bitcoin',
  'the-4-percent-rule-and-bitcoin',
  E'# The 4% Rule and Bitcoin\n\nThe 4% rule is a cornerstone of FIRE planning. But how does Bitcoin change the calculation?\n\n## What is the 4% Rule?\n\nThe 4% rule suggests that retirees can withdraw 4% of their portfolio annually with a high probability of not running out of money over 30 years.\n\n## Bitcoin''s Impact\n\nIf Bitcoin appreciates significantly, a smaller initial investment could potentially generate more wealth than a traditional stock/bond portfolio.\n\n## Practical Tips\n\n1. **Keep 2 years of expenses in stable assets**\n2. **Rebalance annually, not reactively**\n3. **Consider DCA (Dollar Cost Averaging) into Bitcoin**\n4. **Use hardware wallets for long-term storage**',
  'How does adding Bitcoin to your portfolio affect the classic FIRE withdrawal strategy? We break down the numbers.',
  'guide',
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;

-- Seed forum threads
INSERT INTO forum_threads (title, content, category, pinned) VALUES
(
  'Welcome to BTC4Fire Forum! Start Here.',
  E'Welcome to the BTC4Fire community forum!\n\n**Community Rules:**\n1. Be respectful and constructive\n2. No financial advice — share experiences, not recommendations\n3. No spam or self-promotion\n4. Keep discussions relevant to Bitcoin/crypto and FIRE\n\nIntroduce yourself below and tell us your FIRE goal!',
  'general',
  true
),
(
  'What is your FIRE number and timeline?',
  E'Share your FIRE target number and when you hope to achieve it. What role does Bitcoin play in your strategy?\n\nI''ll start: My FIRE number is $2M with $200k in BTC. Target: 2030.',
  'fire',
  false
),
(
  'Bitcoin DCA strategies — what works for you?',
  'Dollar Cost Averaging into Bitcoin is a popular strategy. Share your DCA approach — weekly, monthly, per paycheck? What platforms do you use?',
  'trading',
  false
),
(
  'Beginner questions — ask anything!',
  'New to Bitcoin or FIRE? Ask your questions here. No question is too basic. The community is here to help!',
  'beginners',
  true
)
ON CONFLICT DO NOTHING;

-- Seed resources
INSERT INTO resources (title, description, url, category, tags) VALUES
(
  'Bitcoin Whitepaper',
  'The original paper by Satoshi Nakamoto that started it all. Essential reading for every Bitcoin holder.',
  'https://bitcoin.org/bitcoin.pdf',
  'article',
  ARRAY['bitcoin', 'fundamentals', 'required reading']
),
(
  'The Simple Path to Wealth',
  'JL Collins'' guide to financial independence through index fund investing. FIRE community classic.',
  'https://jlcollinsnh.com/stock-series/',
  'book',
  ARRAY['fire', 'investing', 'index funds']
),
(
  'CoinGecko',
  'Track Bitcoin and crypto prices, charts, and market data. Free and comprehensive.',
  'https://www.coingecko.com',
  'tool',
  ARRAY['bitcoin', 'price tracking', 'market data']
),
(
  'Bitcoin.org',
  'Official Bitcoin information, wallets, and getting started guides.',
  'https://bitcoin.org',
  'tool',
  ARRAY['bitcoin', 'official', 'wallet', 'getting started']
),
(
  'r/financialindependence',
  'The FIRE subreddit — discussions, case studies, and advice from the FIRE community.',
  'https://www.reddit.com/r/financialindependence/',
  'tool',
  ARRAY['fire', 'community', 'reddit']
)
ON CONFLICT DO NOTHING;
