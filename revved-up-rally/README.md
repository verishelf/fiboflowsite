# Revved Up Rally

**DRIVE BEYOND ORDINARY.**

Premium automotive rally website and membership platform built with Next.js 16, Supabase, and Stripe.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase (Auth, Database, RLS)
- Stripe (Subscriptions)
- Resend (Email)
- React Hook Form + Zod
- Embla Carousel

## Getting Started

### 1. Install dependencies

```bash
cd revved-up-rally
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app works without external credentials using seed data fallbacks. Connect Supabase and Stripe for full functionality.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
3. Enable Email auth in Authentication settings
4. Copy project URL and keys to `.env.local`
5. Seed development data:

```bash
npm run seed
```

### Creating an admin user

1. Sign up a user via Supabase Auth (or the `/login` page)
2. Run in SQL editor:

```sql
INSERT INTO admin_users (user_id, role)
VALUES ('YOUR_AUTH_USER_UUID', 'admin');
```

## Stripe Setup

1. Create products and annual prices for Basic, Plus, Elite, Founders
2. Add price IDs to `.env.local`:
   - `STRIPE_BASIC_PRICE_ID`
   - `STRIPE_PLUS_PRICE_ID`
   - `STRIPE_ELITE_PRICE_ID`
   - `STRIPE_FOUNDERS_PRICE_ID`
3. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
4. Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Verify sending domain
3. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

## Map Setup (Optional)

Set `NEXT_PUBLIC_MAP_PROVIDER=mapbox` and `NEXT_PUBLIC_MAP_TOKEN` for live rally route maps.

## Membership Flow

1. User submits application at `/apply`
2. Application stored in Supabase (status: pending)
3. Admin reviews at `/admin/applications`
4. On approval, user receives email with checkout link
5. User completes Stripe Checkout
6. Webhook activates membership and creates member record
7. Member accesses `/dashboard`

## Pricing Configuration

Membership tiers are centralized in `lib/pricing/membership-plans.ts`. All UI, forms, and checkout read from this config.

## Project Structure

```
app/           # Routes and server actions
components/    # UI components
lib/           # Business logic, integrations
hooks/         # React hooks
types/         # TypeScript types
supabase/      # SQL migrations
scripts/       # Seed script
public/        # Static assets
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed Supabase with demo data |

## Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `revved-up-rally`
4. Add all environment variables
5. Deploy

## Production Checklist

- [ ] Supabase migrations applied
- [ ] RLS policies verified
- [ ] Stripe products/prices created
- [ ] Webhook endpoint configured
- [ ] Resend domain verified
- [ ] Admin user created
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
- [ ] Legal pages reviewed by attorney
- [ ] Replace placeholder imagery with licensed assets
- [ ] Analytics (`NEXT_PUBLIC_GA_ID`) configured

## License

Private — Revved Up Rally
