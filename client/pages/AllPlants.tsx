import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plant, PlantsResponse, PlantCategory } from "@shared/api";
import { 
  Search, 
  Heart, 
  Star, 
  ShoppingCart,
  Leaf,
  ArrowLeft,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AllPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');

  const categories = [
    { value: 'all' as const, label: 'All Plants', count: 0 },
    { value: 'indoor' as PlantCategory, label: 'Indoor Plants', count: 0 },
    { value: 'outdoor' as PlantCategory, label: 'Outdoor Plants', count: 0 },
    { value: 'rare' as PlantCategory, label: 'Rare Plants', count: 0 },
    { value: 'flowering' as PlantCategory, label: 'Flowering', count: 0 },
    { value: 'succulents' as PlantCategory, label: 'Succulents', count: 0 },
    { value: 'bonsai' as PlantCategory, label: 'Bonsai', count: 0 },
    { value: 'herbs' as PlantCategory, label: 'Herbs', count: 0 },
    { value: 'fruit' as PlantCategory, label: 'Fruit Plants', count: 0 }
  ];

  useEffect(() => {
    fetchAllPlants();
  }, []);

  const fetchAllPlants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plants?limit=100'); // Get more plants
      const data = (await response.json()) as PlantsResponse;
      setPlants(data.plants);
    } catch (error) {
      console.error("Error fetching all plants:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update category counts
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: cat.value === 'all' ? plants.length : plants.filter(plant => plant.category === cat.value).length
  }));

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <span>All Plants</span>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search all plants..." 
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
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
            🌿 Complete Plant Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our entire collection of beautiful plants. From rare specimens to common favorites, 
            find everything you need to create your perfect green space.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{plants.length}+ Plants Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Expert Curated</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as PlantCategory | 'all')}>
            <TabsList className="w-full justify-start overflow-x-auto category-scrollbar">
              {categoryCounts.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="whitespace-nowrap">
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Plants Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredPlants.length} Plants {selectedCategory !== 'all' && `in ${categoryCounts.find(c => c.value === selectedCategory)?.label}`}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Free shipping on orders above ₹999
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
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
              <h3 className="text-lg font-semibold text-foreground mb-2">No plants found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or category filter</p>
              <div className="flex justify-center space-x-2">
                <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
                <Button variant="outline" onClick={() => setSelectedCategory('all')}>Show All Categories</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map((plant, index) => (
                <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
                  <Card className="plant-card overflow-hidden plant-card-hover border-border/50 bg-card animate-plant-grow" style={{animationDelay: `${index * 0.02}s`}}>
                    <div className="relative">
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img 
                          src={plant.images[0]} 
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-4 left-4 space-y-2">
                        <Badge className={`text-xs ${
                          plant.category === 'rare' ? 'bg-purple-100 text-purple-600' :
                          plant.category === 'indoor' ? 'bg-green-100 text-green-600' :
                          plant.category === 'outdoor' ? 'bg-emerald-100 text-emerald-600' :
                          plant.category === 'flowering' ? 'bg-pink-100 text-pink-600' :
                          plant.category === 'succulents' ? 'bg-teal-100 text-teal-600' :
                          plant.category === 'bonsai' ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {plant.category}
                        </Badge>
                        {plant.new && (
                          <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>
                        )}
                        {plant.trending && (
                          <Badge className="bg-orange-100 text-orange-600 text-xs">Trending</Badge>
                        )}
                        {plant.featured && (
                          <Badge className="bg-blue-100 text-blue-600 text-xs">Featured</Badge>
                        )}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-sm hover-grow"
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
                        <Button size="sm" className="bg-primary hover:bg-primary/90 hover-grow">
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

      {/* Quick Category Links */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/indoor-plants" className="group">
              <Card className="hover-lift p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary">Indoor Plants</h3>
                <p className="text-sm text-muted-foreground mt-1">Perfect for homes</p>
              </Card>
            </Link>
            <Link to="/outdoor-plants" className="group">
              <Card className="hover-lift p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary">Outdoor Plants</h3>
                <p className="text-sm text-muted-foreground mt-1">Garden beauties</p>
              </Card>
            </Link>
            <Link to="/rare-plants" className="group">
              <Card className="hover-lift p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary">Rare Plants</h3>
                <p className="text-sm text-muted-foreground mt-1">Unique specimens</p>
              </Card>
            </Link>
            <Link to="/category/flowering" className="group">
              <Card className="hover-lift p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary">Flowering</h3>
                <p className="text-sm text-muted-foreground mt-1">Colorful blooms</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
