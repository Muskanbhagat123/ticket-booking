const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const Ticket = require('./models/Ticket');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate unique ticket ID
const generateTicketId = () => {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// API Routes

// 1. Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, name, email, quantity } = req.body;
    
    // Validate input
    if (!amount || !name || !email || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticketId = generateTicketId();
    
    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: ticketId,
      notes: {
        name,
        email,
        quantity: quantity.toString(),
        ticketId
      }
    };

    const order = await razorpay.orders.create(options);

    // Save ticket to database with pending status
    const ticket = new Ticket({
      name,
      email,
      quantity,
      ticketId,
      totalAmount: amount,
      orderId: order.id,
      paymentStatus: 'pending'
    });

    await ticket.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      ticketId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 2. Verify Payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      const ticket = await Ticket.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id,
          paymentStatus: 'completed'
        },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        ticket: {
          ticketId: ticket.ticketId,
          name: ticket.name,
          email: ticket.email,
          quantity: ticket.quantity,
          totalAmount: ticket.totalAmount,
          eventDate: ticket.eventDate,
          eventTime: ticket.eventTime
        }
      });
    } else {
      // Payment verification failed
      await Ticket.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentStatus: 'failed' }
      );

      res.status(400).json({ error: 'Payment verification failed' });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// 3. Get Ticket Details
app.get('/api/ticket/:ticketId', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// 4. Get All Tickets (Admin)
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});