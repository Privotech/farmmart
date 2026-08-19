# FarmMart Application Documentation

## Overview

**FarmMart** is a Next.js 14+ (App Router) livestock e-commerce marketplace connecting verified buyers and sellers of agricultural animals (cattle, goats, sheep, pigs, poultry, rabbits, horses, etc.). It features:

- **Role-based access** — BUYER, SELLER, and ADMIN dashboards
- **Secure payments** via Paystack integration with webhook verification
- **Animal listings** with inventory tracking, categories, breeds, pricing
- **Buyer inquiries / seller messaging** system
- **Shopping cart, favourites, orders, reviews**
- **Seller analytics, price index, supply chain tracking**
- **Admin moderation, user management, analytics**

---

## Architecture Overview

```
FarmMart (Next.js 14 App Router)
│
├── /prisma              → Database schema & migrations (PostgreSQL via Prisma ORM)
├── /public              → Static assets (images, SVGs, logos)
│
├── /src
│   ├── /actions         → Server Actions ("use server") — typed data access layer
│   ├── /app             → App Router pages, layouts, and API Routes
│   │   ├── /(auth)      → Login/register (auth route group)
│   │   ├── /admin       → Admin dashboard routes
│   │   ├── /buyer       → Buyer dashboard routes
│   │   ├── /seller      → Seller dashboard routes
│   │   ├── /api         → REST API endpoints (route.ts files)
│   │   ├── /listings    → Public animal listings
│   │   ├── /checkout    → Payment checkout flow
│   │   └── ...          → Other public pages (about, terms, etc.)
│   │
│   ├── /components      → Reusable UI (layout, features, UI primitives)
│   ├── /hooks           → Custom React hooks (useAnimals, useCart, useOrders)
│   ├── /lib             → Core libraries (Prisma client, auth, Paystack, mailer, etc.)
│   └── /types           → TypeScript type definitions
│
└── package.json, tsconfig.json, next.config.mjs → Build config
```

---

## Core Database Models (`/prisma/schema.prisma`)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **`users`** | All platform users | `role` (BUYER/SELLER/ADMIN), `is_verified`, `verification_status`, farm info, contacts |
| **`animals`** | Livestock listings | `seller_id`, `category`, `breed`, `price`, `status` (AVAILABLE/SOLD/RESERVED), images, `view_count` |
| **`orders`** | Purchase transactions | `buyer_id`, `animal_id`, `amount`, **`platform_fee`**, **`seller_payout`**, `status` (PENDING→PAID→CONFIRMED→SHIPPED→DELIVERED), `paystack_ref` |
| **`cart`** | Buyer cart items | `user_id`, `animal_id`, `quantity` |
| **`favourites`** | Saved/liked listings | `user_id`, `animal_id` |
| **`inquiries`** | Buyer→Seller messages | `sender_id`, `receiver_id`, `animal_id`, `message`, `status` (UNREAD/READ/REPLIED) |
| **`reviews`** | Animal/buyer feedback | `user_id`, `animal_id`, `rating`, `comment` |
| **`loginAttempt`** | Brute-force protection | `email`, `attempts`, `lockedUntil` |
| **`passwordReset`** | Password reset tokens | `email`, `token`, `used`, `expiresAt` |

### Recent Changes — Transaction Fee Fields
Added **August 2026**:
- **`orders.platform_fee`** (Decimal, default 0) — 10% of the order amount retained by FarmMart
- **`orders.seller_payout`** (Decimal, default 0) — 90% of the order amount paid to the seller

> **IMPORTANT:** Run `npx prisma migrate dev --name add-transaction-fees` to apply these columns to the database.

---

## Server Actions Layer (`/src/actions/`)

Server Actions are the **preferred data-access pattern** — they run on the server, are typed, and can revalidate Next.js caches.

### `/src/actions/orders.ts`
**Role:** Order lifecycle management for buyers and sellers.

