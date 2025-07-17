
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import stripe from "stripe";
import User from "../models/User.js"

// Place Order COD  |  POST /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
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
      paymentType: "COD",
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
      $or: [{ paymentType: "COD" }, { isPaid: true }],
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
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Place Order Online Stripe  |  POST   /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    const INR_TO_MYR = 0.055;

    let amountINR = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amountINR += Math.floor(amountINR * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount: amountINR,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

   const line_items = productData.map((item) => {
  const itemPriceMYR = (item.price * INR_TO_MYR) + ((item.price * INR_TO_MYR) * 0.02); // apply 2% tax
  const unitAmount = Math.round(itemPriceMYR * 100); // convert MYR to sen (for Stripe)

  return {
    price_data: {
      currency: "myr",
      product_data: {
        name: item.name,
      },
      unit_amount: unitAmount < 200 ? 200 : unitAmount, // enforce minimum unit_amount = RM2.00
    },
    quantity: item.quantity,
  };
});

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }
  //handling the event 
  switch(event.type){
    case "payment_intent.succeeded":{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      //getting session data 
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const {orderId,userId}=session.data[0].metadata;
      //mark payment as paid 
      await Order.findByIdAndUpdate(orderId ,{isPaid: true })
      //clear use cart 
      await User.findByIdAndUpdate(userId,{cartItems: {}})
      break;
    }
    case "payment_intent.failed":{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      //getting session data 
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const {orderId}=session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }
    default: 
    console.error(`Unhandled event type ${event.type}`)
    break;
  }
  response.json({received: true});
};