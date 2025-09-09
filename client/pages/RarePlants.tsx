import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plant, PlantsResponse } from "@shared/api";
import { 
  Search, 
  Heart, 
  Star, 
  ShoppingCart,
  Leaf,
  ArrowLeft,
  Crown,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function RarePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRarePlants();
  }, []);

  const fetchRarePlants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plants/category/rare');
      const data = (await response.json()) as PlantsResponse;
      setPlants(data.plants);
    } catch (error) {
      console.error("Error fetching rare plants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">GreenHaven</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <span>/</span>
                <span>Rare Plants</span>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search rare plants..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Button asChild variant="ghost">
              <Link to="/cart">
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Crown className="w-12 h-12 text-amber-500 animate-bounce" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
            ✨ Rare Plants Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover extraordinary plants from around the world. Our rare collection features unique specimens 
            that will make your garden or home truly one-of-a-kind. Perfect for collectors and plant enthusiasts.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Collector's Items</span>
            </div>
            <div className="flex items-center space-x-1">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Expertly Curated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plants Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredPlants.length} Rare Plants Available
            </h2>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                Limited Stock
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Free shipping on orders above ₹999
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPlants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No rare plants found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms</p>
              <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map((plant, index) => (
                <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
                  <Card className="plant-card overflow-hidden plant-card-hover border-border/50 bg-card animate-plant-grow relative" style={{animationDelay: `${index * 0.05}s`}}>
                    {/* Rare plant glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-amber-500/5 pointer-events-none"></div>
                    
                    <div className="relative">
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img 
                          src={plant.images[0]} 
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-4 left-4 space-y-2">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-pulse">
                          <Crown className="w-3 h-3 mr-1" />
                          Rare
                        </Badge>
                        {plant.new && (
                          <Badge className="bg-primary text-primary-foreground">New</Badge>
                        )}
                        {plant.trending && (
                          <Badge className="bg-orange-100 text-orange-600">Trending</Badge>
                        )}
                        {plant.featured && (
                          <Badge className="bg-amber-100 text-amber-600">Premium</Badge>
                        )}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-sm hover-grow"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      
                      {/* Stock indicator for rare plants */}
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="text-xs">
                          Only {plant.stockQuantity} left
                        </Badge>
                      </div>
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

                      <div className="flex items-center space-x-2 flex-wrap">
                        {plant.petFriendly && (
                          <Badge variant="secondary" className="text-xs">Pet Friendly</Badge>
                        )}
                        {plant.lowMaintenance && (
                          <Badge variant="secondary" className="text-xs">Low Care</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{plant.careLevel}</Badge>
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
                          {plant.originalPrice && (
                            <div className="text-xs text-green-600 font-medium">
                              Save ₹{(plant.originalPrice - plant.price).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover-grow">
                          Add to Cart
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

      {/* Rare Plants Info Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/50 to-amber-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Our Rare Plants Are Special
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Exclusive Collection</h3>
              <p className="text-muted-foreground">Handpicked rare specimens sourced from trusted growers worldwide.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold">Authenticity Guaranteed</h3>
              <p className="text-muted-foreground">Every rare plant comes with authenticity certification and care guide.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold">Expert Care</h3>
              <p className="text-muted-foreground">Lovingly cultivated by our plant experts for optimal health and beauty.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
