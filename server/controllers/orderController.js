
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const normalizePaymentType = (value, fallback = "COD") => {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "ONLINE") return "ONLINE";
  if (normalized === "COD") return "COD";
  return fallback;
};

// Place Order COD  |  POST /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address, paymentMethod } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: normalizePaymentType(paymentMethod, "COD"),
      isPaid: false,
    });
    return res.json({ success: true, message: "Order placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Orders for UserID  |  GET /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({
      userId,
      $or: [
        { paymentType: { $in: ["COD", "ONLINE", "Online"] } },
        { isPaid: true },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { paymentType: { $in: ["COD", "ONLINE", "Online"] } },
        { isPaid: true },
      ],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
