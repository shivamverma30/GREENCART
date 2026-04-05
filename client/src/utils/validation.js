export const EMAIL_REGEX = /^(?!.*\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const sanitizeInput = (value) =>
  typeof value === 'string' ? value.trim() : '';

export const isRequired = (value) => sanitizeInput(value).length > 0;

export const isValidEmail = (value) =>
  EMAIL_REGEX.test(sanitizeInput(value).toLowerCase());

export const isStrongPassword = (value) =>
  STRONG_PASSWORD_REGEX.test(sanitizeInput(value));

export const isValidIndianMobile = (value) =>
  INDIAN_MOBILE_REGEX.test(String(value ?? '').trim());