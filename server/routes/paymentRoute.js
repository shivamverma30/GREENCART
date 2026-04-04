import express from "express";
import authUser from "../middlewares/authUser.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authUser, createRazorpayOrder);
paymentRouter.post("/verify", authUser, verifyRazorpayPayment);

export default paymentRouter;
