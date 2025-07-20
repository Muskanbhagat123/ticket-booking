import React, { useState } from 'react';
import { createOrder, verifyPayment, TicketDetails } from './services/api';
import './App.css';

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

function App() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketData, setTicketData] = useState<TicketDetails | null>(null);

  const handleBookingSuccess = (data: TicketDetails) => {
    setTicketData(data);
    setShowConfirmation(true);
  };

  const handleStartOver = () => {
    setShowConfirmation(false);
    setTicketData(null);
  };

  return (
    <div className="app">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      
      {!showConfirmation ? (
        <BookingPage onBookingSuccess={handleBookingSuccess} />
      ) : (
        <ConfirmationPage ticketData={ticketData!} onStartOver={handleStartOver} />
      )}
    </div>
  );
}

function BookingPage({ onBookingSuccess }: { onBookingSuccess: (data: TicketDetails) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  const ticketPrice = 100;
  const totalPrice = tickets * ticketPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || tickets < 1) {
      alert('Please fill all fields!');
      return;
    }

    setLoading(true);
    
    try {
      // Create order on backend
      const orderData = await createOrder({
        amount: totalPrice,
        name,
        email,
        quantity: tickets
      });

      // Initialize Razorpay payment
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Tech Festival 2025',
        description: 'Virtual Event Tickets',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResult.success) {
              onBookingSuccess(verificationResult.ticket);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: '#667eea'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        alert('Payment failed: ' + response.error.description);
      });
      
      razorpay.open();
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="event-header">
        <div className="event-icon">🎪</div>
        <h1 className="event-title">TECH FESTIVAL 2025</h1>
        <p className="event-subtitle">The Ultimate Virtual Experience</p>
        <div className="event-details">
          <span className="detail-item">📅 July 25, 2025</span>
          <span className="detail-item">⏰ 6:00 PM IST</span>
          <span className="detail-item">🌐 Virtual Event</span>
        </div>
      </div>

      <div className="booking-card">
        <div className="card-header">
          <h2>🎫 Book Your Tickets</h2>
          <p>Join thousands of tech enthusiasts!</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="input-group">
            <label>👤 Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label>🎫 Number of Tickets</label>
            <input
              type="number"
              min="1"
              max="10"
              value={tickets}
              onChange={(e) => setTickets(parseInt(e.target.value) || 1)}
              className="form-input"
            />
          </div>

          <div className="price-summary">
            <div className="price-row">
              <span>Price per ticket:</span>
              <span>₹{ticketPrice}</span>
            </div>
            <div className="price-row">
              <span>Quantity:</span>
              <span>{tickets}</span>
            </div>
            <div className="price-total">
              <span>Total Amount:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button type="submit" className="book-button" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Order...
              </>
            ) : (
              <>💳 Book Now - ₹{totalPrice}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function ConfirmationPage({ ticketData, onStartOver }: { ticketData: TicketDetails; onStartOver: () => void }) {
  return (
    <div className="container">
      <div className="confirmation-card">
        <div className="success-animation">
          <div className="checkmark">✓</div>
        </div>
        
        <h1 className="success-title">🎉 Booking Confirmed!</h1>
        <p className="success-subtitle">Your tickets are ready!</p>

        <div className="ticket-details">
          <div className="ticket-header">
            <h3>🎫 Your Digital Ticket</h3>
            <div className="ticket-id">ID: {ticketData.ticketId}</div>
          </div>
          
          <div className="ticket-info">
            <div className="info-row">
              <span>👤 Name:</span>
              <span>{ticketData.name}</span>
            </div>
            <div className="info-row">
              <span>📧 Email:</span>
              <span>{ticketData.email}</span>
            </div>
            <div className="info-row">
              <span>🎫 Tickets:</span>
              <span>{ticketData.quantity}</span>
            </div>
            <div className="info-row total">
              <span>💰 Total Paid:</span>
              <span>₹{ticketData.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="download-button">📥 Download Ticket</button>
          <button className="share-button">📤 Share Event</button>
        </div>

        <button onClick={onStartOver} className="book-more-button">
          🎫 Book More Tickets
        </button>
      </div>
    </div>
  );
}

export default App;