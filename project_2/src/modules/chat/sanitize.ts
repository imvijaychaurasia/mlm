const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const INDIAN_PHONE_REGEX = /(\+91[-\s]?)?[6-9]\d{9}/g;
const URL_REGEX = /(?:https?:\/\/|www\.|wa\.me\/|t\.me\/|bit\.ly\/)\S+/gi;
const NUMERIC_SEQUENCE_REGEX = /(\d[\s-]){9,}\d|\d{10,}/g;

export const sanitizeMessage = (text: string, canReveal: boolean = false): { 
  sanitized: string; 
  hasRedactions: boolean;
} => {
  if (canReveal) {
    return { sanitized: text, hasRedactions: false };
  }

  let sanitized = text;
  let hasRedactions = false;

  // Replace emails
  if (EMAIL_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(EMAIL_REGEX, '[contact hidden]');
    hasRedactions = true;
  }

  // Replace phone numbers
  if (INDIAN_PHONE_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(INDIAN_PHONE_REGEX, '[contact hidden]');
    hasRedactions = true;
  }

  // Replace URLs
  if (URL_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(URL_REGEX, '[link hidden]');
    hasRedactions = true;
  }

  // Replace numeric sequences
  if (NUMERIC_SEQUENCE_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(NUMERIC_SEQUENCE_REGEX, '[contact hidden]');
    hasRedactions = true;
  }

  return { sanitized, hasRedactions };
};

export const validateMessage = (text: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (EMAIL_REGEX.test(text)) {
    errors.push('Email addresses are not allowed');
  }
  
  if (INDIAN_PHONE_REGEX.test(text)) {
    errors.push('Phone numbers are not allowed');
  }
  
  if (URL_REGEX.test(text)) {
    errors.push('URLs and links are not allowed');
  }
  
  if (NUMERIC_SEQUENCE_REGEX.test(text)) {
    errors.push('Long number sequences are not allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};