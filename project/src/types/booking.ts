export interface BookingData {
  name: string;
  email: string;
  quantity: number;
}

export interface TicketConfirmation {
  ticketId: string;
  name: string;
  email: string;
  quantity: number;
  totalAmount: number;
  eventDate: string;
  eventTime: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}