| Export | Type | Purpose |
|--------|------|---------|
| `initializePaystackPayment()` | `"use server"` | 1. Loads the user's cart<br>2. Calculates totals (cartTotal + ₦5000 shipping + 7.5% tax)<br>3. Calls Paystack `initializePayment()` with a callback URL<br>4. Returns the authorization URL + reference |
| `createOrder()` | `"use server"` | Called **after** Paystack redirects back. Does full verification:<br>1. Verifies the payment reference via Paystack API<br>2. Ensures amount matches & email matches the logged-in user<br>3. Idempotency check (does not re-process same reference)<br>4. **Calculates 10% platform fee and 90% seller payout**<br>5. Creates each `orders` record in a Prisma `$transaction`<br>6. Marks each animal as `SOLD`<br>7. Clears the cart<br>8. Revalidates relevant Next.js paths (`/buyer/orders`, `/seller/orders`, etc.) |
| `getSellerOrders()` | `"use server"` | Returns all orders for animals owned by the current SELLER, with animal + buyer user included. |
| `updateOrderStatus()` | `"use server"` | Allows a seller to advance an order through: PAID → CONFIRMED → SHIPPED → DELIVERED (or CANCELLED / REFUNDED). Revalidates `/seller/orders`. |
| `calculateCartTotals()` | Helper (file-internal) | Returns `{ cartTotal, shippingCost, tax, totalAmount, totalAmountInKobo }` — Paystack expects amounts in **kobo** (kobo = NGN × 100). |

#### Fee Calculation Logic in `createOrder()` (lines 202–204)
```typescript
const orderAmount = Number(item.animals.price) * item.quantity;
const platformFee = orderAmount * 0.10;   // 10% FarmMart fee
const sellerPayout = orderAmount - platformFee;  // 90% to seller
```
Both `platform_fee` and `seller_payout` are persisted on the `orders` row.

---

### `/src/actions/animals.ts`
CRUD for animal listings. Includes seller-scoped access (sellers can only edit their own), view counters, Cloudinary image uploads, category/state filters.

### `/src/actions/cart.ts`
Add-to-cart, remove, adjust quantity — all scoped to the current user's session.

### `/src/actions/users.ts`
Registration, profile updates, seller verification document uploads.

---

## API Routes Layer (`/src/app/api/**/route.ts`)

REST-style endpoints are used for: client-side fetching, AJAX updates, NextAuth, and **Paystack webhooks**. They share the same `prisma` singleton from `/src/lib/prisma.ts` but authenticate differently.

### Auth Helper Pattern (used across API routes)
```typescript
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('farmmart_session_token')?.value;
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;  // { userId, role, email, ... }
}
```
Endpoints then use `user.userId` and `user.role` to scope queries.

---

### `/src/app/api/orders/route.ts`
| Method | Behavior |
|--------|----------|
| **GET** | Returns current user's orders.<br>• BUYER → `where: { buyer_id: userId }`<br>• SELLER / ADMIN → `where: { animals: { seller_id: userId } }` (orders for their listings)<br>Both include related `users` (buyer) and `animals` data, ordered by `created_at DESC`. |
| **POST** | Creates a **PENDING** order directly (bypasses Paystack init flow — useful for admin/direct orders). **Also computes `platform_fee` (10%) and `seller_payout` (90%)** before inserting. |

---

### `/src/app/api/inquiries/route.ts`
| Method | Behavior |
|--------|----------|
| **GET** | Returns the user's inquiry inbox.<br>• SELLER/ADMIN → `where: { receiver_id: userId }` (incoming messages)<br>• BUYER → `where: { sender_id: userId }` (sent messages)<br>Includes related `users_inquiries_sender_idTousers` / `…_receiver_idTousers` and the linked `animals` listing. |
| **POST** | Creates a new inquiry. Required JSON body: `{ receiverId, animalId, message }`. Auto-sets `sender_id` from session token and `status: 'UNREAD'`. |
| **PUT** | Updates an inquiry's status. Body: `{ id, status }` → used to mark UNREAD → READ → REPLIED. |

