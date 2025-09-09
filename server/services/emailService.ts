import nodemailer from 'nodemailer';

// OTP Storage (in production, use Redis or database)
interface OTPData {
  otp: string;
  email: string;
  expires: number;
  attempts: number;
  used: boolean;
}

const otpStorage = new Map<string, OTPData>();

// Email configuration - supports multiple providers
const emailConfig = {
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || '',
      pass: process.env.GMAIL_APP_PASSWORD || '' // Use App Password, not regular password
    }
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || ''
    }
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY || ''
    }
  }
};

// Create transporter based on available configuration
let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  if (transporter) return transporter;

  try {
    // Try Gmail first
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      transporter = nodemailer.createTransporter(emailConfig.gmail);
      console.log('📧 Using Gmail SMTP for email service');
      return transporter;
    }

    // Try SendGrid
    if (process.env.SENDGRID_API_KEY) {
      transporter = nodemailer.createTransporter(emailConfig.sendgrid);
      console.log('📧 Using SendGrid for email service with API key:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...');
      return transporter;
    }

    // Try custom SMTP
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransporter(emailConfig.smtp);
      console.log('📧 Using custom SMTP for email service');
      return transporter;
    }

    console.warn('⚠️ No email configuration found. OTP will be logged to console.');
    return null;
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean expired OTPs
function cleanExpiredOTPs() {
  const now = Date.now();
  for (const [email, otpData] of otpStorage.entries()) {
    if (now > otpData.expires) {
      otpStorage.delete(email);
    }
  }
}

// Send OTP via email
export async function sendOTPEmail(email: string): Promise<{ success: boolean; message: string; otpForDemo?: string }> {
  try {
    cleanExpiredOTPs();

    // Check if OTP was recently sent (rate limiting)
    const existingOTP = otpStorage.get(email);
    if (existingOTP && Date.now() < existingOTP.expires && existingOTP.attempts < 3) {
      const remainingTime = Math.ceil((existingOTP.expires - Date.now()) / 1000 / 60);
      return {
        success: false,
        message: `OTP already sent. Please wait ${remainingTime} minutes before requesting again.`
      };
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStorage.set(email, {
      otp,
      email,
      expires,
      attempts: 0,
      used: false
    });

    const emailTransporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'GreenHaven Plant Store',
        address: process.env.FROM_EMAIL || 'Parshwakalantre33@gmail.com'
      },
      to: email,
      subject: 'Your Login OTP - GreenHaven Admin',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Login OTP</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981; }
            .warning { background: #fef3cd; border: 1px solid #faebcc; color: #8a6d3b; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌿 GreenHaven Admin Login</h1>
              <p>Your secure login code</p>
            </div>
            <div class="content">
              <p>Hello Administrator,</p>
              <p>Your One-Time Password (OTP) for admin panel login is:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666;">Valid for 5 minutes</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                  <li>This OTP expires in <strong>5 minutes</strong></li>
                  <li>Can only be used <strong>once</strong></li>
                  <li>Never share this code with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>
              
              <p>If you're having trouble, please contact the system administrator.</p>
            </div>
            <div class="footer">
              <p>© 2024 GreenHaven Plant Store - Admin Panel</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        GreenHaven Admin Login OTP
        
        Your login code is: ${otp}
        
        This code expires in 5 minutes and can only be used once.
        
        If you didn't request this login, please ignore this email.
        
        © 2024 GreenHaven Plant Store
      `
    };

    if (emailTransporter) {
      try {
        await emailTransporter.sendMail(mailOptions);
        console.log(`📧 OTP sent successfully to ${email}`);
        return {
          success: true,
          message: 'OTP sent successfully to your email address.'
        };
      } catch (emailError) {
        console.error('Email sending failed:', emailError);

        // Fall back to demo mode if email fails
        console.log(`🔐 FALLBACK DEMO MODE - OTP for ${email}: ${otp}`);
        return {
          success: true,
          message: `Email service error. Demo OTP: ${otp}`,
          otpForDemo: otp
        };
      }
    } else {
      // Demo mode - log OTP to console
      console.log(`🔐 DEMO MODE - OTP for ${email}: ${otp}`);
      return {
        success: true,
        message: `Email not configured. Demo OTP: ${otp}`,
        otpForDemo: otp // Only in demo mode
      };
    }

  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return {
      success: false,
      message: 'Failed to send OTP. Please try again or contact support.'
    };
  }
}

// Verify OTP
export function verifyOTP(email: string, inputOTP: string): { success: boolean; message: string } {
  cleanExpiredOTPs();

  const otpData = otpStorage.get(email);

  if (!otpData) {
    return {
      success: false,
      message: 'OTP not found or expired. Please request a new one.'
    };
  }

  // Check if expired
  if (Date.now() > otpData.expires) {
    otpStorage.delete(email);
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.'
    };
  }

  // Check if already used
  if (otpData.used) {
    return {
      success: false,
      message: 'OTP has already been used. Please request a new one.'
    };
  }

  // Check attempts
  if (otpData.attempts >= 3) {
    otpStorage.delete(email);
    return {
      success: false,
      message: 'Too many failed attempts. Please request a new OTP.'
    };
  }

  // Verify OTP
  if (otpData.otp !== inputOTP) {
    otpData.attempts++;
    return {
      success: false,
      message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`
    };
  }

  // Success - mark as used
  otpData.used = true;
  otpStorage.delete(email); // Remove after successful use

  return {
    success: true,
    message: 'OTP verified successfully.'
  };
}

// Get OTP status (for admin/debug purposes)
export function getOTPStatus(email: string) {
  const otpData = otpStorage.get(email);
  if (!otpData) return null;

  return {
    email: otpData.email,
    expires: new Date(otpData.expires),
    attempts: otpData.attempts,
    used: otpData.used,
    timeRemaining: Math.max(0, Math.ceil((otpData.expires - Date.now()) / 1000))
  };
}

export { otpStorage };
