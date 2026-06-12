# TerraTrace Pro - Project Documentation

## Overview
TerraTrace Pro is a modern agritech platform (formerly FarmMart) designed to streamline agricultural operations, animal management, and marketplace transactions. The project is built using **Next.js**, **TypeScript**, and **Tailwind CSS**, following a clean and professional emerald-green, black, and white color scheme.

## Project Structure

### 1. Core Architecture
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript for type safety and better developer experience.
- **Styling**: Tailwind CSS for responsive and consistent UI components.
- **State Management**: React Hooks (`useState`, `useEffect`) and Context API for authentication state.
- **Storage**: A custom `localStorageDb.ts` for local data persistence, simulating a real database environment for development and prototyping.

### 2. Key Directories

#### `src/app/`
Contains the application's pages and API routes.
- **`(auth)/`**: Login and registration pages.
- **`admin/`**: Dashboard, analytics, user management, and moderation for administrators.
- **`seller/`**: Dashboard and animal listing management for sellers.
- **`buyer/`**: Dashboard, order history, and cart for buyers.
- **`listings/`**: Marketplace where users can browse and view animal details.
- **`api/`**: Backend logic for authentication, orders, cart, and animal listings.

#### `src/components/`
Reusable UI and feature-specific components.
- **`ui/`**: Atomic components like `Button`, `Input`, `Badge`, and `Card`.
- **`layout/`**: Global components like `Navbar`, `Footer`, and `Sidebar`.
- **`auth/`**: Authentication forms and containers.
- **`features/`**: Complex components like `AnimalCard`, `CartItem`, and `FilterPanel`.

#### `src/lib/`
Utility functions and external service integrations.
- **`auth-client.tsx`**: Client-side authentication logic.
- **`localStorageDb.ts`**: The core data management layer using browser local storage.
- **`cloudinary.ts`**: Integration for image uploads to Cloudinary.
- **`paystack.ts`**: Payment gateway integration.

#### `src/types/`
TypeScript interface and type definitions used across the project to ensure data consistency.

## Core Features

### 1. Authentication
- Multi-role support: **Buyer**, **Seller**, and **Admin**.
- Secure registration and login flows.
- Admin portal protected by a secret key.

### 2. Marketplace & Listings
- Browsing animals with advanced filtering.
- Detailed animal profiles including health status, price, and images.
- Sustainable practices and community network integration on the landing page.

### 3. Dashboard Systems
- **Admin**: Overview of platform health, user moderation, and sales analytics.
- **Seller**: Manage animal inventory, track orders, and monitor revenue.
- **Buyer**: Track active orders, manage shopping cart, and view history.

### 4. Order Management
- Full checkout flow with simulated payment processing.
- Cart persistence using local storage.
- Status tracking (Pending, Delivered, etc.).

### 5. Image Handling
- Integrated `ImageUpload` component using Cloudinary for cloud-based asset management.

## Technical Highlights
- **Color Scheme**: Standardized to Emerald (Green), Black, and White for a professional agritech brand identity.
- **Local Persistence**: Uses a custom-built database layer over `localStorage` for seamless offline-first development.
- **Responsive Design**: Mobile-first approach using Tailwind's utility classes.
- **Type Safety**: Extensively typed interfaces for Animals, Users, Orders, and Cart items.

---
*Created on 2026-06-11 for the TerraTrace Pro platform.*
