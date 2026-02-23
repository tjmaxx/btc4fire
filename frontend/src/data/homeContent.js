import { Shield, TrendingUp, Zap, BarChart2 } from 'lucide-react';

export const SAYLOR_QUOTES = [
  { quote: 'Bitcoin is the exit strategy.', context: 'On financial sovereignty' },
  { quote: "If you don't buy Bitcoin, you're choosing to be poor.", context: 'On inflation vs. BTC' },
  { quote: "Buy Bitcoin. It's the highest performing asset in human history.", context: 'On long-term returns' },
];

export const STRATEGY_STATS = [
  { label: 'BTC Holdings', value: '717,131', sub: 'Bitcoin on balance sheet' },
  { label: 'Avg Buy Price', value: '~$76k', sub: 'Cost basis per BTC' },
  { label: 'Since', value: '2020', sub: 'Years of accumulation' },
  { label: 'Strategy', value: 'Never sell', sub: 'HODl as treasury reserve' },
];

export const FIRE_PRINCIPLES = [
  {
    icon: Shield,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
    title: 'Scarcity = Protection',
    desc: '21 million hard cap. No government, no central bank can inflate Bitcoin away. Your purchasing power is protected over time.',
  },
  {
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    title: 'Asymmetric Upside',
    desc: 'Even a small BTC allocation — 5–20% of a FIRE portfolio — can dramatically accelerate your path to financial independence.',
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
    title: 'DCA Beats Timing',
    desc: 'Buy consistently every week or month regardless of price. Historically, any 4-year DCA window in BTC has been profitable.',
  },
  {
    icon: BarChart2,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
    title: 'Self-Custody = Ownership',
    desc: "Not your keys, not your coins. Move to a hardware wallet. Sovereignty is the whole point of Bitcoin — and of FIRE.",
  },
];

