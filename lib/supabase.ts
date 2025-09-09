import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using in-memory storage.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database interfaces
export interface DatabaseUser {
  id: string
  email: string
  password_hash?: string
  name?: string
  phone?: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseOrder {
  id: string
  order_number: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: any
  billing_address?: any
  subtotal: number
  shipping_cost: number
  tax_amount: number
  total_amount: number
  status: string
  payment_status: string
  payment_method?: string
  payment_details?: any
  notes?: string
  created_at: string
  updated_at: string
}

export interface DatabaseOrderItem {
  id: string
  order_id: string
  plant_id: string
  plant_name: string
  plant_image_url?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface DatabasePlant {
  id: string
  name: string
  description?: string
  price: number
  original_price?: number
  category: string
  images: string[]
  stock_quantity: number
  features: string[]
  care_level: string
  sunlight_requirement: string
  watering_frequency: string
  pet_friendly: boolean
  low_maintenance: boolean
  rating: number
  review_count: number
  featured: boolean
  trending: boolean
  is_new: boolean
  in_stock: boolean
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  address_type: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

export interface PaymentMethod {
  id: string
  user_id: string
  payment_type: string
  card_last_four?: string
  card_brand?: string
  upi_id?: string
  bank_name?: string
  account_holder_name?: string
  is_default: boolean
  created_at: string
}
