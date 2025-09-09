import { RequestHandler } from "express";
import { CartItem, CartResponse, Plant } from "@shared/api";

// Simple in-memory cart storage (in production, use database with user sessions)
const carts: Map<string, CartItem[]> = new Map();


// Import the complete plant database - we'll create a shared module
const getPlantById = async (id: string): Promise<Plant | undefined> => {
  try {
    // Use a simple HTTP request to get plant data from our own API
    const fetch = (await import('node-fetch')).default;
  // Use environment variable or default to Netlify function endpoint
  const baseUrl = process.env.PLANT_API_URL || "https://greenhevaven.netlify.app/.netlify/functions/api";
  const response = await fetch(`${baseUrl}/plants/${id}`);
    if (response.ok) {
      const data = await response.json() as { plant: Plant };
      return data.plant;
    }
  } catch (error) {
    console.error('Error fetching plant for cart:', error);
    // Fallback to basic plant data if API call fails
    const basicPlants: Plant[] = [
      {
        id: "bird-of-paradise",
        name: "Bird of Paradise Plant",
        description: "A stunning tropical plant with large, paddle-shaped leaves and exotic orange and blue flowers.",
        price: 1499,
        originalPrice: 1799,
        category: "rare",
        images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop"],
        inStock: true,
        stockQuantity: 12,
        features: ["Exotic flowers", "Large decorative leaves", "Air purifying"],
        careLevel: "Medium",
        sunlight: "High",
        watering: "Medium",
        petFriendly: false,
        lowMaintenance: false,
        rating: 4.8,
        reviewCount: 156,
        featured: true,
        trending: true,
        new: false
      },
      {
        id: "monstera-deliciosa",
        name: "Monstera Deliciosa",
        description: "The iconic Swiss cheese plant with beautiful split leaves. A stunning statement piece for any modern home.",
        price: 899,
        originalPrice: 1099,
        category: "indoor",
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop"],
        inStock: true,
        stockQuantity: 30,
        features: ["Split leaves", "Air purifying", "Fast growing"],
        careLevel: "Easy",
        sunlight: "Medium",
        watering: "Medium",
        petFriendly: false,
        lowMaintenance: true,
        rating: 4.8,
        reviewCount: 567,
        featured: true,
        trending: true,
        new: false
      },
      {
        id: "snake-plant",
        name: "Snake Plant (Sansevieria)",
        description: "Nearly indestructible plant perfect for beginners. Excellent air purifier that thrives in low light conditions.",
        price: 599,
        originalPrice: 799,
        category: "indoor",
        images: ["https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&h=800&fit=crop"],
        inStock: true,
        stockQuantity: 50,
        features: ["Low light tolerant", "Air purifying", "Very low maintenance"],
        careLevel: "Easy",
        sunlight: "Low",
        watering: "Low",
        petFriendly: false,
        lowMaintenance: true,
        rating: 4.9,
        reviewCount: 1203,
        featured: true,
        trending: false,
        new: false
      }
    ];
    return basicPlants.find(plant => plant.id === id);
  }
  return undefined;
};

// Get cart contents
export const getCart: RequestHandler = (req, res) => {
  try {
    const sessionId = req.headers['session-id'] as string || 'default';
    const cartItems = carts.get(sessionId) || [];

    const total = cartItems.reduce((sum, item) => sum + (item.plant.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const response: CartResponse = {
      items: cartItems,
      total,
      itemCount
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", status: 500 });
  }
};

// Get specific cart item by plantId
export const getCartItem: RequestHandler = (req, res) => {
  try {
    const { plantId } = req.params;
    const sessionId = req.headers['session-id'] as string || 'default';
    const cartItems = carts.get(sessionId) || [];
    const item = cartItems.find(item => item.plantId === plantId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found", status: 404 });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart item", status: 500 });
  }
};

// Add item to cart
export const addToCart: RequestHandler = async (req, res) => {
  try {
    const { plantId, quantity = 1 } = req.body;
    const sessionId = req.headers['session-id'] as string || 'default';

    if (!plantId) {
      return res.status(400).json({ message: "Plant ID is required", status: 400 });
    }

    const plant = await getPlantById(plantId);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found", status: 404 });
    }

    if (!plant.inStock || plant.stockQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock", status: 400 });
    }

    let cartItems = carts.get(sessionId) || [];
    const existingItemIndex = cartItems.findIndex(item => item.plantId === plantId);

    if (existingItemIndex >= 0) {
      // Update existing item
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        plantId,
        quantity,
        plant
      };
      cartItems.push(newItem);
    }

    carts.set(sessionId, cartItems);

    const total = cartItems.reduce((sum, item) => sum + (item.plant.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const response: CartResponse = {
      items: cartItems,
      total,
      itemCount
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", status: 500 });
  }
};

// Update cart item quantity
export const updateCartItem: RequestHandler = (req, res) => {
  try {
    const { plantId, quantity } = req.body;
    const sessionId = req.headers['session-id'] as string || 'default';

    if (!plantId || quantity < 0) {
      return res.status(400).json({ message: "Invalid plant ID or quantity", status: 400 });
    }

    let cartItems = carts.get(sessionId) || [];
    const itemIndex = cartItems.findIndex(item => item.plantId === plantId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart", status: 404 });
    }

    if (quantity === 0) {
      // Remove item from cart
      cartItems.splice(itemIndex, 1);
    } else {
      // Update quantity
      cartItems[itemIndex].quantity = quantity;
    }

    carts.set(sessionId, cartItems);

    const total = cartItems.reduce((sum, item) => sum + (item.plant.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const response: CartResponse = {
      items: cartItems,
      total,
      itemCount
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", status: 500 });
  }
};

// Remove item from cart
export const removeFromCart: RequestHandler = (req, res) => {
  try {
    const { plantId } = req.params;
    const sessionId = req.headers['session-id'] as string || 'default';

    let cartItems = carts.get(sessionId) || [];
    cartItems = cartItems.filter(item => item.plantId !== plantId);
    carts.set(sessionId, cartItems);

    const total = cartItems.reduce((sum, item) => sum + (item.plant.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const response: CartResponse = {
      items: cartItems,
      total,
      itemCount
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", status: 500 });
  }
};

// Clear cart
export const clearCart: RequestHandler = (req, res) => {
  try {
    const sessionId = req.headers['session-id'] as string || 'default';
    carts.delete(sessionId);

    const response: CartResponse = {
      items: [],
      total: 0,
      itemCount: 0
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", status: 500 });
  }
};
