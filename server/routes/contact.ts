import { RequestHandler } from "express";

// Contact message interface
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'read' | 'replied';
}

// In-memory storage for contact messages (in production, use a real database)
const contactMessages: ContactMessage[] = [];

// Submit contact form
export const submitContactForm: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, subject, category, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: "Name, email, subject, and message are required", 
        status: 400 
      });
    }

    // Create new contact message
    const contactMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      category: category || 'general',
      message: message.trim(),
      createdAt: new Date(),
      status: 'new'
    };

    // Save to storage (in production, save to database)
    contactMessages.push(contactMessage);

    // Send notification email to admin (optional)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const adminEmail = {
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || 'admin@greenhaven.com',
          subject: `🌿 New Contact Form Submission - ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">New Contact Form Submission</h2>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Contact Details:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px;">
                <p><strong>Message ID:</strong> ${contactMessage.id}</p>
                <p><strong>Submitted:</strong> ${contactMessage.createdAt.toLocaleString()}</p>
              </div>
              
              <p style="margin-top: 20px; color: #666;">
                Please respond to this inquiry as soon as possible.
              </p>
            </div>
          `
        };

        await transporter.sendMail(adminEmail);
      } else {
        // Log to console for demo purposes
        console.log('📧 New Contact Form Submission:', {
          id: contactMessage.id,
          name,
          email,
          subject,
          category,
          createdAt: contactMessage.createdAt
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the entire request if email fails
    }

    // Send auto-reply to customer
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const autoReplyEmail = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `🌿 Thank you for contacting GreenHaven - We'll be in touch soon!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #22c55e;">🌿 GreenHaven</h1>
                <p style="color: #666;">Thank you for reaching out!</p>
              </div>
              
              <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #22c55e; margin-bottom: 20px;">Message Received!</h2>
                <p>Hello ${name},</p>
                <p>Thank you for contacting us! We've received your message about "<strong>${subject}</strong>" and our team will get back to you within 24 hours.</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Your Message Summary:</h3>
                <p><strong>Reference ID:</strong> ${contactMessage.id}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Submitted:</strong> ${contactMessage.createdAt.toLocaleString()}</p>
              </div>
              
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Our expert team will review your inquiry</li>
                  <li>You'll receive a personalized response within 24 hours</li>
                  <li>For urgent plant care questions, check our Plant Care Guide</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="margin-bottom: 15px;">Need immediate help?</p>
                <p>📧 Email: support@greenhaven.com</p>
                <p>📞 Phone: +91 1800-PLANTS</p>
              </div>
              
              <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                <p>🌱 Growing together with nature</p>
                <p>GreenHaven - Your trusted plant partner</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(autoReplyEmail);
      }
    } catch (emailError) {
      console.error('Failed to send auto-reply email:', emailError);
      // Don't fail the entire request if email fails
    }

    // Return success response
    res.status(201).json({
      message: "Contact form submitted successfully",
      success: true,
      contactId: contactMessage.id
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      message: "Failed to submit contact form", 
      status: 500 
    });
  }
};

// Get all contact messages (for admin use)
export const getContactMessages: RequestHandler = (req, res) => {
  try {
    // In production, add admin authentication here
    const { status, limit = "50", offset = "0" } = req.query;
    
    let filteredMessages = [...contactMessages];
    
    // Filter by status if provided
    if (status && status !== 'all') {
      filteredMessages = filteredMessages.filter(msg => msg.status === status);
    }
    
    // Sort by newest first
    filteredMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Pagination
    const limitNum = parseInt(limit.toString());
    const offsetNum = parseInt(offset.toString());
    const paginatedMessages = filteredMessages.slice(offsetNum, offsetNum + limitNum);
    
    res.json({
      messages: paginatedMessages,
      total: filteredMessages.length,
      limit: limitNum,
      offset: offsetNum
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ 
      message: "Failed to fetch contact messages", 
      status: 500 
    });
  }
};

// Update message status (for admin use)
export const updateMessageStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be 'new', 'read', or 'replied'", 
        status: 400 
      });
    }
    
    const messageIndex = contactMessages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ 
        message: "Contact message not found", 
        status: 404 
      });
    }
    
    contactMessages[messageIndex].status = status;
    
    res.json({
      message: "Message status updated successfully",
      success: true,
      updatedMessage: contactMessages[messageIndex]
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ 
      message: "Failed to update message status", 
      status: 500 
    });
  }
};
