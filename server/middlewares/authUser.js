import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(!token)
  if (!token) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenDecode.id).select("-password");
    // console.log(user)
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    req.user = user; 
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
