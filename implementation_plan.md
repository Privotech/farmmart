# Replace LocalStorageDb with MySQL (Prisma) APIs

This document outlines the systematic plan to replace the mock `localStorageDb.ts` data layer with your actual MySQL database via the existing Next.js API routes (powered by Prisma).

## User Review Required
> [!IMPORTANT]
> This is a massive refactoring effort that touches almost every route in the frontend. Please review the plan below. I will proceed step-by-step to minimize breakages.

## Open Questions
> [!WARNING]
> 1. Authentication Strategy: You currently use a mock `src/lib/auth-client.tsx` that manages session state. There is also a NextAuth configuration in `/api/auth/[...nextauth]`. Do you want me to update `auth-client.tsx` to call your custom endpoints (`/api/auth/register`, `/api/auth/login`), or do you want to switch entirely to using `next-auth/react` hooks (`useSession`, `signIn`, `signOut`)?
> 2. Fetching Strategy: Do you want me to use standard `fetch` inside `useEffect` (or Server Components where applicable), or do you have a preferred library like `axios` or `SWR`/`React Query` installed? I will default to standard `fetch` in Client Components if no preference is given.

## Proposed Changes

---

### Phase 1: Authentication Migration
Update the authentication flow to hit the MySQL database.
- **Modify** `src/lib/auth-client.tsx` (or switch to `next-auth` if requested)
  - `signIn` should authenticate against the database (via `/api/auth/login` or `NextAuth`).
  - `signUp` should POST to `/api/auth/register`.
- **Modify** `src/components/auth/AuthContainer.tsx` and `AdminAuthContainer.tsx` to handle async database login responses.

---

### Phase 2: Animal Listings & Seller Operations
Update all inventory and market listing pages.
- **Modify** `src/app/listings/page.tsx` & `src/app/listings/[id]/page.tsx`
  - Replace `localStorageDb.getAnimals(filters)` with `fetch('/api/animals?category=...')`.
  - Replace `localStorageDb.getAnimalById(id)` with `fetch('/api/animals/[id]')`.
- **Modify** `src/app/seller/dashboard/page.tsx` & `src/app/seller/animals/page.tsx`
  - Fetch seller-specific listings using `/api/animals?sellerId=...`.
- **Modify** `src/app/seller/animals/new/page.tsx` & `src/app/seller/animals/[id]/edit/page.tsx`
  - Replace `createAnimal` and `updateAnimal` with `POST` and `PUT` to `/api/animals`.

---

### Phase 3: Cart & Checkout
Migrate the shopping cart and checkout processes.
- **Modify** `src/app/cart/page.tsx`
  - Replace `getCartItems` with `GET /api/cart`.
  - Replace `removeFromCart` with `DELETE /api/cart`.
- **Modify** `src/app/checkout/page.tsx`
  - Replace `createOrder` with `POST /api/orders` to simulate payments and insert records into the database.

---

### Phase 4: Order Management & Analytics
Update dashboards and analytics views.
- **Modify** `src/app/seller/orders/page.tsx` & `src/app/buyer/orders/page.tsx`
  - Replace `getSellerOrders` and `getOrders` with `GET /api/orders`.
- **Modify** `src/app/seller/analytics/page.tsx`
  - Aggregate metrics from the fetched `GET /api/orders` and `GET /api/animals`.
- **Modify** `src/app/admin/orders/page.tsx`
  - Admin view to fetch all orders via `GET /api/orders`.

---

### Phase 5: Admin Panel & User Moderation
Update the super-admin moderation routes.
- **Modify** `src/app/admin/users/page.tsx`
  - Fetch users from `GET /api/users`.
- **Modify** `src/app/admin/moderation/page.tsx`
  - Fetch listings and approve/reject via `PUT /api/animals/[id]`.
- **Modify** `src/app/admin/dashboard/page.tsx` & `src/app/admin/analytics/page.tsx`
  - Fetch aggregated counts for users, listings, and total revenue via APIs.

---

### Phase 6: Deletion
- **Delete** `src/lib/localStorageDb.ts` completely once all references have been removed and replaced with database API calls.

## Verification Plan

### Automated Tests
- Run `npm run build` or Next.js type checker to ensure no lingering `localStorageDb` imports exist.

### Manual Verification
- Test User Registration & Login (as Buyer, Seller, Admin).
- Test browsing the market, applying filters, and viewing animal details.
- Test adding an animal to the cart and completing a checkout.
- Test that the Seller Dashboard reflects new orders and inventory.
- Verify Admin Dashboard can retrieve and update user/order statuses.
