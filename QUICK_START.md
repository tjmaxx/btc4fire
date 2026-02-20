# BTC4Fire Quick Start Guide

## What's Been Built (Phase 1 Complete ✅)

Your BTC4Fire application is ready to run! Here's what's implemented:

### Frontend (React + Vite)
- ✅ Home page with feature overview
- ✅ Authentication pages (signup/login) 
- ✅ Dashboard with real-time BTC price
- ✅ 7-day price chart
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes for authenticated users

### Backend (Node.js + Express)
- ✅ Express server with CORS
- ✅ Supabase integration
- ✅ CoinGecko BTC price API integration
- ✅ Real-time price endpoint
- ✅ Historical data endpoint
- ✅ Technical indicators endpoint

### Database
- Ready for Supabase PostgreSQL setup

---

## Getting Started (5 Simple Steps)

### Step 1: Create Supabase Project (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (or use free tier)
3. Create new project
4. Go to Settings > API Keys
5. Copy:
   - Project URL
   - `anon` public key (for frontend)
   - `service_role` secret key (for backend)

### Step 2: Configure Backend (.env)

```bash
cd /Users/jitang/Documents/Dev/btc4fire/backend
```

Edit `.env` file and replace:
```
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Save and close.

### Step 3: Configure Frontend (.env.local)

```bash
cd /Users/jitang/Documents/Dev/btc4fire/frontend
```

Edit `.env.local` file and replace:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Save and close.

### Step 4: Start Backend Server

```bash
cd /Users/jitang/Documents/Dev/btc4fire/backend
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:5000
📊 Environment: development
```

### Step 5: Start Frontend (New Terminal)

```bash
cd /Users/jitang/Documents/Dev/btc4fire/frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Open http://localhost:5173 in your browser!**

---

## Testing the Application

### Test 1: View Home Page
- ✅ Should see landing page with features
- ✅ Login and Sign up buttons visible

### Test 2: Signup
1. Click "Sign up" button
2. Enter email and password (6+ chars)
3. Should redirect to login after signup
4. Check email for verification link (free tier may skip this)

### Test 3: Login
1. Click "Login" button
2. Enter email and password
3. Should see dashboard with BTC price
4. Price should update every 60 seconds

### Test 4: Check BTC Price
1. On dashboard, see current BTC price in USD
2. 24h change should show green (positive) or red (negative)
3. Market cap should display in billions
4. 7-day chart should load with historical data

### Test 5: Logout
1. Click logout button in top right
2. Should redirect to home page
3. Dashboard should be inaccessible without login

---

## Dashboard Features Available Now

| Feature | Status | Notes |
|---------|--------|-------|
| Real-time BTC Price | ✅ Live | Updates every 60 seconds from CoinGecko |
| 24h Change | ✅ Live | Shows % change in green or red |
| Market Cap | ✅ Live | Total market cap in billions |
| 7-Day Chart | ✅ Live | Interactive chart showing price history |
| Portfolio | 🔜 Coming | Phase 3 |
| Trading Signals | 🔜 Coming | Phase 3 |
| Blog/News | 🔜 Coming | Phase 2 |

---

## Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution**: 
- Make sure backend is running: `npm run dev` in backend folder
- Check backend server is on http://localhost:5000
- Check frontend's `.env.local` has correct API_URL

### Issue: "Supabase configuration error"
**Solution**:
- Verify your Supabase credentials in .env files
- Double-check there are no extra spaces
- Make sure you used the correct keys (not just clicking copy)

### Issue: "Chart not loading"
**Solution**:
- Backend server may be down - restart `npm run dev`
- CoinGecko API may be rate limited - wait 1 minute
- Check browser console (F12) for error messages

### Issue: "Cannot sign up / Login fails"
**Solution**:
- Check Supabase project is active
- Verify SUPABASE_URL doesn't have trailing slash
- Check browser console for more details
- Try using different email address

---

## Project Structure Reference

```
btc4fire/
├── backend/                    Backend API
│   ├── index.js               Main Express server
│   ├── routes/                API endpoints
│   │   └── btc-data.js        BTC price routes
│   ├── services/              Business logic
│   │   └── coinGeckoService.js BTC data fetching
│   ├── .env                   Backend config (EDIT THIS!)
│   └── package.json
│
├── frontend/                   React app
│   ├── src/
│   │   ├── pages/             App pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/           Auth state
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             Custom hooks
│   │   │   └── useRealtimePrice.js
│   │   ├── services/          API client
│   │   │   └── supabaseClient.js
│   │   ├── App.jsx            Main component
│   │   ├── main.jsx           Entry point
│   │   └── index.css          Tailwind CSS
│   ├── .env.local             Frontend config (EDIT THIS!)
│   └── package.json
│
└── README.md                  Full documentation
```

---

## Next Steps After Getting Running

### Short Term (This Week)
1. ✅ Run application locally
2. ✅ Test signup/login/logout
3. ✅ Verify BTC price data loads
4. ⏭️ Create Supabase database tables (SQL scripts in README.md)

### Medium Term (Next 2 Weeks)
- [ ] Build portfolio tracking feature (Phase 2)
- [ ] Implement trading signals with AI
- [ ] Create blog/news system

### Long Term (4-6 Weeks)
- [ ] Community forum
- [ ] Resource library
- [ ] User profiles & social features
- [ ] Deploy to production

---

## Need Help?

Check these files:
- `README.md` - Full documentation
- Backend console - `npm run dev` in backend folder
- Browser console - F12 in browser
- Supabase dashboard - Check your project settings

---

**Ready? Open http://localhost:5173 and start using BTC4Fire!** 🚀
