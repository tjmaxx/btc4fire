-- BTC4Fire: 50 seed forum threads
-- Run in Supabase Dashboard → SQL Editor

INSERT INTO forum_threads (title, content, category, created_at) VALUES

-- ========== GENERAL (12) ==========
(
  'What got you into Bitcoin? Share your story',
  E'We all have that moment when Bitcoin "clicked." Maybe you heard a podcast, fell down a YouTube rabbit hole, or watched your fiat savings lose purchasing power.\n\nI discovered BTC in 2017 after reading The Bitcoin Standard. Didn''t buy until the 2020 crash, but haven''t stopped stacking since.\n\nWhat''s your origin story?',
  'general',
  NOW() - INTERVAL '89 days'
),
(
  'Best Bitcoin podcasts in 2025?',
  E'Looking to refresh my podcast feed. I''ve been a long-time listener of What Bitcoin Did and The Investor''s Podcast, but want some fresh perspectives.\n\nAnyone have recommendations? Particularly interested in:\n- FIRE + Bitcoin crossover content\n- Technical / on-chain analysis\n- Macro economics through a Bitcoin lens',
  'general',
  NOW() - INTERVAL '82 days'
),
(
  'Do you tell friends and family about your Bitcoin holdings?',
  E'Curious how the community handles this. I''ve been stacking for 3 years now and only my wife knows the actual amount. A few friends know I own "some" Bitcoin.\n\nOn one hand, it''s nice to share excitement. On the other hand, it can make relationships weird — especially if the price dumps and people think you''re an idiot, or it pumps and people start asking for loans.\n\nWhat''s your approach?',
  'general',
  NOW() - INTERVAL '75 days'
),
(
  'Favorite Bitcoin books — ultimate reading list',
  E'Let''s compile the definitive Bitcoin reading list for the community.\n\nHere are my top 5:\n1. The Bitcoin Standard — Saifedean Ammous\n2. The Sovereign Individual — Davidson & Rees-Mogg\n3. Broken Money — Lyn Alden\n4. The Price of Tomorrow — Jeff Booth\n5. 21 Lessons — Gigi\n\nWhat would you add?',
  'general',
  NOW() - INTERVAL '68 days'
),
(
  'How do you handle Bitcoin FUD from mainstream media?',
  E'Every cycle it''s the same headlines: "Bitcoin is dead," "crypto bubble bursting," "environmental disaster."\n\nI used to get anxious reading these. Now I barely notice. But I have family members who send me these articles thinking they''re being helpful.\n\nHow do you stay grounded during FUD storms? Any good resources to share with skeptical family?',
  'general',
  NOW() - INTERVAL '60 days'
),
(
  'State of Lightning Network — anyone using it daily?',
  E'I set up a Lightning wallet last month and have been using it for small purchases. The speed is incredible — basically instant.\n\nBut adoption still seems limited. I can use it at a few online merchants and to tip on Nostr, but that''s about it.\n\nAnyone here using Lightning for everyday transactions? What wallets and services do you recommend?',
  'general',
  NOW() - INTERVAL '52 days'
),
(
  'Bitcoin meetups — how to find or start one locally',
  E'I recently attended my first local Bitcoin meetup and it was a game-changer. Real conversations with real people about sound money, FIRE principles, and self-custody.\n\nFor anyone looking to find one:\n- Check meetup.com for "Bitcoin" in your area\n- Search for Bitcoin-only events (avoid generic "crypto" meetups)\n- BitcoinEvents.org has a directory\n\nIf there isn''t one in your area, consider starting one. Happy to share tips on how I organized mine.',
  'general',
  NOW() - INTERVAL '44 days'
),
(
  'The HODL mentality vs. taking profits — where do you stand?',
  E'Michael Saylor says never sell. Many long-term holders agree.\n\nBut at some point, if your goal is FIRE, you need to convert BTC into living expenses. Whether that''s selling, borrowing against it, or earning yield.\n\nWhere does this community stand? Are you pure HODL, or do you have a plan to eventually take some profits?',
  'general',
  NOW() - INTERVAL '37 days'
),
(
  'Nostr and the Bitcoin social media ecosystem',
  E'Been spending more time on Nostr lately. It feels like early Twitter but with Bitcoin-native features built in — zaps (Lightning tips), no censorship, self-sovereign identity.\n\nAnyone else exploring the Nostr ecosystem? What clients are you using? I''ve been on Damus (iOS) and Amethyst (Android).',
  'general',
  NOW() - INTERVAL '28 days'
),
(
  'What is your Bitcoin conviction level from 1-10?',
  E'Simple question: On a scale of 1-10, how convicted are you in Bitcoin as a long-term store of value?\n\n10 = I would sell everything and go all-in\n1 = I''m here out of curiosity\n\nI''m at an 8. I believe in the thesis deeply but maintain some diversification for risk management. If I had a longer time horizon I''d be at 9.\n\nDrop your number and reasoning below.',
  'general',
  NOW() - INTERVAL '18 days'
),
(
  'Privacy and Bitcoin — how private are your transactions really?',
  E'Something I think the community should discuss more: Bitcoin is pseudonymous, not anonymous.\n\nChain analysis companies can trace transactions. KYC exchanges report to tax authorities. Your Bitcoin is less private than most people think.\n\nWhat privacy practices do you follow? CoinJoin? Non-KYC purchases? Separate wallets for different purposes?\n\nNot asking for opsec details — just general approaches.',
  'general',
  NOW() - INTERVAL '8 days'
),
(
  'BTC4Fire feature requests — what do you want to see?',
  E'This platform is growing and I''m curious what features the community wants most.\n\nSome ideas I''d love:\n- DCA calculator with historical backtesting\n- Portfolio tracker\n- FIRE number calculator that factors in BTC allocation\n- Weekly community DCA challenge\n\nWhat would make BTC4Fire more useful for your journey?',
  'general',
  NOW() - INTERVAL '3 days'
),