> **Note:** There is **no database "reply" relationship**. When a seller replies from the UI, the system creates a *new inverted* `inquiries` row (swap sender/receiver), with the reply prefixed `RE: {animalName}\n\n{reply}`. The original inquiry is simply marked `REPLIED`. This keeps the model simple and symmetric for both users.

---

### `/src/app/api/paystack/webhook/route.ts`
**Mission critical** — this is the **source of truth** for payment success. Paystack calls this URL *server-to-server* after a charge succeeds (or fails). It **cannot** be spoofed.

#### Step-by-step flow:
1. **Validate signature** (`validateWebhookSignature(rawBody, x-paystack-signature)`) — uses the Paystack secret key via HMAC SHA512.
2. **Parse JSON event** — Paystack sends events (only `charge.success` is handled).
3. **Re-verify directly with Paystack** (`verifyPayment(reference)`) — never trust the webhook body alone; this second API call confirms the reference actually exists and is successful.
4. **Idempotency check** — looks for any `orders` whose `paystack_ref` starts with the Paystack reference. If found → respond 200 OK and skip. This prevents double-charging if Paystack retries.
5. **Resolve user** — from `metadata.userId`, otherwise fall back to `customer.email` and look up in the `users` table.
6. **Load the user's cart** at payment-init time (cart items are NOT cleared until the webhook fires — this is the safety net).
7. **Amount match check** — `calculateCartTotals(cartItems)` returns the expected kobo total; it must match `verification.data.amount`. If not → log and return 200 (do NOT create orders).
8. **Prisma `$transaction`** (atomic block — either everything succeeds or nothing):
   - For each cart item:
     - Skip if the animal is no longer `AVAILABLE` (race condition protection).
     - **Compute `platformFee = orderAmount * 0.10`, `sellerPayout = orderAmount - platformFee`**.
     - Insert `orders` with `status: 'PAID'` and `paid_at` timestamp from Paystack.
     - `UPDATE animals SET status = 'SOLD'`.
   - `DELETE FROM cart WHERE user_id = ?`.
9. Respond **200 OK** — Paystack requires 2xx to stop retrying.

> **Debugging tip:** Even in the catch block, this handler returns 200. This is intentional — if Paystack receives a 5xx it will retry for ~48h, which can cause duplicate work. Errors are logged to the server console via `console.error`.

---

### Other Key API Endpoints
| Route | Purpose |
|-------|---------|
| `/api/auth/…` | NextAuth + manual flows: login, register, logout, me, forgot-password, reset-password |
| `/api/animals/[…id]` | List animals (public), create (seller), update, delete |
| `/api/cart` | Add/remove/list cart items (JWT-scoped) |
| `/api/favourites` | Save / remove listings |
| `/api/reviews` | Leave / fetch reviews |
| `/api/users` | Admin user management |
| `/api/price-index` | Aggregated price data per category/state |
| `/api/test` | Health-check endpoint |

---

## Seller-Facing Pages (`/src/app/seller/`)

All seller pages are wrapped in **`/src/app/seller/layout.tsx`**:
- Client component that uses `useSession()` from `/src/lib/auth-client`
- Redirects to `/login` if logged out
- Redirects to `/dashboard` if the user is not a SELLER
- Renders the `<Sidebar />` + a `<main>` content area

### `/src/app/seller/dashboard/page.tsx` — Seller Dashboard
**"Inventory Overview"** — the seller's command center.

**Data fetched (client-side `useEffect` → parallel `fetch` calls):**
- `GET /api/animals?sellerId=…` → seller's listings
- `GET /api/orders` → orders for their animals

**Top Revenue Cards (updated August 2026):**
1. **Gross Sales** — sum of `amount` for non-CANCELLED orders
2. **Net Payout (After 10% Fee)** — sum of `seller_payout`, falling back to `amount × 0.90` for old orders (this ensures backward compatibility with rows created before the fee columns existed)
3. **Platform Fees Paid** — sum of `platform_fee`, falling back to `amount × 0.10`

