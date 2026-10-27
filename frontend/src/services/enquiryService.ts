/**
 * Central enquiry sender. EVERY enquiry on the site goes through `send()`.
 *
 * Today it builds a prefilled WhatsApp message and opens `wa.me` — the
 * customer still has to press Send inside WhatsApp; nothing is stored on a
 * server. To also record enquiries in a CRM later, POST `payload` to your API
 * inside `send()` before opening WhatsApp (see README › Future API integration).
 */
import { store } from '../config/store';
import type { EnquiryKind } from '../types/store';
import { buildWhatsAppUrl, fillTemplate } from '../utils/whatsapp';

export interface EnquiryPayload {
  kind: EnquiryKind;
  name: string;
  city: string;
  product?: string;
  fabric?: string;
  price?: string;
  size?: string;
  /** Extra configuration lines, e.g. "Pairs: 2", "Lining: Blackout lining". */
  details?: string[];
  /** Free text from the customer. */
  message?: string;
  preferredDate?: string;
  link?: string;
}

export const ENQUIRY_LABELS: Record<EnquiryKind, string> = {
  general: 'General enquiry',
  product: 'Product enquiry',
  price: 'Price request',
  custom_quote: 'Custom-size quotation',
  fabric_sample: 'Fabric sample request',
  measurement: 'Home measurement appointment',
  installation: 'Installation enquiry',
  showroom_visit: 'Showroom visit',
};

export function buildEnquiryMessage(p: EnquiryPayload): string {
  const details = [
    ...(p.details ?? []).map((d) => `• ${d}`),
    p.preferredDate ? `• Preferred date: ${p.preferredDate}` : '',
    p.message?.trim() ? `Note: ${p.message.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return fillTemplate(store.contact.templates[p.kind], {
    store: store.identity.name,
    product: p.product,
    fabric: p.fabric,
    price: p.price,
    size: p.size,
    link: p.link,
    name: p.name,
    city: p.city,
    details,
  });
}

export interface SendResult {
  url: string;
  message: string;
  /** False when the browser blocked the new tab — show the link instead. */
  opened: boolean;
}

export function send(payload: EnquiryPayload): SendResult {
  const message = buildEnquiryMessage(payload);
  const url = buildWhatsAppUrl(store.contact.whatsapp, message);
  // Future: await fetch('/api/enquiries', { method: 'POST', body: JSON.stringify(payload) })
  // `noopener` in the features string makes window.open return null, so detach manually.
  const win = typeof window !== 'undefined' ? window.open(url, '_blank') : null;
  if (win) win.opener = null;
  return { url, message, opened: win !== null };
}

/** Plain WhatsApp link with the general template (used by the floating button). */
export function quickWhatsAppUrl(text?: string): string {
  return buildWhatsAppUrl(store.contact.whatsapp, text ?? `Hello ${store.identity.name}, I have a question about your curtains.`);
}
