# BTC4Fire - Bitcoin to Financial Freedom Platform

A community-driven Bitcoin investment platform combining real-time market data, AI-powered trading signals, and educational resources for the FIRE (Financial Independence, Retire Early) movement.

## Project Structure

```
btc4fire/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/# Reusable components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── context/   # Auth context
│   │   ├── services/  # API client
│   │   └── App.jsx    # Main app
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   ├── controllers/   # Request handlers
│   ├── index.js       # Main server
│   └── package.json
└── README.md
```

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express + Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Charts**: Recharts for BTC price visualization
- **API Integration**: CoinGecko for real-time BTC data

## Prerequisites

- Node.js 18+ (or 20+ for better compatibility)
- npm 9+
- Supabase account (free tier available at https://supabase.com)

## Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings > API Keys
3. Copy your project URL and anon key
4. Save these for next steps

### 2. Backend Setup

```bash
cd backend

# Update .env with your Supabase credentials
# Edit .env and add:
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Install dependencies (already done)
npm install

# Start development server
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Update environment variables
# Edit .env.local and add:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api

# Install dependencies (already done)
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:5173
```

### 4. Database Setup

Due to Node.js version constraints, we'll set up the database directly in Supabase:

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Create the required tables using the SQL scripts below

**Create users table:**
```sql
create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  username text unique,
  created_at timestamp default now()
);
```

**Create portfolios table:**
```sql
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  btc_amount decimal not null,
  buy_price decimal not null,
  purchase_date timestamp not null,
  created_at timestamp default now()
);
```

**Create articles table:**
```sql
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid references public.users(id),
  published_at timestamp,
  created_at timestamp default now()
);
```

**Create forum_threads table:**
```sql
create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid references public.users(id),
  category text,
  created_at timestamp default now()
);
```

**Create signals table:**
```sql
create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  signal_type text not null,
  confidence float not null,
  timestamp timestamp default now(),
  created_at timestamp default now()
);
```

## AWS API Endpoints

### BTC Data Endpoints

```
GET /api/btc-data/price
  Returns current BTC price and 24h changes
  
GET /api/btc-data/history?days=7
  Returns historical price data for specified days
  
GET /api/btc-data/technical?days=30
  Returns technical analysis data (RSI, SMA, etc)
```

## Current Features (Phase 1 Complete)

✅ User authentication (signup/login/logout)
✅ Real-time BTC price display
✅ 7-day price chart  
✅ 24h price change display
✅ Market cap display
✅ Responsive dashboard UI
✅ Home page with feature overview

## Coming Soon (Phase 2-5)

- Portfolio tracking
- Trading signals with AI predictions
- Blog/news system
- Community forum
- Resource library
- User profiles & social features
- Advanced technical indicators

## Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
COINGECKO_API_URL=https://api.coingecko.com/api/v3
FRONTEND_URL=http://localhost:5173
JWT_SECRET=
```

### Frontend (.env.local)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:5000/api
```

## Development Tips

- Hot reload is enabled for both frontend and backend
- Check browser console for frontend errors
- Check terminal for backend errors
- CoinGecko API has rate limits - cached for 1 minute per request

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Supabase connection issues
- Verify .env variables are correct
- Check your Supabase project is active
- Ensure your API keys have proper permissions

### CORS errors
- Make sure backend CORS is configured for your frontend URL
- Check .env `FRONTEND_URL` matches your actual frontend address

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Render/Heroku)
1. Push code to GitHub
2. Connect repository to hosting provider
3. Set environment variables
4. Deploy

## Contributing

This is a personal project for the Tang family. Contributions welcome!

## License

MIT

## Disclaimer

**This is not financial advice.** BTC4Fire is an educational platform for learning about Bitcoin and FIRE strategies. Always do your own research (DYOR) before making investment decisions.

---

**Next Phase**: Complete database schema, implement portfolio tracking, and build trading signal generation system.
