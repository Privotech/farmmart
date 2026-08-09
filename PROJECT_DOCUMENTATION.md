# FarmMart Project Documentation

## Overview
FarmMart is a modern full-stack e-commerce marketplace for buying and selling farm animals. Built with Next.js 16 (App Router), TypeScript, Prisma ORM (Neon Serverless PostgreSQL), NextAuth.js authentication, Paystack payments, and Cloudinary image hosting.

**Live URL Structure**:
- Landing/Home: `/`
- Login: `/login`
- Register: `/register`
- Buyer Dashboard: `/buyer/dashboard`
- Seller Dashboard: `/seller/dashboard`
- Admin Dashboard: `/admin/dashboard`

---

## Table of Contents
1. [Project Root Configuration](#1-project-root-configuration)
2. [Database Layer](#2-database-layer)
3. [Source Code (`src/`)](#3-source-code-src)
   - [Actions (`src/actions/`)](#actions-srcactions)
   - [App Routes (`src/app/`)](#app-routes-srcapp)
   - [Components (`src/components/`)](#components-srccomponents)
   - [Hooks (`src/hooks/`)](#hooks-srchooks)
   - [Libraries (`src/lib/`)](#libraries-srclib)
   - [Types (`src/types/`)](#types-srctypes)
   - [Middleware](#middleware)
4. [Public Assets](#4-public-assets)
5. [How to Access, Edit, and Update Files](#5-how-to-access-edit-and-update-files)

---

## 1. Project Root Configuration

| File | Purpose | How to Access/Edit |
|------|---------|---------------------|
| `package.json` | Defines project metadata, dependencies, and npm scripts. | **Edit**: Modify dependencies, add scripts. **Run**: `npm install` after changes. Scripts: `dev`, `build`, `start`, `lint` |
| `tsconfig.json` | TypeScript compiler configuration (paths, strict mode, JSX). | **Edit**: Adjust strictness, add path aliases. `@/` maps to `src/`. |
| `next.config.mjs` | Next.js runtime configuration (images domains, rewrites). | **Edit**: Add Cloudinary to `remotePatterns` for images, configure headers. |
| `tailwindcss.config.mjs` (or `postcss.config.mjs`) | Tailwind CSS 4.x configuration via PostCSS. | **Edit**: Customize theme colors, add plugins. Project uses emerald/black theme. |
| `.eslintrc.json` / `eslint.config.mjs` | ESLint linting rules. | **Edit**: Adjust rules, ignore patterns. **Run**: `npm run lint` |
| `prisma.config.ts` | Prisma adapter configuration (Neon driver). | **Edit**: Change database adapter if migrating away from Neon. |
| `.env` | **Critical!** Environment variables (database URLs, secrets, API keys). | **Edit**: Copy from `.env.local.example`. MUST set `DATABASE_URL`, `NEXTAUTH_SECRET`, `JWT_SECRET`, Cloudinary, Paystack, Google OAuth keys. |
| `.gitignore` | Files excluded from Git. | **Edit**: Add secrets, build artifacts, IDE files. |
| `AGENTS.md` / `SKILL.md` / `CLAUDE.md` | AI agent configuration and instructions. | **Edit**: Modify behavior of AI coding assistants working on the repo. |
| `Farmmarts.md` / `README.md` / `SETUP_GUIDE.md` | Existing project docs and setup guides. | **Edit**: Update setup steps, feature lists. |

### npm Scripts
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Prisma generate + Next.js production build
npm run start    # Run built production app
npm run lint     # Run ESLint (TypeScript + JS rules)
```

---

## 2. Database Layer

### `database/` — Raw SQL Files
| File | Purpose | How to Use |
|------|---------|------------|
| `01_schema.sql` | Raw MySQL CREATE TABLE statements for users, animals, cart, orders, etc. | **Import**: Execute via phpMyAdmin / MySQL CLI if using MySQL fallback. |
| `02_seed.sql` | Sample data INSERT statements (bulls, goats, pigs, chickens, rams, rabbits, demo users). | **Import**: Run after schema to populate demo listings. |
| `08_queries_admin.sql` | Admin-specific SQL queries (user reports, revenue totals). | **Reference**: Use for building admin reports page. |
| `09_rollback.sql` | DROP TABLE statements in reverse dependency order. | **Use only**: When you need to wipe and reset the MySQL database. |
| `README.md` | Database folder description. | — |

### `prisma/` — Prisma ORM (Primary Database)
| File | Purpose | How to Access/Edit |
|------|---------|---------------------|
| `schema.prisma` | **The source of truth**. Defines ALL database models (Users, Animals, Cart, Orders, Reviews, Inquiries) using Prisma SDL. | **Edit first** when changing schema. Supports: `enum Role`, `enum AnimalCategory`, relations (`@relation`, `@foreignKey`). |
| `seed.ts` | TypeScript script that seeds the Prisma database with demo data. | **Run**: `npx prisma db seed` or triggers automatically on `npx prisma migrate dev`. |
| `migrations/` | Auto-generated migration SQL files (folder per migration). | **Do NOT edit manually**. Generate with: `npx prisma migrate dev --name "add_feature"` |
| `migration_lock.toml` | Prevents concurrent migration issues. | — |

### Prisma Workflow
1. Edit `prisma/schema.prisma` (add model/field)
2. Run: `npx prisma migrate dev --name "your_change"`
3. Prisma generates SQL in `migrations/` + regenerates `@prisma/client` types
4. If schema only changed locally without SQL: `npx prisma generate`

---

## 3. Source Code (`src/`)

### Actions (`src/actions/`)
**Type**: Server Actions (`"use server"` — runs on backend, callable from client components)

| File | Purpose | How it Works | How to Access/Edit |
|------|---------|--------------|---------------------|
| `animals.ts` | Animal listing CRUD. | Functions: `createAnimal()`, `updateAnimal()`, `deleteAnimal()`, `getSellerAnimals()`. Uses Prisma, revalidates Next.js cache paths. | **Edit**: Add new filters, change visibility rules. Call via `import { createAnimal } from "@/actions/animals"` |
| `cart.ts` | Shopping cart management. | Functions: `addToCart()`, `removeFromCart()`, `updateCartQuantity()`, `getCart()`. Uses Prisma + `getCurrentUser()`. | **Edit**: Change max quantity, add wishlist features. Import from client components. |
| `orders.ts` | Order creation & Paystack integration. | **CRITICAL**: `initializePaystackPayment()` — builds Paystack reference + calculates totals (cart + 5000 shipping + 7.5% tax). `createOrder()` — **verifies Paystack webhook response** (`verifyPayment()`), creates order per cart item, marks animals as `SOLD`, clears cart. `getSellerOrders()`, `updateOrderStatus()`. | **Edit**: Change shipping/tax rates, add discount codes, add partial refunds. |
| `users.ts` | User profile & role management. | Functions: `getProfile()`, `updateProfile()`, `updateUserRole()` (admin only), `deleteUser()` (admin). | **Edit**: Add KYC verification fields, change password flow. |

---

### App Routes (`src/app/`)
Next.js 16 App Router. Folders = routes. `page.tsx` = the page UI.

#### Root Pages
| Path | File | Purpose | How to Edit |
|------|------|---------|-------------|
| `/` | `page.tsx` | **Landing page** (hero, features, featured animals, testimonials, CTA). | **Edit**: Update hero copy, featured categories, change images. |
| `/about` | `about/page.tsx` | Company about page. | Edit content directly. |
| `/mission` | `mission/page.tsx` | Mission statement page. | — |
| `/vision` | `vision/page.tsx` | Vision statement page. | — |
| `/contact-us` | `contact/page.tsx` | Contact form / contact info. | — |
| `/logistics` | `logistics/page.tsx` | Logistics / delivery info. | — |
| `/dashboard` | `dashboard/page.tsx` | **Role router** — detects user role, redirects to buyer/seller/admin dashboard. | **Edit**: Add new roles, change redirect logic. |
| `/listings` | `listings/page.tsx` | **Public animal listings** (browse/search all). | **Edit**: Change default filters, add featured badge. |
| `/listings/[id]` | `listings/[id]/page.tsx` | **Single animal details** (images, price, seller info, add-to-cart). Dynamic route. | **Edit**: Add inquiry form, related products, reviews section. |
| `/cart` | `cart/page.tsx` | Shopping cart page (review items before checkout). | — |
| `/checkout` | `checkout/page.tsx` + `CheckoutClient.tsx` | Checkout flow (delivery info, Paystack button, payment processing). | **Edit**: Add promo codes, change delivery options, split into multi-step. |
| `/forgot-password` | `forgot-password/page.tsx` | Password reset request form. | — |
| `/reset-password` | `reset-password/page.tsx` | Password reset form (via token). | — |
| `/x-admin-auth-portal-2024` | — | Legacy admin auth page (backward compat). | Remove if unused. |

#### Auth Routes (`(auth)/` route group — shared layout)
| Path | File | Purpose |
|------|------|---------|
| `/login` | `(auth)/login/page.tsx` | Login page (email/password + Google OAuth). Uses `AuthContainer.tsx`. |
| `/register` | `(auth)/register/page.tsx` | Registration page (name, email, password, role select). Uses `AuthContainer.tsx`. |

#### Buyer Routes (`/buyer/`)
All buyer pages use `/buyer/layout.tsx` which renders the buyer sidebar.

| Path | File | Purpose |
|------|------|---------|
| `/buyer/dashboard` | `buyer/dashboard/page.tsx` | Buyer dashboard: stats, featured livestock, live animal index, quick actions, market trends. |
| `/buyer/listings` | `buyer/listings/page.tsx` + `BuyerListingsClient.tsx` | Browse animals with filters (type, breed, price range, location, health status). |
| `/buyer/live-bids` | `buyer/live-bids/page.tsx` | Live bidding / auction page (mock data). |
| `/buyer/supply-chain` | `buyer/supply-chain/page.tsx` | Supply chain tracking visual (farm → transport → market). |
| `/buyer/price-index` | `buyer/price-index/page.tsx` | Animal price index / historical charts by category. |
| `/buyer/reports` | `buyer/reports/page.tsx` | Purchase reports & analytics. |
| `/buyer/orders` | `buyer/orders/page.tsx` | Order history (track status: pending → confirmed → shipped → delivered). |
| `/buyer/cart` | `buyer/cart/page.tsx` + `CartClient.tsx` | Dedicated cart page under buyer route. |
| `/buyer/support` | `buyer/support/page.tsx` | Buyer help / support tickets. |

#### Seller Routes (`/seller/`)
All seller pages use `/seller/layout.tsx` which renders `Sidebar.tsx` (Livestock Seller Portal) + role checks.

| Path | File | Purpose |
|------|------|---------|
| `/seller/dashboard` | `seller/dashboard/page.tsx` | Seller dashboard: Total revenue, active head count, herd growth bar chart, active listings, recent activity. |
| `/seller/animals` | `seller/animals/page.tsx` + `SellerAnimalActions.tsx` | **Inventory management** — table view of all seller's animals (type, breed, price, AVAILABLE/SOLD badge), Edit/Delete actions. |
| `/seller/animals/new` | `seller/animals/new/page.tsx` | **Add new animal listing** — form (name, type dropdown, breed, age, weight, price, location, health status, image upload via `ImageUpload.tsx`). |
| `/seller/animals/[id]/edit` | `seller/animals/[id]/edit/page.tsx` + `SellerEditAnimalForm.tsx` | **Edit existing animal** — pre-filled form, permission check (only owner can edit). |
| `/seller/orders` | `seller/orders/page.tsx` + `SellerOrderActions.tsx` | Incoming orders table — Pending → Confirm → Shipped → Delivered workflow. Status update buttons call `updateOrderStatus()` action. |
| `/seller/analytics` | `seller/analytics/page.tsx` | Seller analytics: earnings, active/sold counts, avg price, order status breakdown, animal types distribution, inventory value detail table. |
| `/seller/settings` | `seller/settings/page.tsx` | Profile settings & preferences. |
| `/seller/help-center` | `seller/help-center/page.tsx` | Seller documentation / FAQs. |

#### Admin Routes (`/admin/`)
`/admin/layout.tsx` — renders `AdminSidebar.tsx`. Role check: `ADMIN` only.

| Path | File | Purpose |
|------|------|---------|
| `/admin/dashboard` | `admin/dashboard/page.tsx` | Platform overview: total users, revenue, listings. |
| `/admin/analytics` | `admin/analytics/page.tsx` | Full platform analytics & charts. |
| `/admin/users` | `admin/users/page.tsx` + `AdminUsersClient.tsx` | User management: view users, change role (BUYER/SELLER/ADMIN), ban/delete. |
| `/admin/moderation` | `admin/moderation/page.tsx` + `AdminModerationClient.tsx` | Content moderation: review reported listings, approve/remove animals. |
| `/admin/orders` | `admin/orders/page.tsx` + `AdminOrdersClient.tsx` | All platform orders (cross-seller overview, refunds). |
| `/admin/settings` | `admin/settings/page.tsx` | Global platform settings (tax rates, shipping costs, site name). |

#### API Routes (`/api/`) — Backend REST endpoints
`route.ts` files under `/api/*` return JSON (not HTML). Used for client-side fetching and webhooks.

| Route | File | Methods | Purpose |
|-------|------|---------|---------|
| `/api/auth/[...nextauth]` | `api/auth/[...nextauth]/route.ts` | ALL | **NextAuth handler** — signin, callback, session, signout. Configuration in `src/lib/auth.ts`. |
| `/api/auth/login` | `api/auth/login/route.ts` | POST | Custom credentials login (creates JWT session cookie for middleware). |
| `/api/auth/logout` | `api/auth/logout/route.ts` | POST | Clears session cookie. |
| `/api/auth/register` | `api/auth/register/route.ts` | POST | User registration (hashes password with bcryptjs). |
| `/api/auth/me` | `api/auth/me/route.ts` | GET | Returns current authenticated user info from JWT. |
| `/api/auth/forgot-password` | `api/auth/forgot-password/route.ts` | POST | Sends password reset email via Nodemailer. |
| `/api/auth/reset-password` | `api/auth/reset-password/route.ts` | POST | Applies new password after token verification. |
| `/api/animals` | `api/animals/route.ts` | GET, POST | **GET**: List all animals (supports query params: `?type=pig&minPrice=50000&sortBy=price_asc`). **POST**: Create listing (seller auth required). |
| `/api/animals/[id]` | `api/animals/[id]/route.ts` | GET, PUT, DELETE | **GET**: Single animal details. **PUT**: Update listing (owner only). **DELETE**: Remove listing. |
| `/api/cart` | `api/cart/route.ts` | GET, POST, DELETE, PATCH | Get user cart, add item, remove item, update quantity. |
| `/api/orders` | `api/orders/route.ts` | GET, POST (buyer), PATCH (seller/admin) | Buyer: create order / view own orders. Seller: view orders for own animals. |
| `/api/paystack/webhook` | `api/paystack/webhook/route.ts` | POST | **CRITICAL**: Paystack server-to-server webhook (verifies signature, updates payment status). |
| `/api/inquiries` | `api/inquiries/route.ts` | GET, POST | Buyer-to-seller messages about animals. |
| `/api/reviews` | `api/reviews/route.ts` | GET, POST | Product reviews (rating + comment). |
| `/api/users` | `api/users/route.ts` | GET (admin), PATCH (admin) | Admin user listing + role updates. |
| `/api/test` | `api/test/route.ts` | GET | Debug endpoint (check database connectivity, etc). |

**How to call API Routes**:
```tsx
// Client side fetch
const res = await fetch("/api/animals?type=cattle");
const data = await res.json();
```

---

### Components (`src/components/`)

#### Auth Components (`components/auth/`)
| File | Purpose | How to Edit |
|------|---------|-------------|
| `AuthContainer.tsx` | **Main auth UI** — renders TABS for Login / Register. Contains: form validation (password ≥6 chars), role selection modal (BUYER/SELLER radio after register), Google OAuth button, error/success messages. | Change validation rules, add third auth tabs (farmer/cooperative), style the role selector. |
| `AdminAuthContainer.tsx` | Separate admin login container (optional portal). | — |

#### Feature Components (`components/features/`)
| File | Purpose | How it Works |
|------|---------|--------------|
| `AnimalCard.tsx` | **Animal listing card** — displays image, name, breed, age, price, "Add to Cart" + "View Details" buttons. Emerald/black themed. | Used in listings grid, buyer dashboard featured section. Props: `animal: Animal`. |
| `AnimalForm.tsx` | Reusable form schema for new/edit animal pages (shares fields). | — |
| `CartItem.tsx` | Single cart row — image, title, qty stepper (+/-), price, remove button. | Used on `/cart` and `/checkout` pages. |
| `FilterPanel.tsx` | **Filter sidebar** on listings pages — category checkboxes (Cattle/Goat/Sheep/Pig/Poultry/Other), breed search, price min/max range, location dropdown, health status filter, "Apply Filters" button. | Props: `filters`, `onFilterChange`, `onClearFilters`. |

#### Layout Components (`components/layout/`)
| File | Purpose | How it Works |
|------|---------|--------------|
| `Navbar.tsx` | **Top navigation bar** — logo "FarmMart 🐄", links (Home, Listings, About, Contact), Login/Register OR (Dashboard + User Menu). | Shows different buttons based on `useSession()` login state. |
| `NavbarWrapper.tsx` | **Smart wrapper** — decides WHETHER to show Navbar. Logic: if logged in + NOT on root path (`/`) → hide Navbar. Else → show Navbar. | This implements the "no navbar in dashboards" requirement. |
| `Sidebar.tsx` | **SELLER sidebar** — title: "🐄 Livestock Seller Portal". Links: Dashboard, Animals 🐂, Orders 📦, Analytics 📊, Settings ⚙️, Help Center, Logout. | Active link highlighted with emerald background. On mobile uses `md:hidden` toggle. |
| `AdminSidebar.tsx` | **ADMIN sidebar** — Dashboard, Users, Moderation, Orders, Analytics, Settings. | — |
| `Footer.tsx` | **Footer** — copyright, links (Privacy, Terms, About, Contact), social icons placeholder. | Emerald/black themed. Displays on ALL pages. |

#### UI Components (`components/ui/`)
**Reusable atomic building blocks (atomic design).**

| File | Props / Variants | Purpose | How to Customize |
|------|------------------|---------|-------------------|
| `Button.tsx` | Variants: `primary` (bg-emerald-600) / `secondary` (bg-emerald-900) / `danger` (bg-rose-600). Sizes: `sm` / default. `isLoading`, `disabled`, `onClick`. | Standard button with emerald/black theme + loading spinner. | Add new variant (e.g. "outline"), change padding/border-radius. |
| `Card.tsx` | `className?` prop for extra styles. | Container card with emerald background, border, shadow. Wraps most form/dashboard blocks. | Change default `bg-emerald-950/80` to adjust darkness. |
| `Input.tsx` | Props: `label`, `name`, `type="text|number|email|password"`, `placeholder`, `value`, `onChange`, `required`, `disabled`. | Styled text field with label above + emerald focus ring. | Add new types (e.g. `date`, `file`), add helper error text. |
| `Badge.tsx` | Variants: `success` (green) / `warning` (amber) / `danger` (red) / `primary` (emerald). | Used for order statuses, health statuses, animal type badges. | Add new variant "info" for neutral labels. |

#### Shared Feature Component
| File | Purpose |
|------|---------|
| `ImageUpload.tsx` | Cloudinary image upload widget. Drag-drop or browse. Calls `uploadImageAction()` server action → returns `secure_url`. |

---

### Hooks (`src/hooks/`)
**Client-side React hooks** (fetches data, caches in state, handles loading/error).

| File | Purpose | How to Use |
|------|---------|-------------|
| `useAnimals.ts` | Hook that fetches animal listings via server actions with `useEffect` + loading state. | `const { animals, isLoading, error } = useAnimals({ type: "cattle" });` |
| `useCart.ts` | Hook that manages cart state (add/remove/update, auto-fetch on login). | `const { cart, addToCart, removeFromCart } = useCart();` |
| `useOrders.ts` | Hook that fetches buyer/seller orders. | `const { orders, updateStatus } = useOrders("seller");` |

---

### Libraries (`src/lib/`)
**Business logic + third-party SDK wrappers** (NOT components, NOT UI — purely backend/utility).

| File | Purpose | How it Works / How to Edit |
|------|---------|-----------------------------|
| `auth.ts` | **NextAuth configuration** + `getCurrentUser()` helper. Defines providers: Google OAuth + Credentials (email/password). Callbacks: JWT (adds `role` + `id` to token), session (exposes to front-end), signIn (auto-creates user via Prisma on first Google login). Supports DEMO accounts: `buyer@farmmart.ng` / `seller@farmmart.ng` (password from env). | Add new provider (Facebook) — copy Google pattern. Change JWT expiry from 30 days. |
| `auth-client.tsx` | **Client-side auth provider** — wraps `next-auth/react` SessionProvider. Exports: `useSession()` hook (client-side user check), `signIn()`, `signOut()`. | Only edit if changing from JWT to database sessions. |
| `prisma.ts` | **Singleton Prisma client** + Neon adapter. Uses WebSocket for serverless. Dev mode stores on `globalThis` to reuse connections. | Change DATABASE_URL in `.env` to switch databases. Add more log categories if debugging. |
| `paystack.ts` | Paystack SDK wrapper + `initializePayment()` (creates Paystack transaction link) + `verifyPayment()` (checks if transaction succeeded). | Add `createTransfer()` for automatic seller payouts. Change `secretKey` from env if rotating keys. |
| `cloudinary.ts` | Cloudinary v2 upload + delete. `uploadImage(file, folder)` — accepts File or Buffer, uses stream upload. `deleteImage(publicId)`. | Add `optimizeImage()` to generate different sizes. Add `allowedFormats` array for validation. |
| `firebase.ts` | Firebase SDK configuration (optional — used as fallback auth system in earlier schema). | Remove if fully migrated to NextAuth credentials. |
| `mailer.ts` | Nodemailer configuration. Sends: password reset emails, order confirmations. | Update SMTP_HOST/PORT/USER/PASS env vars. Add `sendOrderConfirmation()` function. |
| `rate-limit.ts` | API rate limiter (prevents brute-force login attacks). | Change window size / max requests per IP. |
| `session.ts` | JWT session helpers (used by `/api/auth/login` to create `farmmart_session_token` cookie for middleware). | Keep in sync with `middleware.ts` verification logic. |
| `uploadAction.ts` | Server action wrapper around `uploadImage()`. Accepts FormData with `file` field → returns `{ secure_url }`. | Add file size validation here, add virus scan if scaling. |

---

### Types (`src/types/`)
| File | Purpose | How to Use |
|------|---------|-------------|
| `index.ts` | **ALL TypeScript interfaces**: `User`, `Animal`, `AnimalFilters`, `CartItem`, `Order`. Enums: `UserRole` (BUYER/SELLER/ADMIN), `AnimalsCategory` (CATTLE/POULTRY/GOAT/SHEEP/PIG/FISH/OTHER), `OrdersStatus` (PENDING→CONFIRMED→SHIPPED→DELIVERED/PAID/CANCELLED). | **EDIT HERE FIRST** when adding a field (e.g. animal gender) — then update Prisma schema → then the forms. |
| `next-auth.d.ts` | Module augmentation: extends NextAuth `Session.user`, `JWT` types to include `id`, `role`. | Add extra session fields here if needed (e.g. `avatar_url`). |

---

### Middleware
**File**: `src/middleware.ts`

Runs BEFORE every matched request on protected routes:
- Match pattern: `/buyer/*`, `/seller/*`, `/admin/*`, `/checkout/*`
- Looks for `farmmart_session_token` cookie (JWT)
- Uses `jose.jwtVerify()` with `JWT_SECRET` env to verify
- **Role enforcement**:
  - `/admin/*` → requires `role === 'ADMIN'` (else redirect `/login`)
  - `/seller/*` → requires `SELLER` or `ADMIN` (else redirect `/buyer/dashboard`)
  - `/buyer/*` → requires `BUYER` or `ADMIN` (else redirect `/seller/dashboard`)
- Sets `x-user-id` and `x-user-role` request headers (accessible in route handlers via `headers()`)
- On invalid JWT: deletes cookie + redirects to `/login`

**Edit this file if**:
- Adding a new role-based route group (e.g. `/logistics/`)
- Adding 2FA check before dashboard access
- Adding IP blacklist

---

## 4. Public Assets
Folder: `public/` (static files served at domain root)

| File | Purpose |
|------|---------|
| `logo.svg` | FarmMart brand logo (show in Navbar) |
| `cow.svg` | Default animal placeholder image |
| `Berkshire-pig-portrait.webp` | Example pig image (kept for sample listings) |
| `file.svg`, `globe.svg`, `handshake.svg`, `lock.svg`, `window.svg` | Icon SVGs for feature sections |
| `next.svg`, `vercel.svg` | Next.js / Vercel badges |
| `favicon.ico` | Browser tab icon (update with your brand) |

**How to update**: Drop any file into `public/` → reference it as `/filename.ext` in `<img src="/cow.svg">`

---

## 5. How to Access, Edit, and Update Files

### General Workflow
1. **Locate the file** using the tables above (search by feature → folder → filename)
2. **Understand dependencies**: Look at `import ... from "@/..."` lines to see what modules it uses
3. **Make your edit** (see per-file instructions above)
4. **Run lint + types**: `npm run lint` and check VS Code "Problems" tab (red squiggles)
5. **Test in browser**: `npm run dev` → navigate to affected page/feature
6. **If changed schema**: Run `npx prisma migrate dev` (see Prisma workflow in §2)

### Common Scenarios
#### A. I want to change the color theme (e.g. from emerald to blue)
- Edit root CSS variables in `src/app/globals.css`
- Search & replace `emerald-` with `blue-` across all `*.tsx` files in `src/components/ui/`
- Update `Button.tsx` variant classes, `Card.tsx` background

#### B. I want to add a NEW animal category (e.g. "Fish")
1. Update enum in:
   - `prisma/schema.prisma` → `enum AnimalCategory` (add FISH)
   - `src/types/index.ts` → `AnimalsCategory` (add FISH)
2. Run: `npx prisma migrate dev --name "add_fish_category"`
3. Update category dropdowns:
   - `src/components/features/FilterPanel.tsx` (add Fish checkbox)
   - `src/app/seller/animals/new/page.tsx` `<select>` (add `<option value="fish">Fish</option>`)
   - Same in `edit/page.tsx`

#### C. I want to add a NEW page under Buyer
1. Create folder: `src/app/buyer/wishlist/`
2. Create `page.tsx` inside it with:
```tsx
export default function WishlistPage() {
  return <div className="p-8 bg-black min-h-screen">
    <h1 className="text-emerald-100 text-3xl font-bold">Wishlist</h1>
  </div>;
}
```
3. Add link to `components/layout/Sidebar.tsx` (buyer version) — or `buyer/layout.tsx`
4. Add route to `src/middleware.ts` matcher if protecting it further
5. Visit: `http://localhost:3000/buyer/wishlist`

#### D. I want to change the PAYSTACK tax or shipping fee
- File: `src/actions/orders.ts` → function `calculateCartTotals()` (around line 24)
- Change `shippingCost = 5000` OR `tax = cartTotal * 0.075`
- Save. No migration needed (pure JS logic). Works immediately next checkout.

#### E. I want to modify the DEMO account credentials
- File: `src/lib/auth.ts` → look for `normalizedEmail === "buyer@farmmart.ng"` (line 31)
- Change emails or `demoPassword = process.env.DEMO_PASSWORD || "demo123"`
- Or better yet, set `DEMO_PASSWORD` in `.env`

#### F. I want to add a new dashboard stat (e.g. "Total Views on Listings")
1. Prisma: Add `view_count Int @default(0)` to `Animal` model → migrate
2. Backend: Increment it in API animal GET route handler (`/api/animals/[id]/route.ts`)
3. Frontend: Sum it in `seller/dashboard/page.tsx` alongside activeHeadCount
4. Display in the stats grid (add a 5th card styled like the others)

### Troubleshooting
| Issue | Likely File to Check |
|-------|----------------------|
| "Unauthorized" on dashboard login | `.env` (JWT_SECRET), `src/middleware.ts`, session cookie settings |
| Payment always fails | `src/lib/paystack.ts` (check `PAYSTACK_SECRET_KEY` env), webhook signature in `route.ts` |
| Images fail to upload | `.env` (Cloudinary vars), `src/lib/cloudinary.ts` file size/type check, `uploadAction.ts` |
| Can't log in with Google | `.env` (GOOGLE_CLIENT_ID/SECRET), Google Cloud Console redirect URI must be `/api/auth/callback/google` |
| DB connection error | `.env` DATABASE_URL, Neon serverless console → `src/lib/prisma.ts` |
| "Role not allowed" | `src/middleware.ts` role checks, user in DB actually has that role (check `users` table `role` column) |

---
**End of Documentation — Last updated 2026-08-07**
