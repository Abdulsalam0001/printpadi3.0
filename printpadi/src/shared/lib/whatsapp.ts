// ============================================================
// PrintPadi – shared/lib/whatsapp.ts
// Exact port of shared/lib/whatsapp.ts from the Next.js project.
// ============================================================

export type WhatsAppOrderPrefill = {
  productName: string;
  origin?: string;
  quantity: number;
  /** Already formatted for display, e.g. from formatNaira */
  unitPriceLabel: string;
  colorLabel?: string | null;
  sizeLabel?: string | null;
  customizationLines: string[];
  productUrl: string;
  productType: 'bulk' | 'retail';
  internationalSourcing: boolean;
  /** Shown only for bulk, e.g. "MOQ: 10 pcs." */
  moqLine?: string;
};

export const normalizeWhatsAppPhone = (raw: string): string => raw.replace(/\D/g, '');

export const buildWhatsAppUrl = (
  phoneDigits: string,
  message: string,
): string => {
  if (!phoneDigits) {
    return '';
  }
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
};

export const buildWhatsAppOrderMessage = (input: WhatsAppOrderPrefill): string => {
  const intro = input.internationalSourcing
    ? "Hello PrintPadi, I'm interested in this product (international sourcing)."
    : input.productType === 'bulk'
      ? 'Hello PrintPadi, I want to place a bulk order.'
      : "Hello PrintPadi, I'm interested in this product.";

  const lines: string[] = [
    intro,
    `Product: ${input.productName}`,
    ...(input.origin?.trim() ? [`Origin: ${input.origin.trim()}`] : []),
    `Quantity: ${input.quantity} pcs`,
    `Unit price: NGN ${input.unitPriceLabel}`,
    `Selected color: ${input.colorLabel ?? 'Not selected'}`,
    `Selected size: ${input.sizeLabel ?? 'Not selected'}`,
    'Selected customizations:',
    ...(input.customizationLines.length > 0
      ? input.customizationLines.map(label => `- ${label}`)
      : ['- None']),
    ...(input.productType === 'bulk' && input.moqLine ? [input.moqLine] : []),
    `Product link: ${input.productUrl || 'Not available'}`,
  ];

  return lines.join('\n');
};

export type WhatsAppQuoteRequestPrefill = {
  fullName: string;
  phone: string;
  email: string;
  productCategory: string;
  productDescription: string;
  quantity: string;
  referenceFileUrl?: string;
  referenceFileName?: string;
};

export const buildWhatsAppQuoteRequestMessage = (
  input: WhatsAppQuoteRequestPrefill,
): string => {
  const lines: string[] = [
    "Hello PrintPadi, I'd like to request a custom quote (China sourcing).",
    '',
    `Full name: ${input.fullName.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Email: ${input.email.trim()}`,
    `Product category: ${input.productCategory.trim()}`,
    `Description: ${input.productDescription.trim()}`,
    `Quantity needed: ${input.quantity.trim()}`,
  ];

  const referenceUrl = input.referenceFileUrl?.trim();
  if (referenceUrl) {
    const referenceName = input.referenceFileName?.trim();
    lines.push(
      referenceName
        ? `Reference image: ${referenceName}\n${referenceUrl}`
        : `Reference image: ${referenceUrl}`,
    );
  }

  return lines.join('\n');
};

export type WhatsAppCustomQuotePrefill = {
  fullName: string;
  phone: string;
  email: string;
  productCategory: string;
  productDescription: string;
  quantity: string;
  artworkDesign: string;
};

export const buildWhatsAppCustomQuoteMessage = (
  input: WhatsAppCustomQuotePrefill,
): string => {
  const lines: string[] = [
    "Hello PrintPadi, I'd like to request a custom quote.",
    '',
    `Full name: ${input.fullName.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Email: ${input.email.trim()}`,
    `Product category: ${input.productCategory.trim()}`,
    `Description: ${input.productDescription.trim()}`,
    `Quantity needed: ${input.quantity.trim()}`,
    `Artwork & Design: ${input.artworkDesign.trim()}`,
  ];

  return lines.join('\n');
};
