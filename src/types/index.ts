// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Animal Listing Types
export interface Animal {
  id: string;
  name: string;
  type: 'cattle' | 'goat' | 'sheep' | 'pig' | 'poultry' | 'other';
  breed: string;
  age: number; // in months
  weight?: number; // in kg
  price: number;
  description: string;
  images: string[];
  sellerId: string;
  seller: User;
  location: string;
  health_status: 'healthy' | 'vaccinated' | 'treated' | 'unknown';
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  id: string;
  userId: string;
  animalId: string;
  animal: Animal;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentReference?: string;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  animalId: string;
  animal: Animal;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Filter Types
export interface AnimalFilters {
  type?: string;
  breed?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  healthStatus?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
}