-- ========== TRADING (13) ==========
(
  'Weekly DCA vs. monthly DCA — does frequency matter?',
  E'I''ve been running a monthly DCA for 2 years. Thinking about switching to weekly.\n\nMathematically, more frequent purchases should smooth out volatility better. But the difference might be marginal.\n\nAnyone run the numbers on weekly vs. monthly vs. bi-weekly DCA over various time periods? Does the extra effort of weekly purchases actually make a meaningful difference?',
  'trading',
  NOW() - INTERVAL '87 days'
),
(
  'What exchange do you use for buying Bitcoin?',
  E'Looking for community recommendations on exchanges. My priorities:\n1. Low fees\n2. Quick withdrawal to self-custody\n3. Reliable / won''t freeze my account\n4. Automatic recurring buys\n\nCurrently using Coinbase but the fee structure annoys me. Considering Strike, Swan, or River.\n\nWhat does everyone here use?',
  'trading',
  NOW() - INTERVAL '80 days'
),
(
  'Understanding Bitcoin''s 4-year cycle — still valid?',
  E'The halving-driven 4-year cycle has been remarkably consistent:\n- 2012 halving → 2013 peak\n- 2016 halving → 2017 peak\n- 2020 halving → 2021 peak\n- 2024 halving → 2025 peak?\n\nBut will this pattern hold forever? As Bitcoin matures and institutional adoption grows, some argue the cycles will dampen.\n\nWhat''s your view — are we still in a cycle-driven market, or is Bitcoin transitioning to something different?',
  'trading',
  NOW() - INTERVAL '73 days'
),
(
  'How much Bitcoin is enough? Position sizing for FIRE',
  E'This is the million-dollar question (literally). If your FIRE target is $2M, how much should be in Bitcoin?\n\nI''ve seen people suggest anywhere from 5% to 100%. The right answer probably depends on:\n- Your time horizon\n- Your risk tolerance\n- Your income stability\n- Your other assets\n\nI''m currently at 30% BTC, 40% index funds, 20% bonds, 10% cash. Feels balanced but sometimes I wonder if 30% is too conservative given my 15-year horizon.',
  'trading',
  NOW() - INTERVAL '66 days'
),
(
  'Tax-loss harvesting with Bitcoin — worth it?',
  E'For those in the US: do you actively tax-loss harvest your Bitcoin positions?\n\nThe idea is to sell at a loss, claim the tax deduction, then buy back. But wash sale rules are a grey area for crypto (officially they don''t apply to crypto yet, but legislation is pending).\n\nAnyone here actively doing this? What tools/software do you use for tracking cost basis?',
  'trading',
  NOW() - INTERVAL '58 days'
),
(
  'RSI and Bitcoin — is it actually useful?',
  E'I''ve been watching the RSI indicator on BTC4Fire''s dashboard. It seems to flag overbought/oversold conditions decently well on longer timeframes.\n\nBut on shorter timeframes, Bitcoin can stay "overbought" for weeks during a bull run.\n\nFor the technical analysis folks here — do you actually use RSI for timing purchases? Or do you find other indicators more reliable?',
  'trading',
  NOW() - INTERVAL '50 days'
),
(
  'The stock-to-flow model — dead or just early?',
  E'PlanB''s stock-to-flow model predicted $100k+ BTC by end of 2021. It didn''t happen on schedule, and many declared the model dead.\n\nBut BTC has since hit those levels. Was the model directionally correct but off on timing?\n\nI think S2F captures something real about scarcity-driven value, but it''s not a crystal ball. Curious what others think.',
  'trading',
  NOW() - INTERVAL '43 days'
),
(
  'Best way to stack sats with a small budget?',
  E'Not everyone can afford to buy whole coins. I started with just $25/week and I''ve been consistent for 18 months.\n\nTips for small-budget stackers:\n- Use no-fee or low-fee platforms (Strike, Swan)\n- Focus on sats, not full coins (1 BTC = 100M sats)\n- Automate it — set and forget\n- Don''t skip weeks because "it''s not enough" — consistency beats amount\n\nAnyone have other tips for small-budget DCA?',
  'trading',
  NOW() - INTERVAL '35 days'
),
(
  'Bitcoin ETF vs. holding actual BTC — which for FIRE?',
  E'Now that spot Bitcoin ETFs exist, there''s a real choice:\n\n**ETF pros:** Tax-advantaged accounts (IRA/401k), no custody risk, familiar brokerage\n**Real BTC pros:** Self-custody, no management fee, true ownership, no counterparty risk\n\nFor FIRE purposes, a Bitcoin ETF in a Roth IRA is incredibly compelling — tax-free growth on an appreciating asset.\n\nBut "not your keys, not your coins" matters too.\n\nWhat''s the community doing? Both? One or the other?',
  'trading',
  NOW() - INTERVAL '27 days'
),
(
  'Orange-pilling your employer — Bitcoin in your 401k',
  E'Has anyone successfully gotten their employer to add a Bitcoin option to the company 401k plan?\n\nFidelity now offers a Digital Assets Account. Some smaller providers are adding Bitcoin ETFs.\n\nI''m putting together a proposal for my HR department. Would love to hear from anyone who''s done this — what worked, what pushback did you get?',
  'trading',
  NOW() - INTERVAL '22 days'
),
(
  'Bear market survival guide for Bitcoiners',
  E'They say bear markets are where fortunes are made. Easy to say when you''re in the green, harder to practice when your portfolio is down 40%.\n\nMy bear market rules:\n1. Never sell in a panic\n2. Keep DCA-ing — buy the fear\n3. Zoom out to the 4-year chart\n4. Focus on sats accumulated, not USD value\n5. Reduce time on price-tracking apps\n\nWhat helps you stay sane during drawdowns?',
  'trading',
  NOW() - INTERVAL '15 days'
),
(
  'MVRV Z-Score says we''re not at the top yet',
  E'The MVRV Z-Score compares market value to realized value and has historically been great at identifying cycle tops and bottoms.\n\nCurrently it''s elevated but not in the red zone that marks euphoric tops. If history rhymes, there may still be room to run.\n\nOf course, past performance ≠ future results. But it''s one of the better on-chain metrics to watch.\n\nDoes anyone else track on-chain metrics? Which ones do you find most reliable?',
  'trading',
  NOW() - INTERVAL '6 days'
),
(
  'Bitcoin mining stocks vs. buying BTC directly',
  E'Some people buy mining stocks (MARA, CLSK, RIOT) as a leveraged BTC play. In theory, miners amplify Bitcoin''s moves.\n\nBut miners also come with operational risk, dilution, management risk, and energy cost exposure.\n\nFor FIRE purposes, does it ever make sense to hold mining stocks instead of (or in addition to) actual Bitcoin? Or is simplicity king?',
  'trading',
  NOW() - INTERVAL '1 day'
),

