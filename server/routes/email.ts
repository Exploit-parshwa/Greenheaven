import { RequestHandler } from "express";
import nodemailer from 'nodemailer';

// Email configuration - you'll need to set these environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Store OTPs temporarily (in production, use Redis or database)
export const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();

// Generate random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTP: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required", status: 400 });
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(email, { otp, expires, attempts: 0 });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@greenhaven.com',
      to: email,
      subject: '🌿 Your GreenHaven OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin-bottom: 10px;">🌿 GreenHaven</h1>
            <p style="color: #666; font-size: 16px;">Your Plant Paradise Awaits</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Your OTP Code</h2>
            <div style="background: #22c55e; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; margin-bottom: 10px;">This code will expire in 5 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>🌱 Growing together with nature</p>
            <p>GreenHaven - Your trusted plant partner</p>
          </div>
        </div>
      `
    };

    // Send email (simulate success for demo)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log(`Real email sent to ${email}`);
    } else {
      // For demo purposes, log the OTP to console
      console.log(`🌿 DEMO MODE - OTP for ${email}: ${otp}`);
    }

    res.json({
      message: "OTP sent successfully",
      success: true,
      // For demo purposes, include OTP in response (remove in production)
      demoOTP: otp,
      isDemo: !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: "Failed to send OTP", status: 500 });
  }
};

// Verify OTP
export const verifyOTP: RequestHandler = (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required", status: 400 });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: "OTP not found or expired", status: 400 });
    }

    // Check expiry
    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired", status: 400 });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({ message: "Too many attempts. Please request a new OTP", status: 400 });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({ message: "Invalid OTP", status: 400 });
    }

    // Success
    otpStore.delete(email);
    res.json({ 
      message: "OTP verified successfully", 
      success: true,
      token: `auth-token-${Date.now()}` // Generate proper JWT in production
    });

  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", status: 500 });
  }
};

// Send order confirmation email
export const sendOrderConfirmation: RequestHandler = async (req, res) => {
  try {
    const { email, customerName, orderId, items, total } = req.body;

    if (!email || !customerName || !orderId) {
      return res.status(400).json({ message: "Missing required fields", status: 400 });
    }

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.plant.images[0]}" alt="${item.plant.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.plant.name}</strong><br>
          <small style="color: #666;">Qty: ${item.quantity}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${(item.plant.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'orders@greenhaven.com',
      to: email,
      subject: `🌿 Order Confirmed - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin-bottom: 10px;">🌿 GreenHaven</h1>
            <p style="color: #666; font-size: 16px;">Your Plant Paradise</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; border-left: 4px solid #22c55e;">
            <h2 style="color: #22c55e; margin-bottom: 10px;">Order Confirmed! 🎉</h2>
            <p style="color: #333; font-size: 16px;">Hello ${customerName},</p>
            <p style="color: #666;">Thank you for your order! Your plants are being prepared with love and care.</p>
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #333; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Order Details</h3>
            <p style="margin: 10px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 10px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
              ${itemsHtml}
              <tr style="background: #f9f9f9;">
                <td colspan="2" style="padding: 15px; font-weight: bold;">Total Amount</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; color: #22c55e;">₹${total.toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-bottom: 15px;">What's Next? 🌱</h4>
            <div style="margin: 10px 0;"><span style="color: #22c55e;">✓</span> Order confirmation sent</div>
            <div style="margin: 10px 0;"><span style="color: #22c55e;">⏳</span> Plants being prepared (1-2 days)</div>
            <div style="margin: 10px 0;"><span style="color: #ccc;">📦</span> Shipped with tracking details</div>
            <div style="margin: 10px 0;"><span style="color: #ccc;">🚚</span> Delivered fresh to your door (3-5 days)</div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #22c55e; color: white; border-radius: 8px;">
            <h3 style="margin-bottom: 10px;">Need Help? 🤝</h3>
            <p style="margin-bottom: 15px;">Our plant experts are here to help!</p>
            <p>📧 support@greenhaven.com | 📞 +91-1800-PLANTS</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>🌱 Growing together with nature</p>
            <p>GreenHaven - Where every plant finds its perfect home</p>
          </div>
        </div>
      `
    };

    // Send email (simulate success for demo)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`Demo: Order confirmation email sent to ${email} for order ${orderId}`);
    }

    // Also send notification to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'system@greenhaven.com',
      to: process.env.ADMIN_EMAIL || 'admin@greenhaven.com',
      subject: `🌿 New Plant Order Received - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #22c55e;">New Order Received! 🎉</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customerName} (${email})</p>
          <p><strong>Total Amount:</strong> ₹${total.toLocaleString()}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
          
          <h3>Items Ordered:</h3>
          <ul>
            ${items.map((item: any) => `<li>${item.plant.name} x ${item.quantity}</li>`).join('')}
          </ul>
          
          <p style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
            Please check the admin panel for full order details and processing.
          </p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(adminMailOptions);
    }

    res.json({ 
      message: "Order confirmation emails sent successfully", 
      success: true 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: "Failed to send order confirmation", status: 500 });
  }
};
