import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Plant, PlantResponse } from "@shared/api";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  Leaf,
  Sun,
  Droplets,
  Dog,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlant();
    }
  }, [id]);

  const fetchPlant = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/plants/${id}`);
      if (response.ok) {
        const data = (await response.json()) as PlantResponse;
        setPlant(data.plant);
      }
    } catch (error) {
      console.error("Error fetching plant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      navigate('/auth');
      return;
    }
    // TODO: Implement wishlist functionality
    alert('Wishlist feature coming soon!');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please login to purchase items');
      navigate('/auth');
      return;
    }
    navigate(`/buy-now/${plant?.id}`);
  };

  const addToCart = async () => {
    if (!plant) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    const token = localStorage.getItem('authToken');

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plantId: plant.id,
          quantity: quantity
        })
      });

      if (response.ok) {
        // Success feedback - you could add a toast notification here
        alert('Added to cart successfully!');
        console.log('Added to cart successfully');
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        window.location.href = '/auth';
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/plants" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Plants</span>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Plant not found</h1>
          <Button asChild>
            <Link to="/plants">Back to Plants</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount = plant.originalPrice 
    ? Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/plants" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Plants</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleWishlist}>
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button asChild variant="ghost">
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              <img 
                src={plant.images[selectedImage]} 
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {plant.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {plant.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${plant.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {plant.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge className={`capitalize ${
                      plant.category === 'rare' ? 'bg-plant-terracotta/20 text-plant-terracotta' :
                      plant.category === 'flowering' ? 'bg-pink-100 text-pink-600' :
                      'bg-plant-sage/20 text-plant-forest'
                    }`}>
                      {plant.category}
                    </Badge>
                    {plant.new && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                    {plant.trending && <Badge variant="secondary">Trending</Badge>}
                  </div>
                </div>
                {discount > 0 && (
                  <Badge className="bg-red-100 text-red-600 text-lg px-3 py-1">
                    {discount}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(plant.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 font-semibold">{plant.rating}</span>
                </div>
                <span className="text-muted-foreground">({plant.reviewCount} reviews)</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {plant.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-foreground">
                  ₹{plant.price.toLocaleString()}
                </span>
                {plant.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{plant.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes • Free shipping on orders above ₹999
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {plant.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {feature}
                </Badge>
              ))}
              {plant.petFriendly && (
                <Badge variant="outline" className="text-sm">
                  <Dog className="w-3 h-3 mr-1" />
                  Pet Friendly
                </Badge>
              )}
              {plant.lowMaintenance && (
                <Badge variant="outline" className="text-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  Low Maintenance
                </Badge>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.min(plant.stockQuantity, quantity + 1))}
                    disabled={quantity >= plant.stockQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {plant.stockQuantity} available
                </span>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={addToCart}
                  disabled={!plant.inStock || addingToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 h-12"
                >
                  {addingToCart ? (
                    "Adding..."
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="h-12 px-6"
                  disabled={!plant.inStock}
                >
                  Buy Now
                </Button>
              </div>

              {!plant.inStock && (
                <div className="text-red-600 font-semibold">Out of Stock</div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Free Delivery</div>
                  <div className="text-xs text-muted-foreground">2-4 business days</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Plant Guarantee</div>
                  <div className="text-xs text-muted-foreground">30-day healthy arrival</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">Hassle-free exchange</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="care" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="care">Plant Care</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="care" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Care Instructions</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Sun className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Sunlight</h4>
                          <p className="text-muted-foreground">{plant.sunlight} light requirements</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Watering</h4>
                          <p className="text-muted-foreground">{plant.watering} water needs</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Care Level</h4>
                          <p className="text-muted-foreground">{plant.careLevel} maintenance required</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Care Tips</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Water when top inch of soil feels dry</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Place in bright, indirect sunlight</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Fertilize monthly during growing season</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Wipe leaves regularly to remove dust</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specs" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span className="text-muted-foreground capitalize">{plant.category}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Care Level:</span>
                        <span className="text-muted-foreground">{plant.careLevel}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Sunlight:</span>
                        <span className="text-muted-foreground">{plant.sunlight}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Watering:</span>
                        <span className="text-muted-foreground">{plant.watering}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Pet Friendly:</span>
                        <span className="text-muted-foreground">{plant.petFriendly ? 'Yes' : 'No'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Low Maintenance:</span>
                        <span className="text-muted-foreground">{plant.lowMaintenance ? 'Yes' : 'No'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Stock:</span>
                        <span className="text-muted-foreground">{plant.stockQuantity} available</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Rating:</span>
                        <span className="text-muted-foreground">{plant.rating}/5 ({plant.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Reviews feature coming soon!</p>
                    <p className="text-sm mt-2">
                      Current rating: {plant.rating}/5 from {plant.reviewCount} customers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
