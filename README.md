# Flacony

A perfume store and decant marketplace for the Ukrainian market. You can buy full bottles from the official catalog, or buy a few millilitres from a private collector's bottle ("decant").

> **Status:** work in progress, not deployed yet.

## Features

**Catalog**
- Brands → products → variants (volume + price); filters by brand, category and price
- Fragrance profile on the product page: perfumer, year, concentration, note pyramid, accords
- Favorites, reviews and ratings
- Instant search with Meilisearch (`Cmd/Ctrl+K`) plus a full results page

**Decant marketplace**
- Any user can list a bottle; the volume picker recalculates the price live and shows what remains in the bottle
- Anti-counterfeit moderation: two photos are required (bottle and batch code), and admins approve each lot
- Seller storefronts with per-lot statistics; sellers can't buy their own lots
- Stock is decremented in a DB transaction with row locking (`lockForUpdate`), so concurrent orders can't oversell a bottle

**Checkout & orders**
- Guest and registered checkout; signed URLs for guest order pages
- Nova Poshta API integration (city and warehouse lookup)
- Promo codes: percent or fixed amount, minimum order total, usage limit, expiry date
- Order state machine (`new → confirmed → shipped → delivered`, `cancelled`) with guarded transitions
- Order items store a snapshot of brand, name and price, so later catalog edits don't change past orders

**Accounts**
- Laravel Fortify: registration, email verification, password reset, 2FA
- Passkeys (Face ID / fingerprint / security key), Google sign-in via Socialite

**Content & admin**
- Blog and community forum
- Filament admin panel: products, brands, lots, orders, promo codes, posts, forum moderation
- UI in Ukrainian and Russian (localization still in progress)

## Tech stack

| Layer    | Tech |
|----------|------|
| Backend  | Laravel 13, PHP 8.5 |
| Frontend | React 19 + Inertia.js (SSR), Tailwind CSS v4, shadcn/ui |
| Data     | MySQL 8.4, Redis, Meilisearch (Laravel Scout) |
| Admin    | Filament v4 |
| Dev & CI | Docker (Laravel Sail), PHPUnit feature tests, GitHub Actions, PHPStan, Pint |

## Getting started

Requires Docker.

```bash
cp .env.example .env
composer install
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

- Site: http://localhost
- Admin: http://localhost/admin (seeded admin: `test@example.com` / `password`, local only)
- Nova Poshta lookup needs `NOVA_POSHTA_API_KEY` in `.env`

Run tests:

```bash
./vendor/bin/sail artisan test
```

## Roadmap

- Payment gateway (card payment is a stub for now)
- S3/R2 file storage
- Nova Poshta delivery cost and waybill creation
- Full localization

## About

Built by [Evgen Fesenko](https://www.linkedin.com/in/evgeniy-fesenko-ba0987110): PHP developer with 8+ years of experience. I designed the architecture and made the product decisions, and I used AI-assisted development (Claude Code) for implementation speed, reviewing every change.
