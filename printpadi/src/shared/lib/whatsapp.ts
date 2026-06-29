export const normalizeWhatsAppPhone = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If starts with 234 (Nigeria), return as is; if starts with 0, replace with 234
  if (digits.startsWith('234')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return '234' + digits.slice(1);
  }
  // Assume Nigeria country code if just digits
  return '234' + digits;
};

export const buildWhatsAppUrl = (phoneNumber: string, message: string): string => {
  if (!phoneNumber) return '';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
};

