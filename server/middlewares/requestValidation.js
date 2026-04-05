import {
  isNonEmptyString,
  isStrongPassword,
  isValidEmail,
  sanitizeObjectStrings,
} from '../utils/validation.js';

export const sanitizeBodyStrings = (req, _res, next) => {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req.body = sanitizeObjectStrings(req.body);
  }
  next();
};

export const validateRequiredFields = (fields = []) => (req, res, next) => {
  const missingField = fields.find((field) => !isNonEmptyString(req.body?.[field]));

  if (missingField) {
    return res.json({
      success: false,
      message: `${missingField} is required`,
    });
  }

  next();
};

export const validateEmailField = (field = 'email') => (req, res, next) => {
  if (!isValidEmail(req.body?.[field])) {
    return res.json({ success: false, message: 'Invalid email format' });
  }

  next();
};

export const validatePasswordStrength = (field = 'password') => (req, res, next) => {
  if (!isStrongPassword(req.body?.[field])) {
    return res.json({
      success: false,
      message:
        'Password must contain uppercase, lowercase, number and special character.',
    });
  }

  next();
};

export const validateConfirmPassword = (
  passwordField = 'password',
  confirmField = 'confirmPassword'
) => (req, res, next) => {
  if (req.body?.[passwordField] !== req.body?.[confirmField]) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }

  next();
};