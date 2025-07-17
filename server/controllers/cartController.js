import User from "../models/User.js";

// update user cartData  :  /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { cartItems } = req.body;

    if (!cartItems) {
      return res.json({ success: false, message: "Missing cartItems" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    return res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};
