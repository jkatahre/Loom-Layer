/**
 * WhatsApp message helpers. Templates use `{placeholder}` tokens; a line whose
 * placeholders all resolve to empty values is removed, so one template works
 * whether or not optional details (size, price, name…) are known.
 */

export type TemplateValues = Partial<Record<'store' | 'product' | 'fabric' | 'price' | 'size' | 'link' | 'name' | 'city' | 'details', string>>;

const TOKEN = /\{(\w+)\}/g;

export function fillTemplate(template: string, values: TemplateValues): string {
  const lookup = values as Record<string, string | undefined>;
  return template
    .split('\n')
    .flatMap((line) => {
      const tokens = [...line.matchAll(TOKEN)].map((m) => m[1]!);
      if (tokens.length > 0 && tokens.every((t) => !lookup[t]?.trim())) return [];
      return [line.replace(TOKEN, (_, key: string) => lookup[key]?.trim() ?? '')];
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Keep digits only; WhatsApp expects the full international number without `+`. */
export function normaliseWhatsappNumber(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = normaliseWhatsappNumber(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
