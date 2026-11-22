# NutKart — Full-stack learning marketplace

A local learning project built with React/Vite, Express, MongoDB, JWT and optional Razorpay test checkout.

## Requirements
- Node.js 20 or newer
- MongoDB Atlas account (or local MongoDB)
- Optional Razorpay test account for online test payments

## 1. Configure MongoDB and backend
1. In MongoDB Atlas, create a free cluster and database user.
2. Add your IP address under Network Access.
3. Copy `backend/.env.example` to `backend/.env`.
4. Put your MongoDB connection string in `MONGODB_URI`.
5. Set `JWT_SECRET` to a long random secret (do not share it).
6. Keep `CLIENT_URL=http://localhost:5173`.
7. Optional: add Razorpay TEST key ID and TEST key secret.

## 2. Start backend
Open a terminal in `NutKart/backend`:
```bash
npm install
npm run dev
```
API health check: http://localhost:5000/api/health

## 3. Start frontend
Open a second terminal in `NutKart/frontend`:
```bash
npm install
```
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Then run:
```bash
npm run dev
```
Open http://localhost:5173

## 4. Try the website
- Register a customer account to place an order.
- Register another account and select the Farmer role to add products from the account panel.
- The initial sample products appear even if the database has no products.
- Orders are saved in MongoDB.
- Razorpay checkout only works after adding Razorpay TEST keys. The demo-order button records a pending order without collecting payment.

## Important notes
- This is a learning/demo starter, not a production-ready commerce system.
- Never commit `.env` files or expose Razorpay secret keys in frontend code.
- Before any real launch, add inventory reservation, verified payment webhooks, shipping/tax rules, email notifications, stronger validation, tests, monitoring and a production security review.
- Payment verification is performed server-side using the Razorpay signature. For a production-grade payment flow, also verify payment/order status with Razorpay and implement webhooks.
