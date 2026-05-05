# New Release Hub (NRH)

**The Professional Music Network for Independent Master Rights Holders.**

New Release Hub is a high-fidelity SaaS platform that empowers independent artists to retain 100% ownership of their masters while leveraging decentralized patronage and a dual-pool royalty engine to scale their careers.

## 🚀 Core Features

- **Live Hubs**: Real-time interactive stages with high-fidelity audio streaming and visual DJ controllers.
- **Dual-Pool Royalty Engine**: Transparent revenue distribution via Premium Pool (Subscriptions) and Network Pool (Commercials).
- **Patronage Bidding**: Secure bidding system for fans to acquire Revenue Participation Licenses.
- **Studio Dashboard**: Comprehensive management suite for artists, including analytics, collab engine, and release distribution.
- **Anti-Fraud Engine**: Multi-layer security capturing IP, DeviceID, and UA to ensure streaming integrity.
- **Opportunity Board**: Verified industry sync deals, grants, and collaboration offers.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database & Auth**: Supabase (PostgreSQL, Realtime, Auth)
- **Client**: Supabase JS Client & SSR
- **Payments**: Stripe Connect (Escrow & Revenue Splits)
- **Styling**: Tailwind CSS (Premium Dark Studio Aesthetic)
- **Deployment**: Vercel

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Project
- Stripe Account (for payouts)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

### 4. Database Maintenance
```bash
# Run forensic data correction
npx ts-node src/scripts/fix_seed_data.ts
```

### 5. Development
```bash
npm run dev
```

## ⚖️ Legal
NRH is built on transparency. All economic logic is documented in our [Revenue Sharing Explainer](https://newreleasehub.com/how-it-works/revenue-sharing).

Built by **New Release Hub LLC** · Omaha, Nebraska.

---
*Infrastructure Verification: 2026-05-05T15:35:50-05:00*
