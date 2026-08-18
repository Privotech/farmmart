// src/types/index.ts

export type UserRole = "BUYER" | "SELLER" | "ADMIN";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | null;

export type OrdersStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "completed"
  | "PAID"
  | "CANCELLED";

export type AnimalsCategory =
  | "CATTLE"
  | "POULTRY"
  | "GOAT"
  | "SHEEP"
  | "PIG"
  | "FISH"
  | "OTHER"
  | string;

export type Numeric = number | { toString(): string };

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: UserRole | string;
  firebase_uid?: string | null;
  firebaseUid?: string | null;
  is_verified?: boolean;
  isVerified?: boolean;
  verification_status?: VerificationStatus | string | null;
  verificationStatus?: VerificationStatus | string | null;
  verification_document_url?: string | null;
  verificationDocumentUrl?: string | null;
  verification_document_type?: string | null;
  verificationDocumentType?: string | null;
  verification_notes?: string | null;
  verificationNotes?: string | null;
  verified_at?: Date | string | null;
  verifiedAt?: Date | string | null;
  verified_by_id?: string | null;
  verifiedById?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  state?: string | null;
  city?: string | null;
  bio?: string | null;
  farm_name?: string | null;
  farmName?: string | null;
  farm_address?: string | null;
  farmAddress?: string | null;
  cac_number?: string | null;
  cacNumber?: string | null;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
  users?: {
    name: string;
    email?: string;
    phone?: string | null;
    avatar_url?: string | null;
    is_verified?: boolean;
    verification_status?: string | null;
    state?: string | null;
    city?: string | null;
    farm_name?: string | null;
    bio?: string | null;
    cac_number?: string | null;
    created_at?: Date | string;
  };
}

export interface Animal {
  id: string;
  name: string;
  breed?: string | null;
  category?: AnimalsCategory;
  price: Numeric;
  weight?: Numeric | number | null;
  age?: number | null;
  description?: string | null;
  images?: string | string[] | null;
  type?: string;
  status?: string;
  location?: string | null;
  state?: string | null;
  health_status?: string | null;
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
