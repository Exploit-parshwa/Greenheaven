import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartResponse, Address } from "@shared/api";
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
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function Checkout() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  
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
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: { 'session-id': 'default' }
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

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // First create a pending order
      const orderData = {
        customerInfo,
        shippingAddress,
        items: cartData?.items || [],
        subtotal,
        shipping,
        total,
        paymentMethod,
        status: 'pending_payment'
      };

      const orderResponse = await fetch('/api/orders/create-pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (orderResponse.ok) {
        const orderResult = await orderResponse.json();
        const orderId = orderResult.orderId;

        // Redirect to payment based on payment method
        if (paymentMethod === 'upi') {
          initiateUPIPayment(orderId, total);
        } else if (paymentMethod === 'card') {
          initiateCardPayment(orderId, total);
        } else if (paymentMethod === 'netbanking') {
          initiateNetBankingPayment(orderId, total);
        } else {
          throw new Error('Invalid payment method');
        }
      } else {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Order creation failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const initiateUPIPayment = (orderId: string, amount: number) => {
    const merchantUPI = 'parshwakalantre@okaxis';
    const transactionNote = `GreenHaven Order ${orderId}`;

    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${merchantUPI}&pn=GreenHaven&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&mc=0000&mode=02&purpose=00`;

    // Try to open UPI app first
    const upiLink = document.createElement('a');
    upiLink.href = upiUrl;
    upiLink.click();

    // Show payment verification modal
    showPaymentVerificationModal(orderId, amount, merchantUPI);
  };

  const initiateCardPayment = (orderId: string, amount: number) => {
    // For demo purposes, simulate card payment
    alert(`Redirecting to Card Payment Gateway...\nOrder ID: ${orderId}\nAmount: ₹${amount.toLocaleString()}`);
    showPaymentVerificationModal(orderId, amount, 'Card Payment');
  };

  const initiateNetBankingPayment = (orderId: string, amount: number) => {
    // For demo purposes, simulate net banking
    alert(`Redirecting to Net Banking...\nOrder ID: ${orderId}\nAmount: ₹${amount.toLocaleString()}`);
    showPaymentVerificationModal(orderId, amount, 'Net Banking');
  };

  const showPaymentVerificationModal = (orderId: string, amount: number, paymentDetails: string) => {
    setProcessing(false);

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 10000; font-family: Arial, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center;">
        <div style="color: #22c55e; font-size: 48px; margin-bottom: 20px;">💳</div>
        <h3 style="margin-bottom: 15px; color: #333;">Payment Verification</h3>
        <p style="margin-bottom: 20px; color: #666;">
          Please complete your payment of <strong>₹${amount.toLocaleString()}</strong><br>
          ${paymentDetails.includes('@') ? `to UPI ID: <strong>${paymentDetails}</strong>` : `via ${paymentDetails}`}
        </p>
        <p style="margin-bottom: 25px; font-size: 14px; color: #888;">
          Order ID: ${orderId}
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick="confirmPayment('${orderId}')" style="
            background: #22c55e; color: white; border: none; padding: 12px 24px;
            border-radius: 6px; cursor: pointer; font-weight: 500;">
            Payment Completed
          </button>
          <button onclick="cancelPayment()" style="
            background: #ef4444; color: white; border: none; padding: 12px 24px;
            border-radius: 6px; cursor: pointer; font-weight: 500;">
            Cancel Payment
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global functions for modal buttons
    (window as any).confirmPayment = async (orderId: string) => {
      document.body.removeChild(modal);
      await verifyAndConfirmPayment(orderId);
    };

    (window as any).cancelPayment = () => {
      document.body.removeChild(modal);
      alert('Payment cancelled. Please try again.');
    };
  };

  const verifyAndConfirmPayment = async (orderId: string) => {
    setProcessing(true);

    try {
      // Confirm payment with backend
      const response = await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, paymentStatus: 'completed' })
      });

      if (response.ok) {
        // Clear cart after successful payment
        try {
          await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'session-id': 'default' }
          });
        } catch (cartError) {
          console.warn('Failed to clear cart:', cartError);
        }

        setStep(3); // Success page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support if payment was deducted.');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = cartData?.total || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cartData?.items?.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild>
            <Link to="/plants">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

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
                Payment Successful! 🌱
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed and your plants are being prepared!
              </p>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Payment received via {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'Net Banking'}
                </p>
              </div>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">#PL{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Delivery:</span>
                  <span>3-5 business days</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-semibold">What's Next?</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Order confirmation email sent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Plants prepared for shipping (1-2 days)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Shipped with tracking details</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-4 h-4" />
                      <span>Delivered fresh to your door</span>
                    </div>
                  </div>
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
            <Link to="/cart" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Secure Checkout</span>
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
                {/* Customer Information */}
                <Card className="animate-fade-in-up">
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
                <Card className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
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
                      <div className="flex items-center space-x-2 p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <Smartphone className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-semibold text-green-800">UPI Payment</div>
                            <div className="text-sm text-green-600">Instant & Secure • parshwakalantre@okaxis</div>
                          </div>
                        </Label>
                        <Badge className="bg-green-100 text-green-700">Preferred</Badge>
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

                      <div className="flex items-center space-x-2 p-4 border-2 border-emerald-200 bg-emerald-50 rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <Banknote className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="font-semibold text-emerald-800">Cash on Delivery</div>
                            <div className="text-sm text-emerald-600">Pay when you receive • No processing fee</div>
                          </div>
                        </Label>
                        <Badge className="bg-emerald-100 text-emerald-700">Secure</Badge>
                      </div>
                    </RadioGroup>

                    {/* Payment Details */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4 animate-scale-in">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">UPI Payment Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-700">Merchant UPI ID:</span>
                              <code className="bg-green-100 px-2 py-1 rounded text-green-800">parshwakalantre@okaxis</code>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Amount:</span>
                              <span className="font-semibold text-green-800">₹{total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-800 mb-2">Payment Process:</h5>
                          <ol className="text-sm text-blue-700 space-y-1">
                            <li>1. Click "Pay Now" to open your UPI app</li>
                            <li>2. Verify the amount and merchant details</li>
                            <li>3. Complete payment in your UPI app</li>
                            <li>4. Return here and confirm payment completion</li>
                          </ol>
                        </div>
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
                        <div>
                          <Label htmlFor="cardHolder">Cardholder Name</Label>
                          <Input
                            id="cardHolder"
                            value={paymentInfo.cardHolder}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardHolder: e.target.value})}
                            placeholder="Name as on card"
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div className="text-center py-8 animate-scale-in">
                        <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          You will be redirected to your bank's website to complete the payment
                        </p>
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
                        <span>Creating Order...</span>
                      </div>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        {paymentMethod === 'upi' ? 'Pay with UPI' :
                         paymentMethod === 'card' ? 'Pay with Card' :
                         'Proceed to Payment'} • ₹{total.toLocaleString()}
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
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartData.items.map((item) => (
                    <div key={item.plantId} className="flex space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.plant.images[0]} 
                          alt={item.plant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.plant.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        ₹{(item.plant.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-4">
                  <Shield className="w-4 h-4" />
                  <span>Secure SSL encrypted payment</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
