import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateOrderRequest {
  amount: number;
  name: string;
  email: string;
  quantity: number;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  ticketId: string;
  razorpayKeyId: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface TicketDetails {
  ticketId: string;
  name: string;
  email: string;
  quantity: number;
  totalAmount: number;
  eventDate: string;
  eventTime: string;
}

// Create payment order
export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await api.post('/create-order', data);
  return response.data;
};

// Verify payment
export const verifyPayment = async (data: VerifyPaymentRequest): Promise<{ success: boolean; ticket: TicketDetails }> => {
  const response = await api.post('/verify-payment', data);
  return response.data;
};

// Get ticket details
export const getTicket = async (ticketId: string): Promise<TicketDetails> => {
  const response = await api.get(`/ticket/${ticketId}`);
  return response.data;
};

// Health check
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get('/health');
  return response.data;
};