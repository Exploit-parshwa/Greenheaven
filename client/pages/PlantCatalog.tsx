import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Plant, PlantsResponse, PlantCategory } from "@shared/api";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Star, 
  ShoppingCart,
  Leaf,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function PlantCatalog() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<PlantCategory[]>(
    category ? [category as PlantCategory] : []
  );
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>('all');
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [lowMaintenanceOnly, setLowMaintenanceOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const categories: { value: PlantCategory; label: string }[] = [
    { value: 'flowering', label: 'Flowering Plants' },
    { value: 'indoor', label: 'Indoor Plants' },
    { value: 'outdoor', label: 'Outdoor Plants' },
    { value: 'bonsai', label: 'Bonsai' },
    { value: 'succulents', label: 'Succulents' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'fruit', label: 'Fruit Plants' },
    { value: 'rare', label: 'Rare Plants' },
  ];

  useEffect(() => {
    fetchPlants();
  }, [category, searchParams]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (category) {
        params.append('category', category);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      params.append('priceMin', priceRange[0].toString());
      params.append('priceMax', priceRange[1].toString());
      
      if (selectedCareLevel && selectedCareLevel !== 'all') {
        params.append('careLevel', selectedCareLevel);
      }
      
      if (petFriendlyOnly) {
        params.append('petFriendly', 'true');
      }

      const response = await fetch(`/api/plants?${params.toString()}`);
      const data = (await response.json()) as PlantsResponse;
      
      let sortedPlants = [...data.plants];
      
      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          sortedPlants.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedPlants.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedPlants.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
        default:
          sortedPlants.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      setPlants(sortedPlants);
    } catch (error) {
      console.error("Error fetching plants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 5000]);
    setSelectedCategories(category ? [category as PlantCategory] : []);
    setSelectedCareLevel('all');
    setPetFriendlyOnly(false);
    setLowMaintenanceOnly(false);
    setSortBy('name');
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {!category && (
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <Checkbox
                  id={cat.value}
                  checked={selectedCategories.includes(cat.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, cat.value]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== cat.value));
                    }
                  }}
                />
                <label htmlFor={cat.value} className="text-sm cursor-pointer">
                  {cat.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Care Level */}
      <div>
        <h3 className="font-semibold mb-3">Care Level</h3>
        <Select value={selectedCareLevel} onValueChange={setSelectedCareLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select care level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Special Features */}
      <div>
        <h3 className="font-semibold mb-3">Special Features</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pet-friendly"
              checked={petFriendlyOnly}
              onCheckedChange={setPetFriendlyOnly}
            />
            <label htmlFor="pet-friendly" className="text-sm cursor-pointer">
              Pet Friendly
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="low-maintenance"
              checked={lowMaintenanceOnly}
              onCheckedChange={setLowMaintenanceOnly}
            />
            <label htmlFor="low-maintenance" className="text-sm cursor-pointer">
              Low Maintenance
            </label>
          </div>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GreenHaven</span>
            </Link>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search plants..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {category 
                  ? categories.find(c => c.value === category)?.label || 'Plants'
                  : 'All Plants'
                }
              </h1>
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `${plants.length} plants found`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none border-l"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
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
            ) : plants.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No plants found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {plants.map((plant) => (
                  <Link key={plant.id} to={`/plant/${plant.id}`} className="group">
                    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-border/50 bg-card ${viewMode === 'list' ? 'md:flex' : ''}`}>
                      <div className={`relative ${viewMode === 'list' ? 'md:w-48 md:flex-shrink-0' : ''}`}>
                        <div className={`bg-muted overflow-hidden ${viewMode === 'list' ? 'aspect-square md:h-48' : 'aspect-square'}`}>
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
                      
                      <CardContent className="p-4 space-y-3 flex-1">
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
                                  ���{plant.originalPrice.toLocaleString()}
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
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
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
        </div>
      </div>
    </div>
  );
}
