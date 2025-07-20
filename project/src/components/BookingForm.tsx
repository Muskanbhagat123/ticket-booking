import React, { useState } from 'react';
import { User, Mail, Ticket, CreditCard, Loader2 } from 'lucide-react';
import { BookingData } from '../types/booking';

interface BookingFormProps {
  onBookingComplete: (ticketId: string, bookingData: BookingData) => void;
}

const TICKET_PRICE = 100; // ₹100 per ticket

export default function BookingForm({ onBookingComplete }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    email: '',
    quantity: 1,
  });
  
  const [errors, setErrors] = useState<Partial<BookingData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.quantity < 1 || formData.quantity > 10) {
      newErrors.quantity = 'Quantity must be between 1 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call to create payment order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      const mockTicketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      onBookingComplete(mockTicketId, formData);
    } catch (error) {
      alert('Error occurred during booking. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = formData.quantity * TICKET_PRICE;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
          <Ticket className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Book Your Tickets</h2>
        <p className="text-gray-600 mt-2">Secure your spot at this exclusive event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Tickets
          </label>
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="1"
              max="10"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Number of tickets"
            />
          </div>
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price per ticket:</span>
            <span className="font-medium">₹{TICKET_PRICE}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{formData.quantity}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total Amount:</span>
            <span className="text-lg font-bold text-purple-600">₹{totalAmount}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Book Now - ₹{totalAmount}
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Your payment is secured with 256-bit SSL encryption
      </p>
    </div>
  );
}