-- ========== FIRE (13) ==========
(
  'My FIRE plan: 70% BTC, 30% index funds — too aggressive?',
  E'30M, single, software engineer. $150k salary. No debt. Currently have $200k saved.\n\nPlan:\n- 70% BTC (held in cold storage)\n- 30% VTSAX/VTI\n- DCA $4k/month split 70/30\n- Target FIRE number: $1.5M\n\nThe 70% BTC allocation makes me uncomfortable sometimes but I believe in the 10-year thesis. Am I being reckless or rational?\n\nWould appreciate honest feedback, not just cheerleading.',
  'fire',
  NOW() - INTERVAL '86 days'
),
(
  'The Bitcoin FIRE spreadsheet — share your numbers',
  E'I built a spreadsheet to model my FIRE timeline with different BTC price assumptions:\n\n| BTC Price at FIRE | Years to FIRE | Required Monthly DCA |\n|---|---|---|\n| $150k | 8 years | $2,000 |\n| $250k | 6 years | $1,500 |\n| $500k | 4 years | $1,000 |\n\nObviously these are rough estimates. But it helps visualize how much a rising BTC price accelerates the timeline.\n\nAnyone willing to share their own projections? Would love to see how different assumptions change things.',
  'fire',
  NOW() - INTERVAL '79 days'
),
(
  'Coast FIRE with Bitcoin — has anyone achieved it?',
  E'Coast FIRE = you''ve saved enough that compound growth alone will get you to your retirement number. You still work, but only to cover current expenses.\n\nWith Bitcoin''s historical CAGR of ~50%+, the "coast" amount could be surprisingly small. Even $50k in BTC could potentially grow to $1M+ over 10-15 years if past trends continue (big if).\n\nHas anyone here hit their Coast FIRE number through Bitcoin specifically? What was your journey?',
  'fire',
  NOW() - INTERVAL '72 days'
),
(
  'What are your actual monthly expenses? Let''s get specific',
  E'FIRE is all about the gap between income and expenses. But I rarely see people get specific.\n\nMine (MCOL city, married, no kids):\n- Rent: $1,800\n- Food: $600\n- Utilities: $200\n- Insurance: $400\n- Transportation: $300\n- Entertainment: $200\n- Misc: $200\n- Total: ~$3,700/month ($44.4k/year)\n\nFIRE number at 4% rule: $1.11M\nFIRE number at 3% rule (with BTC volatility buffer): $1.48M\n\nShare yours — it helps everyone calibrate.',
  'fire',
  NOW() - INTERVAL '65 days'
),
(
  'Geographic arbitrage + Bitcoin = cheat code for FIRE',
  E'Earning in USD while living somewhere with a low cost of living is already a FIRE accelerator. Add Bitcoin appreciation to the mix and the math gets crazy.\n\nI''m seriously considering moving to Portugal, Thailand, or Costa Rica where:\n- $2k/month covers a comfortable lifestyle\n- Bitcoin capital gains are tax-free or very low in some jurisdictions\n- Quality of life is arguably better than grinding in a HCOL US city\n\nAnyone here FIRE''d abroad? How''s it going?',
  'fire',
  NOW() - INTERVAL '57 days'
),
(
  'Traditional FIRE people who added Bitcoin — how did it change your plan?',
  E'I was a classic Bogleheads / three-fund portfolio FIRE person for years. Added a 20% Bitcoin allocation in 2021.\n\nResult: my total portfolio has significantly outperformed what a pure index fund approach would have done. My FIRE date moved up by ~3 years in my projections.\n\nBut it also added volatility and stress I didn''t have before.\n\nAnyone else make this transition? How did it affect your plan, your psychology, and your timeline?',
  'fire',
  NOW() - INTERVAL '49 days'
),
(
  'The withdrawal problem: how do you spend Bitcoin in FIRE?',
  E'This is the part nobody talks about enough. Even if BTC hits $500k and you''re technically FIRE, you still need to convert to fiat to pay rent, buy groceries, etc.\n\nOptions I''m considering:\n1. Sell small amounts periodically (tax implications)\n2. Borrow against BTC (Unchained, Ledn)\n3. Bitcoin-backed credit cards\n4. Live off other assets and let BTC compound\n\nWhat''s your planned withdrawal strategy?',
  'fire',
  NOW() - INTERVAL '42 days'
),
(
  'Emergency fund in Bitcoin — smart or reckless?',
  E'Traditional FIRE advice: keep 6-12 months of expenses in cash/savings.\n\nBut cash loses value to inflation. Some argue your emergency fund should be partially in Bitcoin.\n\nI keep 3 months in cash, 3 months in a stablecoin earning yield, and consider my BTC stack as a last-resort emergency fund.\n\nIs this reasonable or am I setting myself up for disaster? What if BTC drops 50% right when I need it?',
  'fire',
  NOW() - INTERVAL '34 days'
),
(
  'FIRE with a family — kids, mortgage, and Bitcoin',
  E'Lots of FIRE content focuses on single people or DINK couples. But what about families?\n\n38M, married, 2 kids (3 and 6). Household income $180k. Mortgage payment $2,200.\n\nMy allocation: 50% index funds, 25% BTC, 15% bonds, 10% cash.\n\nWith kids, risk tolerance decreases but time horizon for the BTC portion is still 15+ years.\n\nOther parents in the Bitcoin-FIRE camp — how do you balance family obligations with aggressive savings?',
  'fire',
  NOW() - INTERVAL '26 days'
),
(
  'Barista FIRE and Bitcoin — the semi-retired life',
  E'Barista FIRE = you have enough invested that you only need a part-time job to cover current expenses + health insurance.\n\nI''m 2 years away from this with my BTC + index fund portfolio. Planning to leave my corporate job and work 20 hours/week at something I enjoy.\n\nThe beauty: even a small income means I don''t have to sell BTC during potential bear markets.\n\nAnyone living the Barista FIRE life? How is it?',
  'fire',
  NOW() - INTERVAL '20 days'
),
(
  'Bitcoin changes the 4% rule — here''s how I think about it',
  E'The 4% rule assumes a 60/40 stock/bond portfolio. But what if your portfolio includes a significant Bitcoin allocation?\n\nBitcoin''s sharpe ratio and absolute returns are higher, but so is the volatility. I use a **3% withdrawal rate** for my BTC-heavy portfolio to account for larger drawdowns.\n\nThis means I need a higher FIRE number, but the growth rate should get me there faster.\n\nAnyone else adjusting their withdrawal rate for Bitcoin volatility?',
  'fire',
  NOW() - INTERVAL '12 days'
),
(
  'Health insurance after FIRE — the elephant in the room',
  E'For US-based folks, health insurance is arguably the biggest obstacle to early retirement. Without employer coverage, you''re looking at $500-$2000/month depending on family size and state.\n\nOptions:\n- ACA marketplace (income-based subsidies)\n- Health-sharing ministries\n- Part-time job for benefits (Barista FIRE)\n- Move abroad (many countries have affordable healthcare)\n\nHow are Bitcoin-FIRE people solving this? It''s the one thing that keeps me from pulling the trigger.',
  'fire',
  NOW() - INTERVAL '5 days'
),
(
  'Tracking your FIRE progress — what tools do you use?',
  E'I track my net worth monthly in a spreadsheet. It includes all accounts: brokerage, crypto wallets, bank accounts, 401k.\n\nBut I know some people use more sophisticated tools. What do you use?\n\n- Personal Capital / Empower?\n- Custom spreadsheets?\n- BTC4Fire dashboard?\n- Notion or Obsidian trackers?\n\nBonus question: do you count your home equity in your FIRE number?',
  'fire',
  NOW() - INTERVAL '2 days'
),

