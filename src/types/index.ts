// src/types/index.ts

export type UserRole = "BUYER" | "SELLER" | "ADMIN";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

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
  email: string;
  role: UserRole | string;
  firebase_uid?: string;
  firebaseUid?: string;
  is_verified?: boolean;
  isVerified?: boolean;
  verification_status?: VerificationStatus | string;
  verificationStatus?: VerificationStatus | string;
  verification_document_url?: string;
  verificationDocumentUrl?: string;
  verification_document_type?: string;
  verificationDocumentType?: string;
  verification_notes?: string;
  verificationNotes?: string;
  verified_at?: Date | string;
  verifiedAt?: Date | string;
  verified_by_id?: string;
  verifiedById?: string;
  phone?: string;
  avatar_url?: string;
  avatarUrl?: string;
  address?: string;
  state?: string;
  city?: string;
  bio?: string;
  farm_name?: string;
  farmName?: string;
  farm_address?: string;
  farmAddress?: string;
  cac_number?: string;
  cacNumber?: string;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
  users?: {
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    is_verified?: boolean;
    verification_status?: string;
    state?: string;
    city?: string;
    farm_name?: string;
    bio?: string;
    cac_number?: string;
    created_at?: Date | string;
  };
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
  images?: string | string[] | null;
  type?: string;
  status?: string;
  location?: string | null;
  state?: string | null;
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
