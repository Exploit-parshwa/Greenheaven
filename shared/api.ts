/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Plant Category Types
 */
export type PlantCategory = 
  | 'flowering' 
  | 'indoor' 
  | 'outdoor' 
  | 'bonsai' 
  | 'succulents' 
  | 'herbs' 
  | 'fruit' 
  | 'rare';

/**
 * Plant Interface
 */
export interface Plant {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: PlantCategory;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  features: string[];
  careLevel: 'Easy' | 'Medium' | 'Hard';
  sunlight: 'Low' | 'Medium' | 'High';
  watering: 'Low' | 'Medium' | 'High';
  petFriendly: boolean;
  lowMaintenance: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  new: boolean;
}

/**
 * Cart Item Interface
 */
export interface CartItem {
  plantId: string;
  quantity: number;
  plant: Plant;
}

/**
 * User Interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
  createdAt: Date;
}

/**
 * Address Interface
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Order Interface
 */
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  trackingId?: string;
}

/**
 * API Response Types
 */
export interface PlantsResponse {
  plants: Plant[];
  total: number;
  page: number;
  limit: number;
}

export interface PlantResponse {
  plant: Plant;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderResponse {
  order: Order;
}

export interface UserResponse {
  user: User;
  token?: string;
}

/**
 * Filter and Search Types
 */
export interface PlantFilters {
  category?: PlantCategory;
  priceMin?: number;
  priceMax?: number;
  careLevel?: string;
  petFriendly?: boolean;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
