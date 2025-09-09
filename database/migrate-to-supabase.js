// Migration script to move existing in-memory data to Supabase
// Run this after setting up your Supabase database

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Sample plant data (from your existing plants.ts file)
const samplePlants = [
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    description: "The iconic Swiss cheese plant with beautiful split leaves. A stunning statement piece for any modern home.",
    price: 899,
    original_price: 1099,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    stock_quantity: 30,
    features: ["Split leaves", "Air purifying", "Fast growing"],
    care_level: "Easy",
    sunlight_requirement: "Medium",
    watering_frequency: "Medium",
    pet_friendly: false,
    low_maintenance: true,
    rating: 4.8,
    review_count: 567,
    featured: true,
    trending: true,
    is_new: false,
    in_stock: true
  },
  {
    id: "snake-plant",
    name: "Snake Plant (Sansevieria)",
    description: "Nearly indestructible plant perfect for beginners. Excellent air purifier that thrives in low light conditions.",
    price: 599,
    original_price: 799,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=800&h=800&fit=crop"
    ],
    stock_quantity: 50,
    features: ["Low light tolerant", "Air purifying", "Very low maintenance"],
    care_level: "Easy",
    sunlight_requirement: "Low",
    watering_frequency: "Low",
    pet_friendly: false,
    low_maintenance: true,
    rating: 4.9,
    review_count: 1203,
    featured: true,
    trending: false,
    is_new: false,
    in_stock: true
  }
  // Add more plants as needed
]

// Sample users
const sampleUsers = [
  {
    email: 'admin@greenhaven.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+91-9876543210',
    is_admin: true,
    is_active: true
  },
  {
    email: 'user@example.com',
    password: 'user123',
    name: 'Test User',
    phone: '+91-9876543211',
    is_admin: false,
    is_active: true
  }
]

async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

async function migratePlants() {
  console.log('🌱 Migrating plants...')
  
  const { data, error } = await supabase
    .from('plants')
    .upsert(samplePlants, { onConflict: 'id' })
  
  if (error) {
    console.error('Error migrating plants:', error)
    return false
  }
  
  console.log(`✅ Successfully migrated ${samplePlants.length} plants`)
  return true
}

async function migrateUsers() {
  console.log('👥 Migrating users...')
  
  const usersToInsert = []
  
  for (const user of sampleUsers) {
    const hashedPassword = await hashPassword(user.password)
    usersToInsert.push({
      ...user,
      password_hash: hashedPassword,
      password: undefined // Remove plain password
    })
  }
  
  const { data, error } = await supabase
    .from('users')
    .upsert(usersToInsert, { onConflict: 'email' })
  
  if (error) {
    console.error('Error migrating users:', error)
    return false
  }
  
  console.log(`✅ Successfully migrated ${usersToInsert.length} users`)
  return true
}

async function createSampleData() {
  console.log('📦 Creating sample orders and data...')
  
  // Get admin user
  const { data: adminUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@greenhaven.com')
    .single()
  
  if (!adminUser) {
    console.error('Admin user not found')
    return false
  }
  
  // Create sample order
  const sampleOrder = {
    order_number: `PL${Date.now()}`,
    user_id: adminUser.id,
    customer_name: 'Test Customer',
    customer_email: 'customer@example.com',
    customer_phone: '+91-9876543212',
    shipping_address: {
      street: '123 Green Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400001',
      country: 'India'
    },
    subtotal: 1498,
    shipping_cost: 99,
    tax_amount: 149.80,
    total_amount: 1746.80,
    status: 'processing',
    payment_status: 'completed',
    payment_method: 'UPI',
    payment_details: {
      upi_transaction_id: 'TXN123456789',
      upi_id: 'customer@okaxis'
    }
  }
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([sampleOrder])
    .select()
  
  if (orderError) {
    console.error('Error creating sample order:', orderError)
    return false
  }
  
  // Create order items
  const orderItems = [
    {
      order_id: order[0].id,
      plant_id: 'monstera-deliciosa',
      plant_name: 'Monstera Deliciosa',
      plant_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      quantity: 1,
      unit_price: 899,
      total_price: 899
    },
    {
      order_id: order[0].id,
      plant_id: 'snake-plant',
      plant_name: 'Snake Plant',
      plant_image_url: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&h=400&fit=crop',
      quantity: 1,
      unit_price: 599,
      total_price: 599
    }
  ]
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    return false
  }
  
  console.log('✅ Sample order and items created successfully')
  return true
}

async function runMigration() {
  console.log('🚀 Starting database migration...')
  console.log('='.repeat(50))
  
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error.message)
      return
    }
    
    console.log('✅ Connected to Supabase successfully')
    
    // Run migrations
    const plantsSuccess = await migratePlants()
    if (!plantsSuccess) return
    
    const usersSuccess = await migrateUsers()
    if (!usersSuccess) return
    
    const sampleSuccess = await createSampleData()
    if (!sampleSuccess) return
    
    console.log('='.repeat(50))
    console.log('🎉 Migration completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Update your server routes to use Supabase instead of in-memory storage')
    console.log('2. Test all functionality with the new database')
    console.log('3. Set up Row Level Security (RLS) policies as needed')
    console.log('')
    console.log('Login credentials:')
    console.log('Admin: admin@greenhaven.com / admin123')
    console.log('User: user@example.com / user123')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
}

export { runMigration }
