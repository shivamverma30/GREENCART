import mongoose from "mongoose";
import { EMAIL_REGEX, INDIAN_MOBILE_REGEX } from '../utils/validation.js';

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_REGEX, 'Invalid email format'],
  },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zipCode: { type: Number, required: true, min: 100000, max: 999999 },
  country: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [INDIAN_MOBILE_REGEX, 'Invalid Indian mobile number'],
  },
});

const Address = mongoose.models.address || mongoose.model('address', addressSchema);

export default Address;
