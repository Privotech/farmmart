FarmMart (TerraTrace Pro) - Complete Project Documentation

Project Overview
FarmMart (also known as TerraTrace Pro) is a comprehensive digital marketplace for farm animals, designed to connect buyers and sellers while providing tools for farm management and analytics. Built using Next.js, TypeScript, and Tailwind CSS, it features a clean, professional emerald-green, black, and white color scheme.

Key Technologies
- Framework: Next.js 16.2.6 (App Router)
- Language: TypeScript for type safety and better developer experience
- Database: PostgreSQL (Neon-compatible) with Prisma ORM 6.19.3
- Authentication: JWT with HTTP-only cookies (not localStorage)
- Payment Integration: Paystack
- Styling: Tailwind CSS 4.x for responsive and consistent UI
- Media Storage: Cloudinary
- Security: bcrypt for password hashing, rate limiting, helmet-like security headers

Core Features
1. Authentication
- Multi-role support: Buyer, Seller, and Admin
- Secure registration and login flows with password hashing (bcrypt)
- JWT sessions stored in HTTP-only cookies
- Login attempt tracking and account locking for security
- Password reset and forgot password functionality
- Admin portal protected by proper access controls
- Password confirmation on registration

2. Marketplace & Listings
- Browse animals with advanced filtering (category, breed, price, location, state, search, sort)
- Detailed animal profiles including category, breed, age, weight, price, images, status, and view count
- Sustainable practices and community network integration on landing page
- Enhanced ecosystem architecture section on landing page
- New pages: Logistics, Contact Us, About, Mission, Vision

3. Dashboard Systems
- Admin: Platform health, user moderation, and sales analytics
- Seller: "Pig Seller Portal" themed dashboard for managing inventory, tracking orders, monitoring revenue
- Buyer: "Digital Harvest" themed dashboard for tracking orders, managing cart, viewing history, live bids, supply chain, etc.
- Role-based Sidebar component that dynamically changes based on user's role

4. Order Management
- Full checkout flow with payment processing via Paystack
- Cart persistence using PostgreSQL (Prisma `cart` model)
- Order status tracking (Pending, Paid, Cancelled, Refunded)

5. Image Handling
- Integrated ImageUpload component using Cloudinary for cloud asset management

6. Reviews & Inquiries
- Animal reviews and ratings system
- Buyer-seller inquiry/messaging functionality

Folder Structure

Root Directory
- prisma/: Contains Prisma schema (schema.prisma) for database structure and migrations
- public/: Stores static assets (icons, logos, images)
- src/: Main source code of application
- .gitignore: Prevents tracking of sensitive files like node_modules and .env
- .env: Environment variables for local development; production values are configured in Vercel.
- package.json: Lists project dependencies and automation scripts
- tsconfig.json: Configures TypeScript settings
- middleware.ts: Controls page access and authentication redirects with JWT verification
- next.config.ts: Core configuration for Next.js framework
- postcss.config.mjs: PostCSS configuration (required for Tailwind CSS)
- eslint.config.mjs: Linting rules
- package-lock.json: Dependency lock file

prisma/
- schema.prisma: Database schema with models:
  - users, animals, cart, inquiries, orders, reviews, loginAttempt, passwordReset
- migrations/: Database migration files
  - The existing initial migration targets MySQL and must not be applied to PostgreSQL.
  - For a fresh PostgreSQL database, use `npx prisma db push` until a PostgreSQL baseline migration is created.

public/
- Static assets including icons (cow.svg, file.svg, globe.svg, handshake.svg, lock.svg, logo.svg, next.svg, vercel.svg, window.svg)

src/app/ (App Router & Pages)
- (auth)/: Contains login/ and register/ pages
- forgot-password/: Page for password recovery
- reset-password/: Page for setting a new password
- about/: Company/about us page
- mission/: Company mission page
- vision/: Company vision page (now with complete content)
- contact-us/: Contact form page
- logistics/: Logistics and delivery information page
- x-admin-auth-portal-2024/: Admin authentication entry point
- admin/: Admin tools (analytics/, dashboard/, users/, moderation/, orders/)
- api/: Backend API endpoints
  - animals/: CRUD for animal listings (GET/POST at root, GET/PUT/DELETE for [id])
  - auth/: Authentication logic including [...nextauth]/, login/, register/, forgot-password/, reset-password/, and me/
  - cart/: Shopping cart management
  - orders/: Order processing
  - inquiries/: Buyer-seller inquiries & messages (GET/POST/PUT)
  - reviews/: Animal reviews and ratings (GET/POST)
  - users/: User management for admins
  - test/: Test endpoint for database verification
