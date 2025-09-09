import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllPlants,
  getPlantById,
  getFeaturedPlants,
  getTrendingPlants,
  getPlantsByCategory,
  createPlant,
  updatePlant,
  deletePlant
} from "./routes/plants";
import {
  getCart,
  getCartItem,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "./routes/cart";
import {
  sendOTP,
  verifyOTP,
  sendOrderConfirmation
} from "./routes/email";
import {
  submitContactForm,
  getContactMessages,
  updateMessageStatus
} from "./routes/contact";
import authRoutes from "./routes/auth";
import ordersRoutes from "./routes/orders";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Plant API routes
  app.get("/api/plants", getAllPlants);
  app.get("/api/plants/featured", getFeaturedPlants);
  app.get("/api/plants/trending", getTrendingPlants);
  app.get("/api/plants/category/:category", getPlantsByCategory);
  app.get("/api/plants/:id", getPlantById);

  // Plant CRUD routes (admin only)
  app.post("/api/plants", createPlant);
  app.put("/api/plants/:id", updatePlant);
  app.delete("/api/plants/:id", deletePlant);

  // Cart API routes
  app.get("/api/cart", getCart);
  app.get("/api/cart/:plantId", getCartItem);
  app.post("/api/cart", addToCart);
  app.put("/api/cart", updateCartItem);
  app.delete("/api/cart/:plantId", removeFromCart);
  app.delete("/api/cart", clearCart);

  // Authentication routes
  app.use("/api/auth", authRoutes);

  // Orders routes
  app.use("/api/orders", ordersRoutes);

  // Email API routes
  app.post("/api/orders/send-confirmation", sendOrderConfirmation);

  // Contact form API routes
  app.post("/api/contact", submitContactForm);
  app.get("/api/contact/messages", getContactMessages);
  app.put("/api/contact/messages/:id", updateMessageStatus);

  return app;
}