-- ========== BEGINNERS (12) ==========
(
  'I just bought my first Bitcoin — now what?',
  E'Pulled the trigger today and bought $500 worth of Bitcoin on Coinbase. Feeling excited and nervous.\n\nA few questions:\n1. Should I move it off the exchange? If so, where?\n2. How do I set up a hardware wallet?\n3. Is $500 even worth self-custodying or should I wait until I have more?\n4. Should I buy more now or wait for a dip?\n\nThanks in advance — this community seems really helpful.',
  'beginners',
  NOW() - INTERVAL '85 days'
),
(
  'What is a seed phrase and why is it so important?',
  E'I keep hearing "back up your seed phrase" but I''m confused about what it actually is.\n\nFrom what I understand: it''s a set of 12 or 24 words that can recover your Bitcoin if your wallet breaks or gets lost. But how does a few words control digital money? It seems like magic.\n\nAlso — where should I store it? Is writing it on paper really the best option?',
  'beginners',
  NOW() - INTERVAL '78 days'
),
(
  'Hardware wallets explained: Ledger vs. Trezor vs. Coldcard',
  E'I''ve been researching hardware wallets and there are so many options. Here''s what I''ve gathered:\n\n**Ledger:** Most popular, Bluetooth option, nice app. But had a data breach (email/address leak, not funds).\n**Trezor:** Open source, great track record, touchscreen on Model T.\n**Coldcard:** Bitcoin-only, air-gapped, most popular among hardcore Bitcoiners.\n\nI''m leaning toward Trezor for the open-source aspect. What does this community recommend for beginners?',
  'beginners',
  NOW() - INTERVAL '71 days'
),
(
  'Is now a good time to buy Bitcoin?',
  E'Classic beginner question, I know. BTC is at [insert current price] and I''m worried I''m buying the top.\n\nBut I''ve also read that people who said this at $1k, $10k, $20k, and $40k were all wrong in the long run.\n\nShould I:\n- Buy a lump sum now?\n- Start a DCA plan?\n- Wait for a dip?\n\nI have $5k to invest and a 10-year time horizon.',
  'beginners',
  NOW() - INTERVAL '64 days'
),
(
  'Understanding Bitcoin vs. crypto — they''re not the same thing',
  E'When I tell people I''m into Bitcoin, they immediately start talking about Dogecoin, Solana, or whatever altcoin is pumping.\n\nI''ve come to learn that Bitcoin and "crypto" are fundamentally different:\n- Bitcoin: decentralized, no leader, 21M cap, proof of work, 15 years of uptime\n- Most alts: VC-funded, centralized teams, can change rules, unproven\n\nThis was a big "aha" moment for me as a beginner. Anyone else go through this realization?',
  'beginners',
  NOW() - INTERVAL '56 days'
),
(
  'How do Bitcoin transaction fees work?',
  E'I tried to send Bitcoin and was confused by the fee options. The wallet showed "low priority," "medium," and "high priority" with different sat/vB rates.\n\nQuestions:\n- Why do fees change?\n- How do I choose the right fee?\n- Can you get your Bitcoin stuck if you set the fee too low?\n- Are Lightning Network transactions really almost free?\n\nWould appreciate an ELI5 explanation.',
  'beginners',
  NOW() - INTERVAL '48 days'
),
(
  'What is the Bitcoin halving and why does it matter?',
  E'I keep seeing people talk about the halving. From what I gathered:\n- Every ~4 years, the reward for mining Bitcoin is cut in half\n- This reduces new supply\n- Historically, price has gone up significantly after each halving\n\nBut I don''t really understand the mechanics. How does reducing miner rewards affect the price? And is it guaranteed to cause a price increase?\n\nWould love a clear explanation.',
  'beginners',
  NOW() - INTERVAL '41 days'
),
(
  'I made common beginner mistakes so you don''t have to',
  E'After 6 months in Bitcoin, here are the mistakes I made:\n\n1. **Chasing altcoins** — Lost 80% on a random token before going Bitcoin-only\n2. **Not setting up 2FA** — Got a phishing email that almost got me\n3. **Buying on hype** — Bought a chunk at the local top because of FOMO\n4. **Not DCA-ing** — Tried to time the market instead of being consistent\n5. **Leaving coins on exchange** — Learned about FTX after the fact\n\nLesson: Keep it simple. Buy BTC. DCA. Self-custody. Don''t overthink.',
  'beginners',
  NOW() - INTERVAL '33 days'
),
(
  'What does "not your keys, not your coins" actually mean?',
  E'I see this phrase everywhere and I think I get the gist: if your Bitcoin is on an exchange, the exchange technically controls it.\n\nBut practically:\n- How real is the risk? Major exchanges like Coinbase seem safe.\n- When does it make sense to move to self-custody?\n- What''s the minimum amount worth self-custodying?\n- What if I lose my hardware wallet?\n\nJust trying to understand when self-custody becomes worth the effort and responsibility.',
  'beginners',
  NOW() - INTERVAL '25 days'
),
(
  'Bitcoin taxes — a beginner-friendly overview',
  E'Taxes on Bitcoin confused me, so I spent a weekend researching (US-focused):\n\n**Taxable events:**\n- Selling BTC for USD\n- Trading BTC for another crypto\n- Using BTC to buy goods/services\n\n**NOT taxable:**\n- Buying BTC with USD\n- Transferring between your own wallets\n- Holding (no tax until you sell)\n\n**Rates:**\n- Short-term (held < 1 year): regular income tax rate\n- Long-term (held > 1 year): 0%, 15%, or 20% depending on income\n\nDid I miss anything? Any tax pros here who can correct me?',
  'beginners',
  NOW() - INTERVAL '19 days'
),
(
  'ELI5: How does Bitcoin actually work?',
  E'I''ve been buying Bitcoin but I''ll be honest — I don''t fully understand HOW it works. I know it''s decentralized and uses blockchain but that''s where my understanding gets fuzzy.\n\nCan someone explain like I''m 5:\n- What is mining actually doing?\n- How does the blockchain verify transactions?\n- Why can''t someone just copy Bitcoin?\n- What are nodes and why do they matter?\n\nI want to truly understand what I''m investing in.',
  'beginners',
  NOW() - INTERVAL '10 days'
),
(
  'Best YouTube channels for learning about Bitcoin?',
  E'I learn best from video content. Looking for Bitcoin-specific YouTube channels that are:\n- Beginner-friendly\n- Not trying to sell me an altcoin\n- Focused on education, not hype\n- Ideally cover both Bitcoin and FIRE/investing topics\n\nI found a few like Andreas Antonopoulos and BTC Sessions but would love more recommendations from the community.',
  'beginners',
  NOW() - INTERVAL '4 days'
)

ON CONFLICT DO NOTHING;
