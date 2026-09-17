/**
 * Phone number utilities for Brazilian phone/WhatsApp formatting and validation.
 */

/**
 * Strips non-digits and returns clean 10-digit (landline) or 11-digit (mobile) Brazilian number with DDD.
 * Handles cases with leading +55, 55, or 0.
 */
export function sanitizePhoneDigits(phone?: string | null): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');

  // Handle leading 0 (e.g. 062991234567 -> 62991234567)
  if (digits.startsWith('0') && (digits.length === 11 || digits.length === 12)) {
    digits = digits.slice(1);
  }

  // Handle country code 55 (e.g. 5562991234567 -> 62991234567)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }

  return digits;
}

/**
 * Checks if a phone number is a valid Brazilian mobile number (11 digits: DDD 11-99 + 9XXXX-XXXX).
 */
export function isMobileNumber(phone?: string | null): boolean {
  const digits = sanitizePhoneDigits(phone);
  if (digits.length !== 11) return false;
  
  const ddd = parseInt(digits.slice(0, 2), 10);
  const firstMobileDigit = digits[2];

  // Valid DDD is between 11 and 99, and Brazilian mobile numbers start with 9
  return ddd >= 11 && ddd <= 99 && firstMobileDigit === '9';
}

/**
 * Formats a raw phone string into (XX) 9XXXX-XXXX or (XX) XXXX-XXXX.
 */
export function formatPhoneBr(phone?: string | null): string {
  const digits = sanitizePhoneDigits(phone);
  if (!digits) return phone || '';

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone || '';
}

/**
 * Returns a valid wa.me URL for WhatsApp if the number is a valid mobile, or null if landline/invalid.
 */
export function getWhatsAppUrl(phone?: string | null, text?: string): string | null {
  const digits = sanitizePhoneDigits(phone);
  if (!isMobileNumber(digits)) return null;

  const baseUrl = `https://wa.me/55${digits}`;
  if (text) {
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  }

  return baseUrl;
}