**Other dashboard features:**
- **Herd Growth Analytics** bar chart — listings per month (last 7 months), with Active Head Count (extracted from the listing description's "X Head" pattern) and Active Market Listings count.
- **Create New Listing CTA** → links to `/seller/animals/new`.
- **Active Listings** preview (first 4 AVAILABLE animals).
- **Recent Activity** feed (last 3 items — mixes orders & new listings). Each order shows:
  - Order status + ID
  - Buyer name
  - **Seller Payout** in the subtitle (e.g. "By John Doe • Payout: ₦450,000")
  - Gross amount in the right column

Fallback math (for legacy orders where `platform_fee`/`seller_payout` columns are 0):
```typescript
const payout = Number(order.seller_payout ?? (gross * 0.90));
```
This graceful fallback means you don't need to back-fill old orders — they will render correctly immediately.

---

### `/src/app/seller/inquiries/page.tsx` — (NEW — August 2026)
**Buyer Inquiries Page** — accessible via the sidebar link **"Buyer Inquiries"**.

Two-column messaging layout:

**Left column (Inquiries List):**
- Each item shows:
  - Buyer avatar + name
  - Animal the inquiry is about ("Re: Cow - Holstein")
  - Truncated message preview
  - Status badge: **UNREAD** (rose), **READ** (amber), **REPLIED** (emerald)
  - Timestamp
- Background color visually distinguishes UNREAD messages
- Top of page shows **"N unread"** badge count
- Empty state: SVG envelope icon + friendly guidance text

**Right column (Detail + Reply Panel):**
- Header:
  - Animal image, name, breed, category, price
  - Inquiry status badge
  - Received-at timestamp
- Message thread:
  - Buyer avatar, name, email
  - Their full message in a chat bubble (whitespace preserved via `whitespace-pre-wrap`)
- Reply composer:
  - Textarea with guidance placeholder
  - **"Clear"** button
  - **"Send Reply"** button (disabled while sending, shows spinner)
  - On submit:
    1. `PUT /api/inquiries` → marks the original as `REPLIED`
    2. `POST /api/inquiries` → creates a **new inverted inquiry** back to the buyer (`receiverId = original.sender_id`) with the text prefixed `"RE: {animalName}\n\n{reply}"`
- Side effects: Selecting a UNREAD item automatically calls the API to mark it READ.

This uses the same `getImageUrl()` helper as the dashboard (robustly handles double/triple-stringified image arrays from Cloudinary).

---

### `/src/app/seller/orders/page.tsx` — Seller Orders Table
Orders for the seller's animals, fetched via `getSellerOrders()` server action.

**Table columns (updated August 2026):**

| Column | Rendering |
|--------|-----------|
| Order ID | First 8 chars of UUID with ellipsis |
| Date | `toLocaleDateString()` |
| Buyer | `order.users?.name` |
| Animal | `order.animals?.name` |
| **Gross Amount** | ₦ formatted `order.amount` (gray-300) |
| **Platform Fee (10%)** | `-₦{platformFee}` in **amber** |
| **Your Payout** | ₦ formatted in **bold emerald** (the seller's take-home) |
| Status | `<OrderStatusUpdater>` — a `<select>` that calls `updateOrderStatus()` server action live |

Same fallback math as the dashboard:
```typescript
const platformFee = Number(order.platform_fee ?? (gross * 0.10));
const payout      = Number(order.seller_payout  ?? (gross * 0.90));
```

---

### Other Seller Routes
| Route | Purpose |
|-------|---------|
| `/seller/animals` | Full inventory list + actions (edit, delete, mark sold) |
| `/seller/animals/new` | Create a new animal listing (Cloudinary upload, breed/price/health fields) |
| `/seller/animals/[id]/edit` | Edit an existing listing via `SellerEditAnimalForm.tsx` |
| `/seller/analytics` | Seller-specific revenue & sales charts |
| `/seller/settings` | Seller profile, farm info, verification documents |
| `/seller/help-center` | FAQ / support info |

---

## Sidebar Navigation (`/src/components/layout/Sidebar.tsx`)

A client component (`"use client"`). Renders **two different link sets** depending on `session.user.role`:

### Seller Links (August 2026 order)
1. 📊 **Seller Dashboard** → `/seller/dashboard` (OverviewIcon)
2. 💬 **Buyer Inquiries** → `/seller/inquiries` (**NEW — InquiriesIcon**)
3. 📦 **Buyer Orders** → `/seller/orders` (OrdersIcon)
4. 🐄 **Inventory Track** → `/seller/animals` (InventoryIcon)
5. 📈 **Seller Analytics** → `/seller/analytics` (AnalyticsIcon)
6. ⚙️ **Settings** → `/seller/settings` (SettingsIcon)

Plus:
- Primary CTA button: **"New Livestock Listing"** → `/seller/animals/new`
- Secondary: Help Center + Logout (calls `signOut({ callbackUrl: "/" })`)

### InquiriesIcon (NEW)
Added inline in this file. It's a chat-bubble SVG with three dots (`.01` characters = typical unread indicator):
```xml
<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14…5l-5 5v-5z" />
```

---

## Authentication Flow (`/src/lib/auth.ts`, `/src/lib/auth-client.ts`)

Dual strategy:
- **`/src/lib/auth.ts` (server-side)** — `getCurrentUser()` for Server Actions / RSC — reads session cookie, verifies JWT with `jose`, returns `{ id, role, email, ... }`
- **`/src/lib/auth-client.tsx` (client-side)** — wraps NextAuth's `useSession` / `signOut` for components. Client pages check `session?.user.role === "SELLER"` to gate content.

Session cookie name: **`farmmart_session_token`**.

---

## Payment Checkout Flow (End-to-End)

```
User adds animals to cart
  → /cart page
    → User clicks "Checkout"
      → /checkout page (CheckoutClient.tsx)
        → Fills address + phone + notes
        → Clicks "Pay with Paystack"
          → Calls server action: initializePaystackPayment()
            → Computes cartTotal + ₦5000 shipping + 7.5% tax
            → Calls Paystack /transaction/initialize
            → Returns authorization_url
          → Browser redirects to Paystack hosted form
            → User pays
              → Paystack redirects (browser) back to FarmMart callback URL
              → Paystack POSTs (server) → /api/paystack/webhook
                → Signature verified
                → Payment re-verified with Paystack API
                → Idempotency + amount checks
                → For each cart item:
                    → Calculates: platformFee = amount × 10%, sellerPayout = amount × 90%
                    → orders INSERT (status=PAID, platform_fee, seller_payout, paid_at)
                    → animals.status = SOLD
                → Cart is cleared
              → Redirect page calls createOrder() server action
                → (redundant safety create — idempotent, won't double-insert)
              → User lands on /buyer/orders with PAID status
                → Seller sees it appear in /seller/orders
                → Seller advances: PAID → CONFIRMED → SHIPPED → DELIVERED
```

**Why the fee is calculated in BOTH `webhook/route.ts` AND `orders.ts`:**
- The **webhook** is the canonical path (Paystack forces it).
- `createOrder()` in `actions/orders.ts` is a *fallback/manual* path used by the redirect page; both must produce identical data.

---

## Key Library Files (`/src/lib/`)

| File | Purpose |
|------|---------|
| `/src/lib/prisma.ts` | Singleton Prisma Client (`globalThis.prisma` pattern — avoids new connections per HMR reload in dev) |
| `/src/lib/paystack.ts` | `initializePayment()`, `verifyPayment()`, `validateWebhookSignature()` — typed wrappers around Paystack REST API |
| `/src/lib/auth.ts` | Server-side `getCurrentUser()` (JWT cookie verify with jose) |
| `/src/lib/auth-client.tsx` | Client-side NextAuth provider + hooks |
| `/src/lib/cloudinary.ts` | Cloudinary upload helpers (animal listing images) |
| `/src/lib/mailer.ts` | Nodemailer / SMTP (forgot password, order notifications) |
| `/src/lib/firebase.ts` | Firebase config (historically used for `firebase_uid` on the `users` table) |
| `/src/lib/rate-limit.ts` | IP+user rate limiting for login/register endpoints |
| `/src/lib/session.ts` | JWT session creation utilities |
| `/src/lib/uploadAction.ts` | Server action for image uploads |

---

## Custom Hooks (`/src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useAnimals` | Fetches/filters the animal catalog client-side |
| `useCart` | Add/remove/count items — mirrors the cart API state |
| `useOrders` | Fetches current user's orders with refetch helpers |

---

## Styling & UI Foundation

- **Tailwind CSS** (globals imported from `/src/app/globals.css`)
- **Color palette (seller context):** `bg-emerald-950` (deep forest green), `border-emerald-800`, `text-emerald-100/300/400` for content, `bg-emerald-600` primary buttons, **amber** for fees/warnings, **rose** for unread/errors.
- Components under `/src/components/ui/`:
  - `Button.tsx`, `Card.tsx`, `Badge.tsx`, `Input.tsx`, `Icons.tsx`, `OrderTimeline.tsx`, `SafeImage.tsx`
- Components under `/src/components/features/`:
  - `AnimalCard.tsx`, `AnimalForm.tsx`, `CartItem.tsx`, `FilterPanel.tsx`

---

## Deployment Notes & Required Environment Variables

```
DATABASE_URL=postgresql://user:pass@host:5432/farmmart
JWT_SECRET=super_secret_jwt_key_for_farmmart_2026
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=…
PAYSTACK_SECRET_KEY=sk_test_…
PAYSTACK_PUBLIC_KEY=pk_test_…
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
```

**Critical:** The Paystack webhook URL in the Paystack Dashboard must be set to:
```
https://<your-domain.com>/api/paystack/webhook
```
For local development, use `npx ngrok http 3000` and update the webhook URL with the ngrok host.

---

## Summary of Recent Changes (August 18–19, 2026)

### 1. 10% Platform Transaction Fee System
Every order now retains 10% for FarmMart and pays 90% to the seller.

**Files modified:**
| File | Change |
|------|--------|
| `/prisma/schema.prisma` | Added `orders.platform_fee` + `orders.seller_payout` (Decimal, default 0) |
| `/src/app/api/paystack/webhook/route.ts` | Calculates `platformFee = orderAmount × 0.10`, `sellerPayout = orderAmount × 0.90` and inserts them inside the `$transaction` loop |
| `/src/actions/orders.ts` | Same fee math in `createOrder()` server action for the fallback/manual order path |
| `/src/app/api/orders/route.ts` | POST endpoint now also computes fee/payout when creating PENDING orders |
| `/src/app/seller/dashboard/page.tsx` | Replaced single "Total Sales Value" with 3 cards: **Gross Sales**, **Net Payout (After 10% Fee)**, **Platform Fees Paid**; recent activity shows payout per order in subtitle |
| `/src/app/seller/orders/page.tsx` | Added **Gross Amount / Platform Fee (10%) / Your Payout** columns with color coding (amber for fees, bold emerald for payout) |

**Backward compatibility:** All seller-side rendering uses safe fallbacks:
```ts
platformFee = order.platform_fee ?? (gross * 0.10)
sellerPayout = order.seller_payout ?? (gross * 0.90)
```
Pre-existing orders where columns are 0 will still display correctly immediately.

### 2. Seller Inquiries — Buyer Messages Page
Sellers now have a dedicated inbox UI to read and reply to buyer inquiries.

**Files added/modified:**
| File | Change |
|------|--------|
| `/src/app/seller/inquiries/page.tsx` | **NEW FILE** — full 2-column messaging UI: list panel + detail panel + reply composer, auto-mark READ on selection, REPLIED status on send, status badges, empty state, buyer/animal metadata |
| `/src/components/layout/Sidebar.tsx` | Added `InquiriesIcon` SVG component; inserted **"Buyer Inquiries"** into `sellerLinks` as the second menu item (after Seller Dashboard) |

**Required follow-up command (once per environment):**
```bash
npx prisma migrate dev --name add-transaction-fees
```
This creates the DB columns. The Prisma client should also be regenerated after schema changes:
```bash
npx prisma generate
```
