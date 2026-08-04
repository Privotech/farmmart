// src/types/index.ts

export type UserRole = "BUYER" | "SELLER" | "ADMIN";

export type OrdersStatus = 
  | "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" 
  | "pending" | "confirmed" | "shipped" | "delivered"
  | "completed" | "PAID" | "CANCELLED";

export type AnimalsCategory = 
  | "CATTLE" | "POULTRY" | "GOAT" | "SHEEP" | "PIG" | "FISH" | "OTHER"
  | string;

export type Numeric = number | { toString(): string };

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  firebase_uid?: string;
  firebaseUid?: string;
  is_verified?: boolean;
  isVerified?: boolean;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

export interface Animal {
  id: string;
  name: string;
  breed?: string | null;
  category?: AnimalsCategory;
  price: Numeric;
  weight?: Numeric | null;
  age?: number | null;
  description?: string | null;
  images?: string;
  type?: string;
  status?: string;           // Enables animal.status === "AVAILABLE"
  location?: string | null;   // Enables animal.location
  state?: string | null;      // Enables animal.state
  health_status?: string;
  is_negotiable?: boolean;
  isNegotiable?: boolean;
  view_count?: number;
  viewCount?: number;
  seller_id?: string;
  sellerId?: string;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
}

export interface AnimalFilters {
  category?: string;
  breed?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  location?: string;
  type?: string;
  healthStatus?: string;
  search?: string;
  sortBy?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  animalId: string;
  animal?: Animal;
}

export interface Order {
  id: string;
  amount?: Numeric;
  totalAmount?: Numeric;
  status: OrdersStatus;
  paymentStatus?: string;
  created_at?: Date | string;
  createdAt?: Date | string;
  user?: {
    name: string;
    email: string;
  };
  users?: {
    name: string;
    email: string;
  };
  buyer?: {
    name: string;
    email: string;
  };
  items?: CartItem[];
}
