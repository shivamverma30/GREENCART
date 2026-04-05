import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRout.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import { razorpayWebhookHandler } from './controllers/paymentController.js';

const app = express();

await connectDB()
await connectCloudinary()

//allow mutiple origins 
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://greencart.vercel.app',
  'https://greencart-three-iota.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests and approved browser origins.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

//Middleware configuration 
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), razorpayWebhookHandler);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.options(/.*/, cors(corsOptions));




app.get('/',(req,res)=>res.send("API is Working")); 
app.use('/api/user',userRouter)
app.use('/api/users',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/products',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/orders',orderRouter)
app.use('/api/payment',paymentRouter)

export default app;