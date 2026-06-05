# Implementation Plan - Use localStorage for Signup and Login

This plan outlines the changes to implement client-side authentication and mock database operations using browser `localStorage`. This allows the application to fully run, test, and authenticate without requiring a running SQL database server. Later, when the SQL database is created, the system can easily be transitioned back.

## Proposed Changes

We will introduce a client-side localStorage authentication and mock database service. This client service will act as a drop-in replacement for the components that import `next-auth/react`.

### Custom Auth Client Component

#### [NEW] [auth-client.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/lib/auth-client.tsx)
Create a client-side authentication provider and hooks that:
- Manage the list of registered users under `farmmart_users` in `localStorage`.
- Manage the active session under `farmmart_session` in `localStorage`.
- Mock NextAuth's `useSession()`, `signIn()`, `signOut()`, and `SessionProvider` so we can replace next-auth imports directly.
- Export a custom `signUp` function to register a new user in `localStorage`.

### LocalStorage Mock DB for Listings, Cart, and Orders

#### [NEW] [localStorageDb.ts](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/lib/localStorageDb.ts)
Implement helper functions for managing listings, cart items, and orders in `localStorage` so they do not error out when the MySQL database is offline:
- **Listings (Animals)**: Initialized with default mock animals (`/cow.svg` as image).
- **Cart**: Associated with the logged-in user's email.
- **Orders**: Associated with the logged-in user's email.

### Client Pages Update
Update the pages and components to import `useSession`, `signIn`, and `signOut` from `@/lib/auth-client` instead of `next-auth/react`, and call the localStorage-based database functions instead of API calls.

#### [MODIFY] [AuthContainer.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/components/auth/AuthContainer.tsx)
- Replace imports of `next-auth/react` with `@/lib/auth-client`.
- Update `handleRegisterSubmit` to call the local `signUp` function.
- Update `handleLoginSubmit` to call the local `signIn` function.

#### [MODIFY] [Navbar.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/components/layout/Navbar.tsx)
- Replace imports of `next-auth/react` with `@/lib/auth-client`.

#### [MODIFY] [Sidebar.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/components/layout/Sidebar.tsx)
- Replace imports of `next-auth/react` with `@/lib/auth-client`.

#### [MODIFY] [providers.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/app/providers.tsx)
- Replace NextAuth's `SessionProvider` with the local mock `SessionProvider` from `@/lib/auth-client`.

#### [MODIFY] [DashboardPage](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/app/dashboard/page.tsx)
- Replace imports of `next-auth/react` with `@/lib/auth-client`.
- Load recent orders and active listings statistics from `localStorageDb` (or mock them).

#### [MODIFY] [listings/page.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/app/listings/page.tsx)
- Fetch animals from `localStorageDb` instead of `/api/animals`.
- Implement `handleAddToCart` using `localStorageDb`.

#### [MODIFY] [listings/[id]/page.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/app/listings/%5Bid%5D/page.tsx)
- Fetch animal detail from `localStorageDb` instead of `/api/animals/[id]`.
- Implement `handleAddToCart` using `localStorageDb`.

#### [MODIFY] [cart/page.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/app/cart/page.tsx)
- Replace imports of `next-auth/react` with `@/lib/auth-client`.
- Fetch and delete cart items from `localStorageDb` instead of `/api/cart`.

#### [MODIFY] [checkout/page.tsx](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/src/app/checkout/page.tsx)
- Replace imports of `next-auth/react` with `@/lib/auth-client`.
- Fetch cart items and create order using `localStorageDb`.
- Mock or route Paystack redirect to a success page or back to dashboard.

### Middleware Bypass

#### [MODIFY] [middleware.ts](file:///c:/Users/Priviledge/Desktop/Privilege%20real%20portfolio/farmmart/middleware.ts)
- Bypass server-side authorization checks since localStorage is not available on the server edge runtime. Client components will safely handle redirects.

## Verification Plan

### Automated / Manual Verification
1. Start the development server using `npm run dev`.
2. Open the page in a browser and verify that browsing listings loads successfully.
3. Test signup with a new account. Ensure users are saved in localStorage.
4. Test login with credentials. Verify that the user state is updated in the Navbar and Sidebar.
5. Add items to the cart, verify items persist in the cart page.
6. Verify access to the dashboard page when logged in.
7. Verify that trying to access the dashboard when logged out redirects to `/login`.
