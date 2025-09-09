import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlantDetail from "./pages/PlantDetail";
import PlantCatalog from "./pages/PlantCatalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import AllPlants from "./pages/AllPlants";
import IndoorPlants from "./pages/IndoorPlants";
import OutdoorPlants from "./pages/OutdoorPlants";
import RarePlants from "./pages/RarePlants";
import BuyNow from "./pages/BuyNow";
import Contact from "./pages/Contact";
import PlantCare from "./pages/PlantCare";
import AboutUs from "./pages/AboutUs";
import Sustainability from "./pages/Sustainability";
import Careers from "./pages/Careers";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPages from "./pages/admin/AdminPages";
import AdminEnquiry from "./pages/admin/AdminEnquiry";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plants" element={<AllPlants />} />
          <Route path="/all-plants" element={<AllPlants />} />
          <Route path="/indoor-plants" element={<IndoorPlants />} />
          <Route path="/outdoor-plants" element={<OutdoorPlants />} />
          <Route path="/rare-plants" element={<RarePlants />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/category/:category" element={<PlantCatalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/buy-now/:id" element={<BuyNow />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/care" element={<PlantCare />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping Information" description="Delivery details and policies" />} />
          <Route path="/returns" element={<PlaceholderPage title="Returns & Exchanges" description="Easy return process" />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<PlaceholderPage title="Plant Blog" description="Tips, tricks, and plant stories" />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminCategories />
            </ProtectedRoute>
          } />
          <Route path="/admin/pages" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPages />
            </ProtectedRoute>
          } />
          <Route path="/admin/enquiry" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminEnquiry />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSettings />
            </ProtectedRoute>
          } />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
