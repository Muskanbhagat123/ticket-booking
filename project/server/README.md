# Ticket Booking Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the server directory with:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ticketbooking

# Razorpay Keys (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Server Port
PORT=5000
```

### 3. Setup MongoDB
- Install MongoDB locally OR use MongoDB Atlas (cloud)
- For local: Download from https://www.mongodb.com/try/download/community
- For cloud: Create account at https://cloud.mongodb.com/

### 4. Setup Razorpay (UPI Payment)
1. Go to https://dashboard.razorpay.com/
2. Create account (free for testing)
3. Get your API keys from Settings > API Keys
4. Add keys to `.env` file

### 5. Run the Server
```bash
npm run dev
```

## API Endpoints

- `POST /api/create-order` - Create payment order
- `POST /api/verify-payment` - Verify UPI payment
- `GET /api/ticket/:ticketId` - Get ticket details
- `GET /api/tickets` - Get all tickets (admin)
- `GET /api/health` - Health check

## Testing Payments

Use Razorpay test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

For UPI testing, use test UPI IDs provided by Razorpay.