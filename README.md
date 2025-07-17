# 🛒 GreenCart – Full Stack Grocery Delivery Website

[![Live Site](https://img.shields.io/badge/Live-GreenCart-brightgreen?style=for-the-badge&logo=vercel)](https://greencart-three-iota.vercel.app/)
[![Build](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge&logo=githubactions)](https://github.com/shivamverma30/greencart/actions)
[![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](https://opensource.org/licenses/ISC)


## 🚀 Features

- 🛍️ User-friendly, responsive UI built with **React.js** and **Tailwind CSS**
- 📦 Admin panel for uploading and managing grocery items
- 💳 Stripe integration for secure online payments
- 🔐 Secure authentication using **JWT & bcrypt**
- ☁️ Image uploading with **Cloudinary**
- 📁 RESTful APIs using **Express.js**
- 📊 MongoDB database with **Mongoose** ODM
- 🌐 CORS & cookie-based session management
- 📦 File upload support using **Multer**

---

## 🧰 Tech Stack

### Frontend

- React.js `^19.1.0`
- React Router DOM `^7.6.2`
- Tailwind CSS `^4.1.10`
- Axios `^1.10.0`
- Vite `^6.3.5`
- ESLint for linting
- React Hot Toast for notifications

### Backend

- Express.js `^5.1.0`
- MongoDB & Mongoose `^8.16.0`
- Stripe API `^18.2.1`
- Cloudinary `^2.7.0`
- Multer for file uploads
- JWT + bcrypt for auth
- Cookie-parser + dotenv + CORS

---

## 📁 Folder Structure

greencart/
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── assets/
│ ├── components/
│ │ ├── SellerNavbar.js
│ │ ├── CustomerNavbar.js
│ │ ├── CartComponent.js
│ │ ├── CategoryCard.js
│ │ ├── Loading.jsx
│ │ ├── LoginForm.js
│ │ ├── MakeAdminForm.js
│ │ ├── Navbar.js
│ │ ├── ProductCard.js
│ │ └── ProductCategory.js
│ ├── context/
│ │ └── MainContext.js
│ ├── pages/
│ │ ├── AddProductPage.js
│ │ ├── AllProductPage.js
│ │ ├── Cart.js
│ │ ├── Home.js
│ │ ├── MyOrder.js
│ │ ├── ProductCategoryPage.jsx
│ │ └── Signup.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── server/ # Node.js backend
│ ├── config/
│ │ └── cloudinary.js
│ ├── controllers/
│ │ └── productController.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── models/
│ │ ├── Order.js
│ │ ├── Product.js
│ │ └── User.js
│ ├── routes/
│ │ ├── orderRoutes.js
│ │ ├── productRoutes.js
│ │ └── userRoutes.js
│ ├── server.js
│ └── .env
├── README.md

## 🛠️ Installation & Development

Follow the steps below to run the project locally:

---

### ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB Atlas (or local MongoDB)
- Stripe account (for payments)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/greencart.git
cd greencart

### 2. Set Up the Frontend (React + Tailwind CSS)

Follow the steps below to get the frontend of the grocery delivery website running:

```bash
cd client
npm install
npm run dev

### 3. Set Up the Backend (Node.js + Express + MongoDB)

Follow these steps to configure and start the backend server:

---

#### 🔧 Step-by-Step Instructions

```bash
cd server
npm install
npm run server

