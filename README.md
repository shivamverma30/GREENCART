# GreenCart

## Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GreenCart%20Website-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://greencart-three-iota.vercel.app/)
![MERN](https://img.shields.io/badge/Stack-MERN-2ea44f?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge)
![Express](https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-111111?style=for-the-badge)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?style=for-the-badge)

Modern full-stack ecommerce web application built with the MERN ecosystem.

GreenCart delivers a smooth shopping experience with user authentication, product browsing, cart management, address handling, order placement, seller tools, and Razorpay payment integration.

Production URL: https://greencart-three-iota.vercel.app/
## Key Features

- 🔐 User authentication (register, login, logout, auth check)
- 🛒 Add to cart, update quantity, remove items
- 📦 Product listing and product detail pages
- 🏠 Address management for shipping
- 💳 Checkout with COD and Razorpay online payments
- 📜 User order history
- 🧑‍💼 Seller panel for product and order management
- ☁️ Cloudinary image upload support
- 📱 Responsive UI for desktop and mobile
- 🌙 Theme support with dark mode toggle

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, React Hot Toast, Tailwind CSS |
| Backend | Node.js, Express.js, JWT, Cookie Parser, CORS, Multer |
| Database | MongoDB with Mongoose |
| Third-Party Services | Cloudinary (media), Razorpay (payments), Vercel (deployment) |

## System Architecture

GreenCart follows a client-server architecture:

1. Frontend (React + Vite) handles UI, routing, and state interactions.
2. Frontend calls backend REST APIs through a centralized Axios client using VITE_API_URL.
3. Backend (Express) validates auth/session, processes business logic, and exposes API routes.
4. MongoDB stores users, products, carts, addresses, and orders.
5. Cloudinary stores uploaded product images.
6. Razorpay handles online payment order creation and payment verification/webhook updates.
7. Frontend and backend are deployed separately on Vercel.

## Folder Structure

~~~text
GREENCART/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── seller/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── seller/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
├── server/
│   ├── api/
│   │   └── index.js
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   ├── package.json
│   └── vercel.json
└── README.md
~~~

## Installation Guide

### 1) Clone the repository

~~~bash
git clone https://github.com/shivamverma30/GREENCART.git
cd GREENCART
~~~

### 2) Install frontend dependencies

~~~bash
cd client
npm install
~~~

### 3) Install backend dependencies

~~~bash
cd ../server
npm install
~~~

### 4) Configure environment variables

Create:

- client/.env
- server/.env

Use the examples in the Environment Variables section below.

### 5) Start backend server

~~~bash
cd server
npm run server
~~~

### 6) Start frontend

~~~bash
cd client
npm run dev
~~~

Frontend default: http://localhost:5173

## Environment Variables

### Frontend (client/.env)

~~~dotenv
VITE_API_URL="http://localhost:4000"
VITE_CURRENCY="₹"
VITE_RAZORPAY_KEY_ID="your_razorpay_public_key"
~~~

### Backend (server/.env)

~~~dotenv
NODE_ENV="development"
PORT=4000

JWT_SECRET="your_jwt_secret"

SELLER_EMAIL="seller@example.com"
SELLER_PASSWORD="seller_password"

MONGO_URI="your_mongodb_connection_string"
# Optional fallback supported by current code:
# MONGODB_URI="your_mongodb_connection_string"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
# Optional fallback supported by current code:
# RAZORPAY_SECRET="your_razorpay_key_secret"

RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
FRONTEND_URL="http://localhost:5173"
~~~

## Deployment (Vercel)

### Frontend Deployment

- Project root: client
- Build command: npm run build
- Output directory: dist
- Vercel rewrite is configured in client/vercel.json for SPA routing.

### Backend Deployment

- Project root: server
- Serverless entry: api/index.js
- Vercel routing is configured in server/vercel.json to route all requests to api/index.js.

### Required Vercel Environment Variables

- Configure frontend and backend env variables in Vercel dashboard.
- Redeploy after updating env variables.

## API Overview

Major routes currently used by the app:

| Module | Method | Route | Description |
|---|---|---|---|
| User | POST | /api/user/register | Register user |
| User | POST | /api/user/login | Login user |
| User | GET | /api/user/is-auth | Verify user auth |
| User | GET | /api/user/logout | Logout user |
| Seller | POST | /api/seller/login | Seller login |
| Seller | GET | /api/seller/is-auth | Verify seller auth |
| Product | GET | /api/products or /api/product/list | Product listing |
| Product | GET | /api/product/id | Product details by id payload |
| Cart | GET | /api/cart | Fetch cart |
| Cart | POST | /api/cart/update | Update cart |
| Address | POST | /api/address/add | Add address |
| Address | GET | /api/address/get | Fetch addresses |
| Order | POST | /api/orders or /api/order/cod | Place order |
| Order | GET | /api/order/user | User orders |
| Order | GET | /api/order/seller | Seller orders |
| Payment | POST | /api/payment/create-order | Create Razorpay order |
| Payment | POST | /api/payment/verify | Verify Razorpay payment |
| Payment | POST | /api/payment/webhook | Razorpay webhook handler |

## Future Improvements

- 📊 Advanced admin analytics dashboard
- 🚚 Real-time order tracking
- ❤️ Wishlist and saved items
- ⭐ Product ratings and reviews
- 🔎 Better search, filters, and sorting
- 🔔 Email and push notifications

## Contributing Guidelines

Contributions are welcome.

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit clear and meaningful changes.
4. Push your branch and open a Pull Request.

Please keep code style consistent and test changes locally before submitting.

## Author

Shivam Verma

- GitHub: https://github.com/shivamverma30

## License

This project is licensed under the ISC License.