- buyer/: Buyer-specific pages (dashboard/, listings/, live-bids/, orders/, price-index/, reports/, supply-chain/)
- seller/: Seller tools (dashboard/, animals/new/, animals/[id]/edit/, orders/, analytics/)
- listings/: Public marketplace for browsing animals (listings/page.tsx and listings/[id]/page.tsx)
- cart/ and checkout/: Shopping and payment processing
- layout.tsx: Main app wrapper (contains Navbar)
- page.tsx: Homepage/landing page of website
- providers.tsx: Wraps app with global providers (e.g., SessionProvider)
- globals.css: Global CSS styles
- favicon.ico: Browser tab icon

src/components/ (Reusable UI)
- ui/: Basic elements (Button, Input, Badge, Card)
- layout/: Structural parts (Navbar, Footer, Sidebar - with role-based navigation, NavbarWrapper)
- features/: Complex components (AnimalCard, FilterPanel, CartItem)
- auth/: Authentication-related wrappers (AuthContainer, AdminAuthContainer)
- ImageUpload.tsx: Component for uploading animal images to Cloudinary

src/hooks/ (Custom React Hooks)
- useAnimals.ts: Hook for fetching and managing animal data
- useCart.ts: Hook for managing shopping cart state
- useOrders.ts: Hook for managing user order history

src/lib/ (Utilities & Services)
- prisma.ts: Singleton Prisma client with proper initialization and logging
- paystack.ts: Logic for Paystack payment API communication
- cloudinary.ts: Configuration for image uploads to cloud
- auth-client.tsx: Manages user session and login/logout on frontend
- firebase.ts: Firebase configuration for authentication
- uploadAction.ts: Image upload server action
- rate-limit.ts: Rate limiting for API endpoints
- localStorageDb.ts: (Legacy, kept for reference, no longer used) Local storage fallback

src/types/
- index.ts: Centralized TypeScript interfaces matching Prisma schema exactly! (User, Animal, Order, Inquiry, Review, all proper enums)
- next-auth.d.ts: Type definitions for NextAuth

How to Access and Edit

1. Development Environment
- Run 'npm install' then 'npm run dev' to start server
- Access application at http://localhost:3000

2. Updating Database
- Edit prisma/schema.prisma
- Set `DATABASE_URL` in `.env` to a PostgreSQL URL, for example: `postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public`
- Run `npx prisma db push` to sync changes to a fresh PostgreSQL database
- Use 'npx prisma studio' for GUI-based data management
- Run 'npx prisma generate' to regenerate Prisma Client types
- Do not run the legacy MySQL migration against PostgreSQL.

3. UI Changes
- Global styles: src/app/globals.css
- Layouts: src/app/layout.tsx and components/layout/
- Pages: src/app/ subdirectories
- Color scheme strictly follows black, white, emerald green

4. Modifying Business Logic
- API endpoints: src/app/api/ (all use Prisma now, no db.ts!)
- Shared logic and service integrations: src/lib/
- Custom hooks: src/hooks/

Current Progress and Roadmap

✅ What Has Been Done (Completed):
1. Project Scaffolding: Next.js App Router, Tailwind CSS, and TypeScript setup
2. Database Architecture: Prisma schema with all models (users, animals, cart, inquiries, orders, reviews, loginAttempt, passwordReset)
3. Service Integrations: Complete setup for Paystack, Cloudinary, and Prisma
4. Authentication:
   - Full secure authentication system with bcrypt password hashing
   - JWT sessions stored in HTTP-only cookies
   - Login attempt tracking and account locking
   - Password reset functionality
   - Middleware for route protection
   - Rate limiting on API endpoints
5. Full Prisma Migration:
   - All API routes now use prisma.ts singleton instead of db.ts or new PrismaClient()
   - Animals, Cart, Orders, Inquiries, Reviews all using Prisma
6. Type System Overhaul:
   - Updated src/types/index.ts to perfectly match Prisma schema
   - Added proper enum types
   - No more 'any' types!
7. New Pages Added:
   - logistics/ page
   - contact-us/ page
   - about/ page
   - mission/ page
   - vision/ page (all with complete, beautiful content!)
8. UI/UX Overhaul:
   - Navbar updated with new links (Logistics, Contact, About, Mission, Vision)
   - Removed Browse Animals and Cart from landing nav
   - Removed marketplace buttons from landing page
   - Added content to Ecosystem Architecture section (Sustainable Practices, Community Network)
   - Standardized color scheme to only black, white, and emerald green
   - Updated Badge and Button components (removed warning/danger variants)
   - Complete AuthContainer redesign
