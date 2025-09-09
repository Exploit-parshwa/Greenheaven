import { Request, Response, Router } from "express";
import { sendOTP, verifyOTP, otpStore } from "./email";
import { sendOTPEmail, verifyOTP as verifyEmailOTP } from "../services/emailService";

const router = Router();

// In-memory user storage (in production, use a proper database)
interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  password?: string; // Add password field
  isActive: boolean;
  createdAt: Date;
  isAdmin?: boolean;
}

const users = new Map<string, User>();

// Create default admin user for testing
const defaultAdmin = {
  id: 'admin_default',
  email: 'Parshwakalantre33@gmail.com',
  name: 'Admin User',
  phone: '+91-9999999999',
  password: 'admin123',
  isActive: true,
  createdAt: new Date(),
  isAdmin: true
};
users.set(defaultAdmin.id, defaultAdmin);

// Temporary registration data storage
const registrationData = new Map<string, {
  name: string;
  email: string;
  phone: string;
  password: string; // Add password field
  verified: boolean;
  expires: number;
}>();

// Send OTP for login (original SMS/console method)
router.post('/send-otp', sendOTP);

// Send OTP via email for all users (login and registration)
router.post('/send-otp-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        status: 400
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: 400
      });
    }

    // For login: Check if user exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (!existingUser) {
      return res.status(400).json({
        message: "No account found with this email. Please register first.",
        status: 400
      });
    }

    if (!existingUser.isActive) {
      return res.status(400).json({
        message: "Account is inactive. Please contact support.",
        status: 400
      });
    }

    const result = await sendOTPEmail(email);

    if (result.success) {
      return res.json({
        message: result.message,
        success: true,
        email: email,
        demoOTP: result.otpForDemo // Only in demo mode
      });
    } else {
      return res.status(400).json({
        message: result.message,
        status: 400
      });
    }

  } catch (error) {
    console.error('Send OTP email error:', error);
    res.status(500).json({
      message: "Failed to send OTP email",
      status: 500
    });
  }
});

// Verify OTP email login
router.post('/verify-otp-email', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        status: 400
      });
    }

    // Verify OTP
    const otpResult = verifyEmailOTP(email, otp);

    if (!otpResult.success) {
      return res.status(400).json({
        message: otpResult.message,
        status: 400
      });
    }

    // Find admin user
    const adminUser = Array.from(users.values()).find(u => u.email === email && u.isAdmin);
    if (!adminUser || !adminUser.isActive) {
      return res.status(400).json({
        message: "Admin account not found or inactive",
        status: 400
      });
    }

    // Generate token and return user data
    return res.json({
      message: `Welcome back, ${adminUser.name || 'Admin'}!`,
      success: true,
      token: `auth_${adminUser.id}_${Date.now()}`,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        isAdmin: adminUser.isAdmin
      }
    });

  } catch (error) {
    console.error('Verify OTP email error:', error);
    res.status(500).json({
      message: "OTP verification failed",
      status: 500
    });
  }
});

// Password-based login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: 400
      });
    }

    // Find user by email
    const user = Array.from(users.values()).find(u => u.email === email);

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please register first.",
        status: 400
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: "Account is inactive. Please contact support.",
        status: 400
      });
    }

    // Check password (in production, use proper password hashing)
    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
        status: 400
      });
    }

    // Return success response with user data
    return res.json({
      message: user.name ? `Welcome back, ${user.name}!` : "Login successful!",
      success: true,
      token: `auth_${user.id}_${Date.now()}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed", status: 500 });
  }
});

// Send OTP for registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, email, phone, and password are required",
        status: 400
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(user => user.email === email);
    if (existingUser) {
      console.log(`Registration attempt for existing email: ${email}`);
      return res.status(400).json({
        message: "User with this email already exists. Please try logging in instead.",
        status: 400
      });
    }

    console.log(`Processing registration for new email: ${email}`);

    // Store registration data temporarily
    registrationData.set(email, {
      name,
      email,
      phone,
      password, // Store password for later use
      verified: false,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP using email service
    console.log(`Attempting to send OTP to: ${email}`);
    const result = await sendOTPEmail(email);
    console.log(`OTP send result:`, result);

    if (result.success) {
      return res.json({
        message: "Registration initiated! Please check your email for OTP to complete registration.",
        success: true,
        email: email,
        demoOTP: result.otpForDemo // Only in demo mode
      });
    } else {
      console.error(`Failed to send OTP to ${email}:`, result.message);
      return res.status(400).json({
        message: result.message,
        status: 400
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Registration failed", status: 500 });
  }
});

// Verify OTP and complete registration/login
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp, isRegistration } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        status: 400
      });
    }

    // Verify OTP using email service
    const verificationResult = verifyEmailOTP(email, otp);

    if (!verificationResult.success) {
      return res.status(400).json({
        message: verificationResult.message,
        status: 400
      });
    }

    // OTP verified successfully, now handle user creation/login
    let user = Array.from(users.values()).find(u => u.email === email);

    if (!user) {
      // Check if this is registration
      const regData = registrationData.get(email);
      if (regData && Date.now() < regData.expires) {
        // Create new user
        user = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: regData.email,
          name: regData.name,
          phone: regData.phone,
          password: regData.password, // Store password
          isActive: true,
          createdAt: new Date(),
          isAdmin: email === 'admin@greenhaven.com' // Make admin@greenhaven.com an admin
        };
        users.set(user.id, user);
        registrationData.delete(email);
      } else {
        return res.status(400).json({
          message: "User not found. Please register first.",
          status: 400
        });
      }
    }

    // Return success response with user data
    return res.json({
      message: user.name ? `Welcome back, ${user.name}!` : "Login successful!",
      success: true,
      token: `auth_${user.id}_${Date.now()}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: "Verification failed", status: 500 });
  }
});

// Check auth status
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No authentication token", status: 401 });
    }

    const token = authHeader.substring(7);

    // Extract user ID from token and check if valid
    if (!token.startsWith('auth_')) {
      return res.status(401).json({ message: "Invalid token format", status: 401 });
    }

    // Token format: auth_{userId}_{timestamp}
    const tokenParts = token.split('_');
    if (tokenParts.length < 3) {
      return res.status(401).json({ message: "Invalid token structure", status: 401 });
    }

    // Reconstruct user ID (in case it contains underscores)
    const userId = tokenParts.slice(1, -1).join('_');
    const timestamp = parseInt(tokenParts[tokenParts.length - 1]);

    // Check if token is expired (30 days = 30 * 24 * 60 * 60 * 1000 ms)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > thirtyDaysMs) {
      return res.status(401).json({ message: "Token expired", status: 401 });
    }

    // Find user by ID
    const user = users.get(userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive", status: 401 });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: "Authentication check failed", status: 500 });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully", success: true });
});

// Get all users (admin only)
router.get('/users', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = token.split('_')[1];
    const user = users.get(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required", status: 403 });
    }

    const userList = Array.from(users.values()).map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt,
      isAdmin: u.isAdmin || false
    }));

    res.json({ users: userList });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: "Failed to fetch users", status: 500 });
  }
});

// Update user status (admin only)
router.patch('/users/:userId', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    const token = authHeader.substring(7);
    const adminUserId = token.split('_')[1];
    const adminUser = users.get(adminUserId);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Admin access required", status: 403 });
    }

    const { userId } = req.params;
    const { isActive } = req.body;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    user.isActive = isActive;
    users.set(userId, user);

    res.json({ 
      message: "User updated successfully", 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: "Failed to update user", status: 500 });
  }
});

export default router;