export const BTC_NEWS_LINKS = [
  { label: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com', desc: 'The definitive source for Bitcoin news and analysis.' },
  { label: 'Michael Saylor on X', url: 'https://x.com/saylor', desc: "Strategy CEO's real-time Bitcoin commentary." },
  { label: 'Strategy Investor Page', url: 'https://www.strategy.com/btc', desc: "Track Strategy's official BTC holdings and purchases." },
  { label: 'Clark Moody Dashboard', url: 'https://bitcoin.clarkmoody.com', desc: 'On-chain BTC metrics and network health data.' },
  { label: 'FIRE & Bitcoin Forum', url: '/forum', desc: 'Discuss FIRE strategy with the BTC4Fire community.', internal: true },
  { label: 'r/Bitcoin', url: 'https://reddit.com/r/Bitcoin', desc: 'The largest Bitcoin community on Reddit.' },
];

export const MYTHS = [
  {
    myth: '"Bitcoin is mainly used by criminals."',
    short: 'Blockchain is the most transparent financial system ever built.',
    rebuttal: `This is one of the oldest and most thoroughly debunked claims. The US Treasury, Chainalysis, and Elliptic all report that illicit activity represents less than 1% of all Bitcoin transactions — far lower than cash, which remains the primary vehicle for money laundering, drug trafficking, and tax evasion globally.

Every Bitcoin transaction is permanently recorded on a public ledger, traceable by anyone with an internet connection. Law enforcement agencies have repeatedly seized billions in criminal BTC precisely because the blockchain makes it easier to track than cash. The FBI, IRS-CI, and Europol actively use blockchain analytics to solve crimes.

The narrative was born when Bitcoin was new and unfamiliar. Today, regulated exchanges with KYC/AML requirements handle the vast majority of volume, and institutional investors — BlackRock, Fidelity, pension funds — hold billions in BTC. Associating Bitcoin with crime is like saying the internet is "for hackers."`,
  },
  {
    myth: '"Bitcoin has no intrinsic value."',
    short: 'Value is derived from scarcity, security, and network — the same as gold.',
    rebuttal: `The "intrinsic value" argument is a philosophical trap. Gold has no industrial use for most of its value — it is valued because of scarcity, durability, and human consensus. Fiat currency has no backing whatsoever beyond government decree. Yet nobody questions their value.

Bitcoin's value comes from several concrete properties: (1) Absolute scarcity — only 21 million will ever exist, enforced by code not trust; (2) Decentralisation — no single point of failure or control; (3) Immutability — transactions cannot be reversed or censored; (4) Portability — you can move $1 billion across borders in 10 minutes for a few dollars in fees; (5) Network effect — over 100 million users and growing.

BlackRock, in their Bitcoin ETF prospectus, described Bitcoin as "digital gold" and a legitimate store of value. When the largest asset manager in human history ($10 trillion AUM) calls Bitcoin valuable, the "no intrinsic value" argument collapses.`,
  },
  {
    myth: '"Bitcoin is too volatile to be a store of value."',
    short: 'Volatility is decreasing as adoption grows — and long-term holders always win.',
    rebuttal: `Yes, Bitcoin is volatile in the short term. But zoom out and the picture changes completely. Every single 4-year period in Bitcoin's history has been profitable. Every. Single. One. The worst possible time to buy — the peak of the 2017 bull run at $20k — still resulted in a 5x return if held to 2024.

Volatility is the price you pay for asymmetric upside. Gold was volatile when it was being adopted globally in the 1970s. Equities were volatile in the early 20th century. As Bitcoin's market cap grows, volatility structurally decreases — this is mathematically inevitable.

The FIRE approach handles volatility perfectly: Dollar Cost Averaging (DCA) removes timing risk entirely. Someone who bought $100 of BTC every week for the past 5 years would be significantly up regardless of when they started. Volatility is a feature for disciplined accumulators, not a bug.`,
  },
  {
    myth: '"Governments will ban Bitcoin."',
    short: 'Governments that tried to ban it failed. Most are now regulating and embracing it.',
    rebuttal: `China has "banned" Bitcoin at least five times since 2013. Each time, the network continued running without interruption. Bitcoin's decentralised architecture makes it technically impossible to ban — there is no server to seize, no CEO to arrest, no office to raid.

The global regulatory trajectory has moved sharply in the opposite direction. The US SEC approved spot Bitcoin ETFs from BlackRock and Fidelity in January 2024. The EU's MiCA framework provides legal clarity for crypto across all member states. El Salvador made Bitcoin legal tender. The UAE, Singapore, Switzerland, and Australia have established crypto-friendly regulatory frameworks.

In the US, Bitcoin is classified as a commodity by the CFTC, is held in regulated ETFs, and is a reserve asset of publicly traded companies. Any attempt to "ban" it would require outlawing private key ownership — as absurd as banning numbers. Governments are learning to regulate Bitcoin, not eliminate it.`,
  },
  {
    myth: '"Bitcoin wastes too much energy."',
    short: 'Bitcoin secures $1 trillion+ of value. Its energy use is a feature, not a flaw.',
    rebuttal: `Context matters enormously here. The global banking system consumes an estimated 263 TWh per year. Gold mining consumes ~130 TWh. Bitcoin mining consumes approximately 120–150 TWh — less than either, while securing a $1 trillion+ network without banks, clearing houses, or armies.

More importantly, Bitcoin mining is uniquely suited to use stranded, excess, and renewable energy. Because mining can be instantly switched on or off, it acts as a buyer of last resort for energy grids — stabilising renewable energy production by consuming excess solar and wind that would otherwise be wasted. Studies show 50–70% of Bitcoin mining uses renewable or sustainable energy sources, the highest proportion of any major industry.

Bitcoin miners in Texas are paid to shut down during peak demand, actively supporting grid stability. Volcanic energy in El Salvador, hydro in Norway and Paraguay, flared gas in the US oilfields — Bitcoin turns waste energy into monetary value. The "energy waste" narrative ignores the function that energy provides: an uncensorable, apolitical, global monetary settlement network.`,
  },
  {
    myth: '"Bitcoin is a Ponzi scheme / bubble."',
    short: 'Bitcoin has survived 5 crashes of 80%+ and recovered to new all-time highs each time.',
    rebuttal: `A Ponzi scheme requires a centralised operator paying early investors with money from new investors — Bernie Madoff, FTX, Bitconnect. Bitcoin has no CEO, no company, no promises of returns, no one to pay anyone. It is open-source software running on a decentralised network. Calling Bitcoin a Ponzi reveals a fundamental misunderstanding of what a Ponzi scheme is.

Bitcoin has been declared "dead" by mainstream media over 400 times. It has crashed 80%+ five separate times (2011, 2013, 2015, 2018, 2022). Each time, it recovered to new all-time highs. This is the opposite of a Ponzi — Ponzis collapse and never recover.

Real bubbles (Tulips, Dot-com, Mortgage-backed securities) do not recover. Bitcoin has a 15-year track record of surviving every crash, every ban, every hack, and every obituary. The institutions now holding it — BlackRock, Fidelity, MassMutual, Wisconsin pension funds — do not allocate capital to Ponzi schemes.`,
  },
  {
    myth: '"I\'ve missed the boat — it\'s too late and too expensive."',
    short: 'You can buy 0.00000001 BTC. "Too expensive" misunderstands how Bitcoin works.',
    rebuttal: `Bitcoin is divisible to 8 decimal places. The smallest unit — one Satoshi — is worth a fraction of a cent. You do not need to buy a "whole Bitcoin." When people say Bitcoin is "too expensive at $80,000," they are revealing that they don't understand you can buy $50 worth.

More importantly, consider where we actually are in adoption: roughly 300 million people own Bitcoin globally. That is less than 4% of the world's population. For comparison, 50% of Americans own equities. We are in the early innings, not the final quarter.

The same "too late" argument was made at $1, $100, $1,000, $10,000, and $50,000. Anyone who acted on that fear left life-changing returns on the table. Michael Saylor's view: the price of Bitcoin in 20 years will make today's price look trivially cheap. Whether he is right or wrong, the risk/reward of a small allocation remains compelling — your maximum loss is 100%, your potential gain is multiples.`,
  },
  {
    myth: '"Bitcoin will be replaced by a better cryptocurrency."',
    short: "Bitcoin's simplicity, security, and network effect are its moat — not its features.",
    rebuttal: `This argument has been made since Litecoin in 2011. Ethereum, XRP, Solana, Cardano, Dogecoin — each was supposed to "replace" Bitcoin. None has. Bitcoin's market dominance has remained remarkably stable at 40–60% of total crypto market cap for over a decade.

The reason is that Bitcoin's value proposition is not speed or smart contracts — it is absolute scarcity, maximum decentralisation, and 15 years of unbroken security. No other network has Bitcoin's track record. Ethereum has had planned upgrades (The Merge), hard forks, and foundation control. Solana has experienced multiple network outages. Bitcoin's network has never been hacked, never gone offline, and has processed every transaction since January 2009.

Adding features to Bitcoin means adding attack surface and trust assumptions. Simplicity is a security feature. Bitcoin does one thing — be sound money — and does it better than any alternative. Gold wasn't replaced by a "better gold."`,
  },
  {
    myth: '"Quantum computers will break Bitcoin\'s encryption."',
    short: "Quantum threats are known, monitored, and Bitcoin's protocol can adapt.",
    rebuttal: `This is a legitimate long-term consideration — not a near-term threat. Current quantum computers (as of 2025) have nowhere near the qubit count required to threaten Bitcoin's ECDSA encryption. Estimates from cryptographers suggest a cryptographically relevant quantum computer would require millions of stable qubits; the current state of the art is thousands of noisy qubits.

More importantly, Bitcoin is not static. It is a protocol that can be upgraded through community consensus. The Bitcoin developer community has been researching post-quantum cryptographic algorithms (including lattice-based cryptography) for years. NIST finalised post-quantum cryptography standards in 2024. Bitcoin can adopt these standards well before quantum computers become a genuine threat.

The same quantum threat applies to every bank, every government system, every SSL certificate, and every nuclear missile launch code on the planet. Bitcoin is not uniquely vulnerable — and it has a highly motivated, global community of the world's best cryptographers working on its security.`,
  },
  {
    myth: '"Bitcoin is too slow and can\'t scale for everyday use."',
    short: 'The Lightning Network processes millions of instant, near-free transactions today.',
    rebuttal: `Bitcoin's base layer processes ~7 transactions per second by design — it is a global settlement layer, not a payments processor. Comparing it to Visa's throughput is like complaining that gold bars are slow to carry compared to your wallet.

The Lightning Network, Bitcoin's Layer 2 scaling solution, solves this entirely. Lightning enables instant, near-zero-fee transactions (fractions of a cent) by routing payments through payment channels. It can theoretically process millions of transactions per second. El Salvador's national Bitcoin wallet (Chivo) runs on Lightning. Strike, Cash App, and thousands of merchants accept Lightning payments globally.

The architecture is deliberate: a maximally secure, decentralised base layer (Bitcoin) with fast, cheap payment layers on top (Lightning). This mirrors how the internet works — TCP/IP is the base protocol, HTTP and applications are built on top. Bitcoin is the TCP/IP of money. You don't need to understand TCP/IP to use the web, and you won't need to understand Lightning channels to spend Bitcoin.`,
  },
];
