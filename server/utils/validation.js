export const EMAIL_REGEX = /^(?!.*\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const sanitizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

export const sanitizeEmail = (value) => sanitizeString(value).toLowerCase();

export const isNonEmptyString = (value) => sanitizeString(value).length > 0;

export const isValidEmail = (value) => EMAIL_REGEX.test(sanitizeEmail(value));

export const isStrongPassword = (value) =>
  STRONG_PASSWORD_REGEX.test(sanitizeString(value));

export const isValidIndianMobile = (value) => {
  const normalized = String(value ?? '').trim();
  return INDIAN_MOBILE_REGEX.test(normalized);
};

export const sanitizeObjectStrings = (obj = {}) => {
  const sanitized = {};

  Object.entries(obj).forEach(([key, value]) => {
    sanitized[key] = typeof value === 'string' ? value.trim() : value;
  });

  return sanitized;
};