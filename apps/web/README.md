# New Release Hub (NRH)

**The Professional Music Network for Independent Master Rights Holders.**

New Release Hub is a high-fidelity SaaS platform that empowers independent artists to retain 100% ownership of their masters while leveraging decentralized patronage and a dual-pool royalty engine to scale their careers.

## 🚀 Core Features

- **Live Hubs**: Real-time interactive stages with high-fidelity audio streaming and visual DJ controllers.
- **Dual-Pool Royalty Engine**: Transparent revenue distribution via Pool A (Subscriptions) and Pool C (Commercials).
- **Patronage Bidding**: Secure bidding system for fans to acquire Revenue Participation Licenses.
- **Studio Dashboard**: Comprehensive management suite for artists, including analytics, collab engine, and release distribution.
- **Anti-Fraud Engine**: Multi-layer security capturing IP, DeviceID, and UA to ensure streaming integrity.
- **Opportunity Board**: Verified industry sync deals, grants, and collaboration offers.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database**: PostgreSQL (Prisma ORM)
- **Real-time**: Pusher / Supabase Realtime
- **Payments**: Stripe Connect (Escrow & Revenue Splits)
- **Styling**: Tailwind CSS (Premium Dark Studio Aesthetic)
- **Deployment**: Vercel

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL instance
- Stripe Account (for payouts)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` with the following:
```env
DATABASE_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_PUSHER_APP_ID=
```

### 4. Database Initialization
```bash
npx prisma db push
npm run seed
```

### 5. Development
```bash
npm run dev
```

## ⚖️ Legal
NRH is built on transparency. All economic logic is documented in our [Revenue Sharing Explainer](https://newreleasehub.com/how-it-works/revenue-sharing).

Built by **New Release Hub LLC** · Omaha, Nebraska.
