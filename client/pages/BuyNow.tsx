import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Plant, PlantResponse, Address } from "@shared/api";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone,
  Building,
  Shield,
  CheckCircle,
  Leaf,
  Truck,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

export default function BuyNow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

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

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const orderId = `PL${Date.now().toString().slice(-6)}`;
      
      // Send order confirmation email
      const orderData = {
        email: customerInfo.email,
        customerName: customerInfo.name,
        orderId: orderId,
        items: [{
          plantId: plant!.id,
          quantity: quantity,
          plant: plant!
        }],
        total: plant!.price * quantity
      };

      const emailResponse = await fetch('/api/orders/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (emailResponse.ok) {
        console.log('Order confirmation emails sent successfully');
      }

      setStep(3); // Success
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plant not found</h1>
          <Button asChild>
            <Link to="/plants">Back to Plants</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = plant.price * quantity;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Success page
  if (step === 3) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order Confirmed! 🌱
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase. Your {plant.name} is on its way!
              </p>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <img 
                    src={plant.images[0]} 
                    alt={plant.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{plant.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
                    <p className="font-semibold">₹{total.toLocaleString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">#PL{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Delivery:</span>
                  <span>3-5 business days</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/plants">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={`/plant/${plant.id}`} className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Product</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Quick Purchase</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className={step >= 1 ? 'text-foreground' : 'text-muted-foreground'}>
                Details
              </span>
            </div>
            <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className={step >= 2 ? 'text-foreground' : 'text-muted-foreground'}>
                Payment
              </span>
            </div>
            <div className={`h-0.5 w-16 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className={step >= 3 ? 'text-foreground' : 'text-muted-foreground'}>
                Success
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                {/* Product Summary */}
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle>Your Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <img 
                        src={plant.images[0]} 
                        alt={plant.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{plant.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{plant.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Label>Quantity:</Label>
                            <div className="flex items-center border border-border rounded-lg">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium">
                                {quantity}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setQuantity(Math.min(plant.stockQuantity, quantity + 1))}
                                disabled={quantity >= plant.stockQuantity}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">₹{plant.price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">per plant</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Customer Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="Enter your full name"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="your@email.com"
                        className="form-input"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Shipping Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                        placeholder="House no., Street name"
                        className="form-input"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          placeholder="City"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          placeholder="State"
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">PIN Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                          placeholder="110001"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          disabled
                          className="form-input"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full h-12 btn-plant"
                  disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || !shippingAddress.street}
                >
                  Continue to Payment
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Payment Method */}
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Payment Method</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <Smartphone className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">UPI Payment</div>
                            <div className="text-sm text-muted-foreground">Pay using your UPI ID</div>
                          </div>
                        </Label>
                        <Badge className="bg-green-100 text-green-600">Recommended</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <Building className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">Net Banking</div>
                            <div className="text-sm text-muted-foreground">Direct bank transfer</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Payment Details */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4 animate-scale-in">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          value={paymentInfo.upiId}
                          onChange={(e) => setPaymentInfo({...paymentInfo, upiId: e.target.value})}
                          placeholder="yourname@paytm / yourname@gpay"
                          className="form-input"
                        />
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 animate-scale-in">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                            placeholder="1234 5678 9012 3456"
                            className="form-input"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                              placeholder="MM/YY"
                              className="form-input"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                              placeholder="123"
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back to Details
                  </Button>
                  <Button 
                    onClick={handlePayment} 
                    disabled={processing}
                    className="flex-1 h-12 btn-plant"
                  >
                    {processing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Pay ₹{total.toLocaleString()}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({quantity} plant{quantity > 1 ? 's' : ''})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
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

                {/* Security */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-4">
                  <Shield className="w-4 h-4" />
                  <span>Secure SSL encrypted payment</span>
                </div>

                {shipping === 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">Free shipping applied!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
