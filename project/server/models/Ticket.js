const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderId: {
    type: String,
    required: true
  },
  eventDate: {
    type: String,
    default: 'July 25, 2025'
  },
  eventTime: {
    type: String,
    default: '6:00 PM IST'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);