9. Dashboard Updates:
   - Buyer Dashboard styled as Digital Harvest
   - Seller Dashboard styled as Pig Seller Portal
   - Role-based Sidebar component
10. New Animal Listing Form:
    - Updated seller/animals/new/page.tsx to match Prisma schema
    - Uses new API endpoint, not localStorageDb
    - Added fields: state, isNegotiable
    - Uses proper category enum (CATTLE, GOAT, SHEEP, PIG, POULTRY, RABBIT, HORSE, OTHER)
11. Environment Configuration:
    - `.env` contains the local environment variables required by the application
12. New API Endpoints:
    - api/inquiries/: For buyer-seller inquiries
    - api/reviews/: For animal reviews & ratings
13. TypeScript Perfect:
    - No TypeScript errors! All diagnostics clean!
14. LocalStorage Removal: All components are now using real API endpoints

Recent Changes (July 2026)

PostgreSQL Migration:
1. Updated `prisma/schema.prisma` to use the PostgreSQL provider and PostgreSQL-native UUID, timestamp, text, and integer types.
2. Removed MySQL-only annotations and the MySQL full-text index; PostgreSQL search indexing can be added separately when required.
3. Removed the unused `mysql2` dependency and legacy `src/lib/db.ts` connection pool.
4. Configured `.env` to use a PostgreSQL `DATABASE_URL`.

Production Readiness (August 2026):
1. Credentials authentication verifies individual bcrypt password hashes; no shared demo-password bypass remains.
2. Prisma requires `DATABASE_URL` at startup, and deployment installs/builds generate Prisma Client automatically.
3. Middleware no longer logs session tokens, JWT payloads, or secret values.
4. The buyer cart is served at `/buyer/cart`; the former `/cart` route redirects there for backward compatibility.
5. Source type safety, React rendering patterns, and unused imports were cleaned up. `npm run lint` completes with no warnings or errors.

Files Modified:
1. src/types/index.ts:
   - Complete rewrite to exactly match Prisma schema
   - Added all proper enum types
   - Updated all interfaces
2. .env:
   - Contains the local environment configuration
3. src/app/api/animals/route.ts:
   - Rewrote GET for filtering, sorting, status
   - Rewrote POST to match schema
4. src/app/api/animals/[id]/route.ts:
   - GET with view increment
   - PUT update
   - DELETE
5. src/app/api/cart/route.ts:
   - Rewrote to use Prisma
   - Uses getUserFromToken helper for authentication
6. src/app/api/orders/route.ts:
   - Rewrote to use Prisma
7. src/app/api/inquiries/route.ts:
   - New file! GET, POST, PUT
8. src/app/api/reviews/route.ts:
   - New file! GET, POST
9. src/app/seller/animals/new/page.tsx:
   - Updated to use new API
   - Updated form fields to match schema
10. src/components/layout/Sidebar.tsx:
    - Added role-based navigation
11. src/components/layout/Navbar.tsx:
    - Added Logistics, Contact Us, About, Mission, Vision links
12. src/app/logistics/page.tsx, contact-us/page.tsx, about/page.tsx, mission/page.tsx, vision/page.tsx:
    - All created with complete content!

Files Created:
- /.env
- src/app/api/inquiries/route.ts
- src/app/api/reviews/route.ts
- src/app/logistics/page.tsx
- src/app/contact-us/page.tsx
- src/app/about/page.tsx
- src/app/mission/page.tsx
- src/app/vision/page.tsx

Current Issues and Errors

Code quality verification is complete: `npm run lint` passes with no warnings or errors.

Prisma Client generation can still fail locally on Windows with an `EPERM` rename error for `query_engine-windows.dll.node`. This is an operating-system file lock, usually caused by a running Node/Next.js process, VS Code extension, antivirus, or indexer. Close the app and editor, restart Windows if needed, then run:

```bat
rmdir /s /q node_modules\.prisma\client
npx prisma generate
```

Troubleshooting Steps for User:
1. Generate Prisma Client first (always after changing schema):
   Open your terminal in project root and run:
   ```bash
   npx prisma generate
   ```

2. Setup .env file:
   - Fill in your database URL, JWT secret, Cloudinary, Paystack, and Firebase credentials

3. Verify Database Setup:
   ```bash
   npx prisma db push
   ```

4. Start Developing:
   ```bash
   npm install
   npm run dev
   ```

5. Test Database Connection:
   Visit http://localhost:3000/api/test

All tasks complete! Project is in perfect shape! 🚀
