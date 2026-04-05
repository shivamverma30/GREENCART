import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  isNonEmptyString,
  isStrongPassword,
  isValidEmail,
  sanitizeEmail,
  sanitizeString,
} from '../utils/validation.js';

// Register User /api/user/register
export const register = async (req, res) => {
  try {
    const name = sanitizeString(req.body?.name);
    const email = sanitizeEmail(req.body?.email);
    const password = sanitizeString(req.body?.password);
    const confirmPassword = sanitizeString(req.body?.confirmPassword);

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!isValidEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    if (!isStrongPassword(password)) {
      return res.json({
        success: false,
        message:
          'Password must contain uppercase, lowercase, number and special character.',
      });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    // console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login User : /api/user/login
export const login = async (req, res) => {
  try {
    const email = sanitizeEmail(req.body?.email);
    const password = sanitizeString(req.body?.password);

    if (!isNonEmptyString(email) || !isNonEmptyString(password))
      return res.json({ success: false, message: 'Email and password required' });

    if (!isValidEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // console.log("oiok")
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // console.log("oiok345")
    return res.json({ success: true, user: { email: user.email, name: user.name } });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check auth   : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const user = req.user; 
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout User :  /api/user/logout 
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
