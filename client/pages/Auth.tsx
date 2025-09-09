import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [adminOtp, setAdminOtp] = useState('');

  const { login, loginWithPassword, register, sendLoginOtp } = useAuth();
  const navigate = useNavigate();

  // Send OTP to admin email
  const handleSendOTPEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-otp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: adminEmail })
      });

      const data = await response.json();

      if (data.success) {
        setOtpEmailSent(true);
        setMessage(data.message);
        if (data.demoOTP) {
          setDemoOtp(data.demoOTP);
          setMessage(`${data.message} Demo OTP: ${data.demoOTP}`);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify admin OTP and login
  const handleVerifyAdminOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          otp: adminOtp
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store auth data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update auth context
        window.location.reload(); // Simple way to refresh auth state

        // Navigate to admin dashboard
        navigate('/admin');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try password login first if password is provided
      if (loginData.password) {
        const success = await loginWithPassword(loginData.email, loginData.password);
        if (success) {
          setMessage('Login successful! Welcome back! 🌿');
          setTimeout(() => {
            navigate('/');
          }, 1000);
          return;
        } else {
          setError('Invalid email or password. Try OTP login instead.');
        }
      } else {
        // Fall back to OTP login
        const result = await sendLoginOtp(loginData.email);
        if (result.success) {
          setOtpSent(true);
          setIsRegistration(false);
          setMessage('OTP sent to your email!');
          if (result.demoOtp) {
            setDemoOtp(result.demoOtp);
          }
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(registerData.name, registerData.email, registerData.phone, registerData.password);
      if (result.success) {
        setOtpSent(true);
        setIsRegistration(true);
        setMessage('OTP sent to your email for verification!');
        if (result.demoOtp) {
          setDemoOtp(result.demoOtp);
        }
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const email = isRegistration ? registerData.email : loginData.email;
      const success = await login(email, otp, isRegistration);

      if (success) {
        setMessage('Login successful! Welcome to GreenHaven ���');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtpToEmail = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await sendLoginOtp(loginData.email);
      if (result.success) {
        setOtpSent(true);
        setIsRegistration(false);
        setMessage('OTP sent to your email!');
        if (result.demoOtp) {
          setDemoOtp(result.demoOtp);
        }
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plant-sage/10 via-background to-plant-leaf/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GreenHaven</span>
            </Link>
            
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-primary animate-leaf-sway" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to GreenHaven
            </h1>
            <p className="text-muted-foreground">
              Join our community of plant enthusiasts
            </p>
          </div>

          <Card className="plant-card animate-scale-in">
            <CardContent className="p-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <div className="p-6">
                  <TabsContent value="login" className="space-y-6 mt-0">
                    <CardHeader className="p-0">
                      <CardTitle className="text-center">Welcome Back!</CardTitle>
                    </CardHeader>

                    {/* Login Instructions */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      <strong>📧 OTP-Based Login:</strong>
                      <ul className="mt-1 text-xs">
                        <li>• Use email + password if you have an account</li>
                        <li>• Use "Login with OTP" - Real OTP sent to your email</li>
                        <li>• Email verification required for all new accounts</li>
                        <li>• Admin access automatically granted for admin emails</li>
                      </ul>
                    </div>

                    {/* Success/Error Messages */}
                    {message && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {message}
                      </div>
                    )}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    {!otpSent ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="login-email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="login-email"
                              type="email"
                              value={loginData.email}
                              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                              placeholder="your@email.com"
                              className="pl-10 form-input"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="login-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              placeholder="Enter your password"
                              className="pl-10 pr-10 form-input"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <Label htmlFor="remember" className="text-sm">Remember me</Label>
                          </div>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Forgot password?
                          </Button>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full btn-plant h-11"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Signing in...</span>
                            </div>
                          ) : (
                            'Sign In'
                          )}
                        </Button>

                        <div className="text-center space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={sendOtpToEmail}
                            className="w-full"
                            disabled={!loginData.email}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Login with OTP
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setLoginData({...loginData, email: 'test@example.com'})}
                            className="w-full text-xs"
                          >
                            Quick Test (Fill test@example.com)
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpVerification} className="space-y-4">
                        <div className="text-center space-y-2">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                          <h3 className="font-semibold">OTP Sent!</h3>
                          <p className="text-sm text-muted-foreground">
                            We've sent a verification code to<br />
                            <span className="font-medium">{isRegistration ? registerData.email : loginData.email}</span>
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="otp">Enter OTP</Label>
                          {demoOtp && (
                            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm text-center">
                              Demo OTP: <strong>{demoOtp}</strong>
                            </div>
                          )}
                          <Input
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="text-center text-lg tracking-widest form-input"
                            maxLength={6}
                            required
                          />
                          {demoOtp && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => setOtp(demoOtp)}
                            >
                              Fill Demo OTP
                            </Button>
                          )}
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full btn-plant h-11"
                          disabled={isLoading || otp.length !== 6}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Verifying...</span>
                            </div>
                          ) : (
                            'Verify OTP'
                          )}
                        </Button>

                        <div className="text-center space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Didn't receive the code?
                          </p>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Resend OTP
                          </Button>
                        </div>
                      </form>
                    )}
                  </TabsContent>

                  <TabsContent value="register" className="space-y-6 mt-0">
                    <CardHeader className="p-0">
                      <CardTitle className="text-center">Create Account</CardTitle>
                    </CardHeader>

                    {/* Demo Mode Notice */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                      <strong>Demo Mode:</strong> Since email is not configured, OTP will be shown in a popup for testing purposes.
                    </div>

                    {/* Success/Error Messages */}
                    {message && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {message}
                      </div>
                    )}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="register-name"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                            placeholder="Enter your full name"
                            className="pl-10 form-input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="register-email"
                            type="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            placeholder="your@email.com"
                            className="pl-10 form-input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="register-phone"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                            placeholder="+91 98765 43210"
                            className="pl-10 form-input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 form-input"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="confirm-password"
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                            placeholder="Confirm your password"
                            className="pl-10 form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full btn-plant h-11"
                        disabled={isLoading || registerData.password !== registerData.confirmPassword}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>OTP Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Trusted</span>
              </div>
            </div>

            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                🌱 Join 50,000+ plant lovers already growing with us
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
