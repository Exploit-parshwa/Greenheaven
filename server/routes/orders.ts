import { Request, Response, Router } from "express";
import { sendOrderConfirmation } from "./email";

const router = Router();

// Order interface
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    plantId: string;
    plantName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory orders storage (in production, use a proper database)
const orders = new Map<string, Order>();

// Create a pending order (before payment)
router.post('/create-pending', async (req: Request, res: Response) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod
    } = req.body;

    if (!customerInfo || !shippingAddress || !items || !items.length) {
      return res.status(400).json({
        message: "Missing required order information",
        status: 400
      });
    }

    // Generate order ID
    const orderId = `PL${Date.now().toString().slice(-6)}`;

    // Create pending order object
    const order: Order = {
      id: orderId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress,
      items: items.map((item: any) => ({
        plantId: item.plantId,
        plantName: item.plant.name,
        quantity: item.quantity,
        price: item.plant.price,
        totalPrice: item.plant.price * item.quantity
      })),
      subtotal,
      shipping,
      total,
      status: 'pending_payment',
      paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store pending order
    orders.set(orderId, order);

    res.json({
      message: "Pending order created successfully",
      success: true,
      orderId,
      order: {
        id: order.id,
        customerName: order.customerName,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Pending order creation error:', error);
    res.status(500).json({ message: "Failed to create pending order", status: 500 });
  }
});

// Confirm payment and complete order
router.post('/confirm-payment', async (req: Request, res: Response) => {
  try {
    const { orderId, paymentStatus } = req.body;

    if (!orderId || !paymentStatus) {
      return res.status(400).json({
        message: "Order ID and payment status are required",
        status: 400
      });
    }

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    if (order.status !== 'pending_payment') {
      return res.status(400).json({ message: "Order is not in pending payment status", status: 400 });
    }

    // Update order status
    order.status = 'processing';
    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();
    orders.set(orderId, order);

    // Send order confirmation email
    try {
      const emailData = {
        email: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        items: order.items.map(item => ({
          plant: { name: item.plantName, price: item.price, images: ['/placeholder.svg'] },
          quantity: item.quantity
        })),
        total: order.total
      };

      await fetch('/api/orders/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
    } catch (emailError) {
      console.warn('Failed to send order confirmation email:', emailError);
    }

    res.json({
      message: "Payment confirmed and order completed successfully",
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: "Failed to confirm payment", status: 500 });
  }
});

// Create a new order (legacy route - keeping for compatibility)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod
    } = req.body;

    if (!customerInfo || !shippingAddress || !items || !items.length) {
      return res.status(400).json({ 
        message: "Missing required order information", 
        status: 400 
      });
    }

    // Generate order ID
    const orderId = `PL${Date.now().toString().slice(-6)}`;

    // Create order object
    const order: Order = {
      id: orderId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress,
      items: items.map((item: any) => ({
        plantId: item.plantId,
        plantName: item.plant.name,
        quantity: item.quantity,
        price: item.plant.price,
        totalPrice: item.plant.price * item.quantity
      })),
      subtotal,
      shipping,
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'completed', // Assuming payment is completed
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store order
    orders.set(orderId, order);

    // Send order confirmation email
    try {
      await sendOrderConfirmation(
        {
          body: {
            email: customerInfo.email,
            customerName: customerInfo.name,
            orderId,
            items,
            total
          }
        } as Request,
        {
          json: (data: any) => data
        } as Response
      );
    } catch (emailError) {
      console.warn('Failed to send order confirmation email:', emailError);
    }

    res.json({
      message: "Order created successfully",
      success: true,
      orderId,
      order: {
        id: order.id,
        customerName: order.customerName,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: "Failed to create order", status: 500 });
  }
});

// Get all orders (admin only)
router.get('/', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    // In production, verify admin status properly
    const orderList = Array.from(orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({ orders: orderList });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: "Failed to fetch orders", status: 500 });
  }
});

// Get order by ID
router.get('/:orderId', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: "Failed to fetch order", status: 500 });
  }
});

// Update order status (admin only)
router.patch('/:orderId', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    // Update order
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();

    orders.set(orderId, order);

    res.json({
      message: "Order updated successfully",
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: "Failed to update order", status: 500 });
  }
});

// Get order statistics (admin only)
router.get('/stats/dashboard', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    const orderList = Array.from(orders.values());
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Fetch plants data
    let plantsData = { plants: [] };
    try {
      const plantsResponse = await fetch('http://localhost:8080/api/plants');
      if (plantsResponse.ok) {
        plantsData = await plantsResponse.json();
      }
    } catch (error) {
      console.warn('Failed to fetch plants data for stats');
    }

    // Fetch users data
    let usersData = { users: [] };
    try {
      const usersResponse = await fetch('http://localhost:8080/api/auth/users', {
        headers: { 'Authorization': req.headers.authorization || '' }
      });
      if (usersResponse.ok) {
        usersData = await usersResponse.json();
      }
    } catch (error) {
      console.warn('Failed to fetch users data for stats');
    }

    const stats = {
      totalOrders: orderList.length,
      totalRevenue: orderList.reduce((sum, order) => sum + order.total, 0),
      ordersThisMonth: orderList.filter(order =>
        new Date(order.createdAt) >= startOfMonth
      ).length,
      revenueThisMonth: orderList
        .filter(order => new Date(order.createdAt) >= startOfMonth)
        .reduce((sum, order) => sum + order.total, 0),
      ordersThisWeek: orderList.filter(order =>
        new Date(order.createdAt) >= startOfWeek
      ).length,
      totalProducts: plantsData.plants.length,
      productsThisWeek: 5, // Placeholder - in production would track creation dates
      totalUsers: usersData.users.length,
      usersThisMonth: usersData.users.filter((user: any) =>
        new Date(user.createdAt) >= startOfMonth
      ).length,
      ordersByStatus: {
        pending: orderList.filter(o => o.status === 'pending').length,
        processing: orderList.filter(o => o.status === 'processing').length,
        shipped: orderList.filter(o => o.status === 'shipped').length,
        delivered: orderList.filter(o => o.status === 'delivered').length,
        cancelled: orderList.filter(o => o.status === 'cancelled').length,
      },
      recentOrders: orderList
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          customerName: order.customerName,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        }))
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: "Failed to fetch statistics", status: 500 });
  }
});

export default router;
