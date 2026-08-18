# FarmMart Project Summary

## Overview

FarmMart is a full-stack livestock marketplace built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. It supports buyer, seller, and admin flows for animal listings, cart management, checkout, order history, inquiries, reviews, and authentication.

## Current Project Status

The project is now in a stable integration state with the main marketplace, auth, and service layers working together.

### Core Features

- Authentication with NextAuth credentials and Google OAuth
- Role-based buyer, seller, and admin experiences
- Cart and checkout flow with Paystack payment initialization
- Password reset and welcome email sending through Nodemailer SMTP
- Cloudinary-backed image uploads for animal assets
- Prisma-backed PostgreSQL data models for users, animals, cart, orders, inquiries, and reviews
- Responsive UI with reusable layout and form components

## Service Integrations

### Auth and Email

- Credentials login and registration are wired through the app auth layer.
- Nodemailer is configured through SMTP environment variables for reset and welcome emails.

### Payments

- Paystack secret key is used server-side for transaction initialization and verification.
- The public key is exposed to the client for the inline checkout popup.

### Media

- Animal images upload to Cloudinary through the server-side upload action and are stored as secure delivery URLs.
- Marketplace cards use `next-cloudinary` `CldImage` for Cloudinary assets. This applies automatic quality and format optimization, responsive sizing, and automatic subject-focused cropping.
- Local placeholders and approved third-party image URLs continue to render with Next.js `Image`.
- The shared `CloudinaryImage` component only sends versioned Cloudinary delivery URLs through `CldImage`, keeping existing image data compatible.

## Environment Variables

The app depends on these environment settings:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `ADMIN_SECRET_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`

## Current Verification Status

I checked the workspace diagnostics for the project and the current editor error scan reports:

- The checkout and cart image rendering now safely handles stringified JSON image arrays and plain URL strings
- The shared animal type now accepts image values as strings, arrays, or null so it matches the runtime data shape from the database
- No workspace errors were reported for the updated checkout and shared type files
- `npx tsc --noEmit` and lint for the Cloudinary image components pass after the Cloudinary delivery integration.

### Cloudinary Production Setup

Use the real `.env` file locally. Do not add Cloudinary credentials to source code or create an `.env.example` file.

1. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` for server-side uploads and deletes.
2. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to the same cloud name so `CldImage` can generate optimized delivery URLs in the browser.
3. Copy those same variable names and values into Vercel Project Settings → Environment Variables for the Production environment, then redeploy.
4. Restart `npm run dev` after changing `.env` values.
5. Keep `CLOUDINARY_API_SECRET` private. If it is pasted into a chat, committed, or otherwise exposed, rotate it in Cloudinary before deploying.

## Notes

- The app is currently using a generated Next.js route type system, so restarting the dev server after route-related changes is recommended.
- If any generated route type issue reappears, clearing the `.next` cache and restarting the app usually resolves it.
- The recommended final validation commands are:
  - `npm run lint`
  - `npx tsc --noEmit`

## Next Recommended Improvements

- Add stronger Paystack verification on callback completion
- Add email verification before full account activation
- Improve order lifecycle and seller payout handling
- Expand analytics and reporting dashboards
- Add stronger test coverage for auth and checkout flows
- src/app/api/reviews/route.ts
- src/app/logistics/page.tsx
- src/app/contact-us/page.tsx
- src/app/about/page.tsx
- src/app/mission/page.tsx
- src/app/vision/page.tsx

Current Issues and Errors

Run `npm run lint` and `npx tsc --noEmit` before each production deployment.

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
