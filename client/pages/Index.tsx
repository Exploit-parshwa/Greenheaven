import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plant, PlantsResponse } from "@shared/api";
import { ShoppingCart, Search, Menu, User, Heart, Star, ArrowRight, Leaf, TreePine, FlowerIcon, Sprout, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CartButton } from "@/components/CartButton";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const [featuredPlants, setFeaturedPlants] = useState<Plant[]>([]);
  const [trendingPlants, setTrendingPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetchFeaturedPlants();
    fetchTrendingPlants();
  }, []);

  const handleAddToCart = async (plantId: string) => {
    try {
      setAddingToCart(plantId);
      await addToCart(plantId, 1);
      // Optional: Show success notification
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  const fetchFeaturedPlants = async () => {
    try {
      const response = await fetch("/api/plants/featured");
      const data = (await response.json()) as PlantsResponse;
      // Limit to 9 featured plants for home page as requested
      setFeaturedPlants(data.plants.slice(0, 9));
    } catch (error) {
      console.error("Error fetching featured plants:", error);
    }
  };

  const fetchTrendingPlants = async () => {
    try {
      const response = await fetch("/api/plants/trending");
      const data = (await response.json()) as PlantsResponse;
      // Limit to 8 trending plants for home page as requested
      setTrendingPlants(data.plants.slice(0, 8));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trending plants:", error);
      setLoading(false);
    }
  };

  const categories = [
    { id: "flowering", name: "Flowering Plants", icon: FlowerIcon, color: "bg-pink-100 text-pink-600" },
    { id: "indoor", name: "Indoor Plants", icon: Leaf, color: "bg-green-100 text-green-600" },
    { id: "outdoor", name: "Outdoor Plants", icon: TreePine, color: "bg-emerald-100 text-emerald-600" },
    { id: "succulents", name: "Succulents", icon: Sprout, color: "bg-teal-100 text-teal-600" },
    { id: "bonsai", name: "Bonsai", icon: TreePine, color: "bg-amber-100 text-amber-600" },
    { id: "herbs", name: "Herbs", icon: Leaf, color: "bg-lime-100 text-lime-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GreenHaven</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search plants..." 
                  className="pl-10 bg-background/80"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/plants" className="text-foreground hover:text-primary transition-colors">
                All Plants
              </Link>
              <Link to="/care" className="text-foreground hover:text-primary transition-colors">
                Plant Care
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Heart className="w-5 h-5" />
              </Button>
              <CartButton />

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.name || user?.email}
                  </span>
                  {user?.isAdmin && (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin">
                        <Settings className="w-4 h-4 mr-1" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary">
                    <Link to="/auth">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Auth Button */}
              <Button asChild variant="ghost" size="icon" className="md:hidden">
                <Link to={isAuthenticated ? "/admin" : "/auth"}>
                  {isAuthenticated ? <Settings className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-plant-sage/20 via-background to-plant-leaf/10 overflow-hidden">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23059669\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge className="bg-plant-leaf/20 text-plant-forest border-plant-leaf/30 animate-scale-in">
                  🌿 Fresh Collection Available
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Transform Your Space with
                  <span className="text-gradient-plant block animate-plant-grow">Beautiful Plants</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Discover our curated collection of premium plants, from exotic rarities to low-maintenance favorites.
                  Perfect for every home and garden.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/plants">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Shop Collection
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/care">
                  <Button size="lg" variant="outline" className="border-border">
                    Plant Care Guide
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Plant Varieties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50k+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-down">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-plant-sage/30 to-plant-leaf/30 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700 animate-plant-float">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop&crop=center"
                  alt="Beautiful plants collection"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl hover-glow"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-lg border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Premium Quality</div>
                    <div className="text-xs text-muted-foreground">Guaranteed Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect plants for your space, lifestyle, and experience level
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group"
              >
                <Card className="plant-card hover-lift border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${category.color} hover-grow`}>
                      <category.icon className="w-8 h-8 animate-leaf-sway" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Featured Plants
              </h2>
              <p className="text-lg text-muted-foreground">
                Handpicked favorites from our expert gardeners
              </p>
            </div>
            <Link to="/plants">
              <Button variant="outline" className="hidden md:flex">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlants.map((plant, index) => (
                <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
                  <Card className="plant-card overflow-hidden plant-card-hover border-border/50 bg-card animate-plant-grow" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="relative">
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img 
                          src={plant.images[0]} 
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-4 left-4 space-y-2">
                        {plant.new && (
                          <Badge className="bg-primary text-primary-foreground">New</Badge>
                        )}
                        {plant.trending && (
                          <Badge className="bg-plant-terracotta/90 text-white">Trending</Badge>
                        )}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-sm"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {plant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plant.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(plant.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({plant.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-foreground">
                              ₹{plant.price.toLocaleString()}
                            </span>
                            {plant.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{plant.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {plant.petFriendly && (
                              <Badge variant="secondary" className="text-xs">Pet Friendly</Badge>
                            )}
                            {plant.lowMaintenance && (
                              <Badge variant="secondary" className="text-xs">Low Care</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(plant.id);
                          }}
                          disabled={addingToCart === plant.id}
                        >
                          {addingToCart === plant.id ? 'Adding...' : 'Add to Cart'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Plants */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trending Now
            </h2>
            <p className="text-lg text-muted-foreground">
              Popular choices among plant lovers this month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPlants.map((plant) => (
              <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border-border/50">
                  <div className="aspect-square bg-muted overflow-hidden relative">
                    <img 
                      src={plant.images[0]} 
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-sm mb-1">{plant.name}</h3>
                      <div className="text-lg font-bold">₹{plant.price.toLocaleString()}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Stay Green, Stay Updated
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Get plant care tips, exclusive offers, and new arrivals delivered to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-white/90 border-white/20 placeholder:text-gray-500"
              />
              <Button className="bg-white text-primary hover:bg-white/90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-primary-foreground/60">
              Join 10,000+ plant enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-plant-forest text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-plant-forest" />
                </div>
                <span className="text-xl font-bold">GreenHaven</span>
              </div>
              <p className="text-white/80">
                Your trusted partner in creating beautiful, thriving plant collections for every space.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/plants" className="hover:text-white transition-colors">All Plants</Link></li>
                <li><Link to="/category/indoor" className="hover:text-white transition-colors">Indoor Plants</Link></li>
                <li><Link to="/category/outdoor" className="hover:text-white transition-colors">Outdoor Plants</Link></li>
                <li><Link to="/category/rare" className="hover:text-white transition-colors">Rare Plants</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/care" className="hover:text-white transition-colors">Plant Care</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 GreenHaven. All rights reserved. Made with 🌱 for plant lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
