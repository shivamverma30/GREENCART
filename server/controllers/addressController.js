import Address from "../models/Address.js";
import {
  isNonEmptyString,
  isValidEmail,
  isValidIndianMobile,
  sanitizeEmail,
  sanitizeObjectStrings,
} from '../utils/validation.js';

// Add Address  |  POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;

    if (!address || typeof address !== 'object' || Array.isArray(address)) {
      return res.json({ success: false, message: 'Invalid address payload' });
    }

    const sanitizedAddress = sanitizeObjectStrings(address);
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
      'phone',
    ];

    const missingField = requiredFields.find((field) => !isNonEmptyString(sanitizedAddress[field]));
    if (missingField) {
      return res.json({ success: false, message: `${missingField} is required` });
    }

    if (!isValidEmail(sanitizedAddress.email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    if (!isValidIndianMobile(sanitizedAddress.phone)) {
      return res.json({
        success: false,
        message: 'Invalid mobile number. Enter a valid 10-digit Indian mobile number starting with 6-9',
      });
    }

    if (!/^\d{6}$/.test(String(sanitizedAddress.zipCode).trim())) {
      return res.json({ success: false, message: 'Zip code must be exactly 6 digits' });
    }

    const normalizedAddress = {
      ...sanitizedAddress,
      email: sanitizeEmail(sanitizedAddress.email),
      phone: String(sanitizedAddress.phone).trim(),
      zipCode: Number(sanitizedAddress.zipCode),
    };

    await Address.create({ ...normalizedAddress, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Address  |  GET /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
