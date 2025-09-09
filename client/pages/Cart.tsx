import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartResponse, CartItem } from "@shared/api";
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag,
  Leaf,
  CreditCard,
  Truck,
  Shield,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Cart() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'session-id': 'default' // In production, use actual session ID
        }
      });
      if (response.ok) {
        const data = (await response.json()) as CartResponse;
        setCartData(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (plantId: string, newQuantity: number) => {
    setUpdating(plantId);
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'session-id': 'default'
        },
        body: JSON.stringify({
          plantId,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        const data = (await response.json()) as CartResponse;
        setCartData(data);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (plantId: string) => {
    setUpdating(plantId);
    try {
      const response = await fetch(`/api/cart/${plantId}`, {
        method: 'DELETE',
        headers: {
          'session-id': 'default'
        }
      });

      if (response.ok) {
        const data = (await response.json()) as CartResponse;
        setCartData(data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const applyCoupon = () => {
    // Mock coupon functionality
    if (couponCode.toLowerCase() === 'plant10') {
      setDiscount(0.1); // 10% discount
    } else if (couponCode.toLowerCase() === 'welcome20') {
      setDiscount(0.2); // 20% discount
    } else {
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (!cartData?.items?.length) {
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">GreenHaven</span>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg" />
                ))}
              </div>
              <div className="h-64 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartData?.total || 0;
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discountAmount + shipping;

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
            
            <Link to="/plants" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartData?.itemCount || 0} items in your cart
          </p>
        </div>

        {!cartData?.items?.length ? (
          // Empty Cart
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Looks like you haven't added any plants to your cart yet. 
              Start exploring our beautiful collection!
            </p>
            <Button asChild size="lg">
              <Link to="/plants">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartData.items.map((item: CartItem) => (
                <Card key={item.plantId} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Plant Image */}
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.plant.images[0]} 
                          alt={item.plant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Plant Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link 
                              to={`/plant/${item.plant.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {item.plant.name}
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.plant.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.plant.category}
                              </Badge>
                              {item.plant.petFriendly && (
                                <Badge variant="secondary" className="text-xs">Pet Friendly</Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.plantId)}
                            disabled={updating === item.plantId}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">Qty:</span>
                            <div className="flex items-center border border-border rounded-lg">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateQuantity(item.plantId, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updating === item.plantId}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {updating === item.plantId ? '...' : item.quantity}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateQuantity(item.plantId, item.quantity + 1)}
                                disabled={item.quantity >= item.plant.stockQuantity || updating === item.plantId}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              ₹{(item.plant.price * item.quantity).toLocaleString()}
                            </div>
                            {item.plant.originalPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                ₹{(item.plant.originalPrice * item.quantity).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Coupon Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={applyCoupon} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="text-sm text-green-600">
                      ✓ Coupon applied! {(discount * 100)}% discount
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Try: PLANT10 or WELCOME20
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({(discount * 100)}%)</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  {subtotal < 999 && (
                    <div className="text-sm text-muted-foreground text-center">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">Free Delivery</div>
                      <div className="text-xs text-muted-foreground">On orders above ₹999</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">Plant Guarantee</div>
                      <div className="text-xs text-muted-foreground">30-day healthy arrival promise</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">Expert Care</div>
                      <div className="text-xs text-muted-foreground">Free plant care guidance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
