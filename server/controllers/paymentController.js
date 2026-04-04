import crypto from "crypto";
import Razorpay from "razorpay";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const normalizePaymentType = (value, fallback = "ONLINE") => {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "ONLINE") return "ONLINE";
  if (normalized === "COD") return "COD";
  return fallback;
};

const calculateTotalsFromItems = async (items) => {
  const normalizedItems = [];
  let subTotalPaise = 0;

  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!item.product || !Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("Invalid cart item data");
    }

    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error("Product not found while calculating order total");
    }

    const unitAmountPaise = Math.round(Number(product.offerPrice) * 100);
    normalizedItems.push({ product: item.product, quantity });
    subTotalPaise += unitAmountPaise * quantity;
  }

  const taxPaise = Math.round(subTotalPaise * 0.02);
  const totalPaise = subTotalPaise + taxPaise;
  const totalINR = Number((totalPaise / 100).toFixed(2));

  return { normalizedItems, taxPaise, totalPaise, totalINR };
};

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
};

const updateOrderFromWebhook = async ({ razorpayOrderId, paymentId, eventType }) => {
  if (!razorpayOrderId) {
    console.error("Razorpay webhook missing razorpay order id", { eventType, paymentId });
    return { success: false, reason: "missing_order_id" };
  }

  const order = await Order.findOne({ razorpayOrderId });
  if (!order) {
    console.error("Razorpay webhook order not found", { razorpayOrderId, eventType });
    return { success: false, reason: "order_not_found" };
  }

  if ((order.paymentStatus === "PAID" || order.isPaid) && eventType === "payment.captured") {
    console.log("Razorpay webhook duplicate ignored", {
      eventType,
      orderId: order._id.toString(),
      razorpayOrderId,
    });
    return { success: true, reason: "duplicate_paid", order };
  }

  if (eventType === "payment.captured") {
    order.status = "PAID";
    order.paymentStatus = "PAID";
    order.isPaid = true;
    order.paymentId = paymentId || order.paymentId;
    order.razorpayPaymentId = paymentId || order.razorpayPaymentId;
    await order.save();

    await User.findByIdAndUpdate(order.userId, { cartItems: {} });

    console.log("Razorpay webhook order updated to PAID", {
      orderId: order._id.toString(),
      razorpayOrderId,
      paymentId,
    });
    return { success: true, reason: "paid", order };
  }

  if (eventType === "payment.failed") {
    if (order.paymentStatus === "PAID" || order.isPaid) {
      console.log("Razorpay failed webhook ignored for paid order", {
        orderId: order._id.toString(),
        razorpayOrderId,
      });
      return { success: true, reason: "paid_order_ignored", order };
    }

    order.status = "FAILED";
    order.paymentStatus = "FAILED";
    order.isPaid = false;
    order.paymentId = paymentId || order.paymentId;
    order.razorpayPaymentId = paymentId || order.razorpayPaymentId;
    await order.save();

    console.log("Razorpay webhook order updated to FAILED", {
      orderId: order._id.toString(),
      razorpayOrderId,
      paymentId,
    });
    return { success: true, reason: "failed", order };
  }

  return { success: false, reason: "unhandled_event" };
};

// POST /api/payment/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod, orderAmount } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized request" });
    }

    if (!address || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Invalid order payload" });
    }

    const { normalizedItems, taxPaise, totalPaise, totalINR } = await calculateTotalsFromItems(items);

    const clientAmountPaise = Math.round(Number(orderAmount) * 100);
    if (!Number.isFinite(clientAmountPaise)) {
      return res.json({ success: false, message: "Invalid order amount" });
    }

    if (Math.abs(clientAmountPaise - totalPaise) > 1) {
      console.error("Razorpay create-order amount mismatch", {
        userId,
        clientAmountPaise,
        serverTotalPaise: totalPaise,
      });
      return res.json({ success: false, message: "Order total mismatch" });
    }

    const order = await Order.create({
      userId,
      items: normalizedItems,
      amount: totalINR,
      address,
      paymentType: normalizePaymentType(paymentMethod, "ONLINE"),
      status: "PAYMENT_PENDING",
      paymentStatus: "PENDING",
      isPaid: false,
    });

    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: order._id.toString().slice(-40),
      notes: {
        appOrderId: order._id.toString(),
        userId,
        taxPaise: String(taxPaise),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// POST /api/payment/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized request" });
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.json({ success: false, message: "Missing payment verification data" });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(payload)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    const order = await Order.findOne({
      userId,
      razorpayOrderId: razorpay_order_id,
      paymentType: { $in: ["ONLINE", "Online"] },
    });

    if (!order) {
      return res.json({ success: false, message: "Order not found for payment verification" });
    }

    if (!isSignatureValid) {
      order.status = "FAILED";
      order.paymentStatus = "FAILED";
      order.isPaid = false;
      order.paymentId = razorpay_payment_id;
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      console.error("Razorpay signature verification failed", {
        userId,
        razorpay_order_id,
        razorpay_payment_id,
      });

      return res.json({ success: false, message: "Payment verification failed" });
    }

    order.status = "PAID";
    order.paymentStatus = "PAID";
    order.isPaid = true;
    order.paymentId = razorpay_payment_id;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// POST /api/payment/webhook
export const razorpayWebhookHandler = async (req, res) => {
  try {
    console.log("Razorpay webhook received");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return res.status(500).json({ success: false, message: "Webhook secret not configured" });
    }

    const razorpaySignature = req.headers["x-razorpay-signature"];
    if (!razorpaySignature) {
      return res.status(400).json({ success: false, message: "Missing webhook signature" });
    }

    const rawBody = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("Razorpay webhook signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    console.log("Razorpay webhook signature verified");

    const event = JSON.parse(rawBody.toString("utf8"));
    const eventType = event?.event;
    const paymentEntity = event?.payload?.payment?.entity || {};
    const razorpayOrderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    if (!["payment.captured", "payment.failed"].includes(eventType)) {
      console.log("Razorpay webhook event ignored", { eventType });
      return res.status(200).json({ success: true, message: "Event ignored" });
    }

    await updateOrderFromWebhook({
      razorpayOrderId,
      paymentId,
      eventType,
    });

    return res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
