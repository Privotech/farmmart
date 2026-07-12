// Prisma Enum Types
export type UsersRole = 'BUYER' | 'SELLER' | 'ADMIN';
export type AnimalsCategory = 'CATTLE' | 'GOAT' | 'SHEEP' | 'PIG' | 'POULTRY' | 'RABBIT' | 'HORSE' | 'OTHER';
export type AnimalsStatus = 'AVAILABLE' | 'SOLD' | 'RESERVED';
export type OrdersStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type InquiriesStatus = 'UNREAD' | 'READ' | 'REPLIED';

// User Type (matches Prisma users model)
export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UsersRole;
  avatarUrl?: string;
  address?: string;
  state?: string;
  city?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Animal Type (matches Prisma animals model)
export interface Animal {
  type?: string;
  health_status?: "healthy" | "vaccinated" | "treated" | "unknown";
  id: string;
  name: string;
  category: AnimalsCategory;
  breed?: string;
  age?: number;
  weight?: number; // Decimal as number
  price: number; // Decimal as number
  description?: string;
  images: string; // JSON string array
  status: AnimalsStatus;
  location?: string;
  state?: string;
  isNegotiable: boolean;
  viewCount: number;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations (optional)
  seller?: User;
}

// Cart Type (matches Prisma cart model)
export interface CartItem {
  id: string;
  userId: string;
  animalId: string;
  quantity: number;
  createdAt: Date;
  animal: Animal; // Made required
  user?: User;
}

// Order Type (matches Prisma orders model)
export interface Order {
  items: unknown;
  id: string;
  buyerId: string;
  animalId: string;
  amount: number;
  totalAmount: number; // For UI
  paymentStatus?: string;
  status: OrdersStatus;
  paystackRef: string;
  paystackChannel?: string;
  deliveryAddress?: string;
  deliveryState?: string;
  deliveryCity?: string;
  notes?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations (optional)
  buyer?: User;
  animal?: Animal;
  user?: { name: string; email: string }; // For UI
}

// Inquiry Type (matches Prisma inquiries model)
export interface Inquiry {
  id: string;
  senderId: string;
  receiverId: string;
  animalId: string;
  message: string;
  status: InquiriesStatus;
  createdAt: Date;
  // Relations (optional)
  sender?: User;
  receiver?: User;
  animal?: Animal;
}

// Review Type (matches Prisma reviews model)
export interface Review {
  id: string;
  userId: string;
  animalId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  // Relations (optional)
  user?: User;
  animal?: Animal;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter Types
export interface AnimalFilters {
  category?: AnimalsCategory;
  type?: string;
  healthStatus?: string;
  breed?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  state?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  sellerId?: string;
  status?: AnimalsStatus;
}
