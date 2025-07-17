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

<pre> <details> <summary>📁 <strong>Click to Expand: Folder Structure</strong></summary> <br> ```text greencart/ ├── client/ # React frontend │ ├── public/ │ └── src/ │ ├── assets/ │ ├── components/ │ │ ├── SellerNavbar.js │ │ ├── CustomerNavbar.js │ │ ├── CartComponent.js │ │ └── ... │ ├── context/ │ │ └── MainContext.js │ ├── pages/ │ │ ├── Home.js │ │ ├── Cart.js │ │ └── ... │ ├── App.jsx │ ├── main.jsx │ └── index.css ├── server/ # Node.js backend │ ├── config/ │ ├── controllers/ │ ├── middleware/ │ ├── models/ │ ├── routes/ │ ├── server.js │ └── .env └── README.md ``` </details> </pre>

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

2. Set Up the Frontend (React + Tailwind CSS)
cd client
npm install
npm run dev
This starts the frontend at: http://localhost:5173
Includes Tailwind styling, routing, toast notifications, and product UI

3. Set Up the Backend (Node.js + Express + MongoDB)
cd ../server
npm install
npm run server
This starts the backend server at: http://localhost:5000

4. Configure Environment Variables
Create a .env file inside the server directory

5. Test Stripe Integration


### ✅ You're All Set!

Your **Grocery Delivery Web App** is now fully functional on your local machine! 🛒  
You can explore the complete stack — from **shopping** and **order placement** to **admin controls** and **secure Stripe payments**.

---

🧠 **What’s Next?**

- ✨ Customize it to match your business or brand  
- 🧑‍💻 Add more features and polish the UI  
- 🚀 Deploy it online and start serving real customers  
- 🔒 Make it production-ready with secure auth and validation

---

💸 **Zero Budget, Full Power**

This project uses **100% free tools and services**:
- MongoDB Atlas (Free tier)  
- Vercel for frontend hosting  
- Railway/Render for backend deployment  
- Stripe test mode for online payments  

> 💡 A real-world eCommerce solution — built without spending a single rupee!

---

🌟 **Love this project? [Star the repository](https://github.com/shivamverma30/greencart) and share it!**

---

Made with ❤️ by **Shivam Verma**











