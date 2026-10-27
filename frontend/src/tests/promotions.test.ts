import { describe, expect, it } from 'vitest';
import type { FestivalConfig } from '../types/store';
import { rupees } from '../utils/currency';
import { getOpenStatus } from '../utils/hours';
import { checkCoupon, isFestivalLive, liveCoupon, timeRemaining } from '../utils/promotions';
import { buildWhatsAppUrl, fillTemplate } from '../utils/whatsapp';

const festival: FestivalConfig = {
  id: 't',
  name: 'Diwali',
  active: true,
  startsAt: '2026-10-10T00:00:00+05:30',
  endsAt: '2026-11-15T23:59:59+05:30',
  coupon: { code: 'DIWALI2000', description: '', discount: rupees(2000), minOrder: rupees(15000), eligibleCategories: ['velvet-curtains'], excludedProductIds: ['p-x'] },
  badge: { label: 'Diwali offer' },
  stripTitle: '',
  slides: [],
};
const during = new Date('2026-10-26T12:00:00+05:30');
const after = new Date('2026-11-16T00:00:01+05:30');
const velvet = { id: 'p-1', category_ids: ['velvet-curtains'] };

describe('festival validity', () => {
  it('is live only inside its window and when flagged active', () => {
    expect(isFestivalLive(festival, during)).toBe(true);
    expect(isFestivalLive(festival, after)).toBe(false);
    expect(isFestivalLive(festival, new Date('2026-10-01T00:00:00+05:30'))).toBe(false);
    expect(isFestivalLive({ ...festival, active: false }, during)).toBe(false);
    expect(isFestivalLive({ ...festival, endsAt: 'not a date' }, during)).toBe(false);
    expect(isFestivalLive({ ...festival, endsAt: festival.startsAt }, during)).toBe(false);
    expect(isFestivalLive(null, during)).toBe(false);
  });
  it('never exposes an expired coupon', () => {
    expect(liveCoupon(festival, during)?.code).toBe('DIWALI2000');
    expect(liveCoupon(festival, after)).toBeNull();
  });
  it('counts down to zero and no further', () => {
    const t = timeRemaining(festival.endsAt, new Date('2026-11-14T23:59:59+05:30'));
    expect(t.days).toBe(1);
    expect(t.hours).toBe(0);
    expect(timeRemaining(festival.endsAt, after).totalMs).toBe(0);
  });
});

describe('coupon checks', () => {
  it('accepts a valid code case-insensitively', () => {
    expect(checkCoupon(' diwali2000 ', festival, velvet, rupees(20000), during)).toEqual({ valid: true, discount: rupees(2000), code: 'DIWALI2000' });
  });
  it('rejects expired, unknown, ineligible and below-minimum cases', () => {
    expect(checkCoupon('DIWALI2000', festival, velvet, rupees(20000), after).valid).toBe(false);
    expect(checkCoupon('OTHER', festival, velvet, rupees(20000), during).valid).toBe(false);
    expect(checkCoupon('DIWALI2000', festival, { id: 'p-2', category_ids: ['linen-curtains'] }, rupees(20000), during).valid).toBe(false);
    expect(checkCoupon('DIWALI2000', festival, { id: 'p-x', category_ids: ['velvet-curtains'] }, rupees(20000), during).valid).toBe(false);
    expect(checkCoupon('DIWALI2000', festival, velvet, rupees(14999), during).valid).toBe(false);
    expect(checkCoupon('', festival, velvet, rupees(20000), during).valid).toBe(false);
  });
});

describe('opening hours', () => {
  const hours = {
    mon: { open: '10:30', close: '20:30' },
    tue: null,
    wed: { open: '10:30', close: '20:30' },
    thu: { open: '10:30', close: '20:30' },
    fri: { open: '10:30', close: '20:30' },
    sat: { open: '10:30', close: '20:30' },
    sun: { open: '11:00', close: '18:00' },
  };
  it('reports open / closed in the showroom timezone', () => {
    // 2026-10-26 is a Monday. 06:00 UTC = 11:30 IST.
    expect(getOpenStatus(hours, 'Asia/Kolkata', new Date('2026-10-26T06:00:00Z')).isOpen).toBe(true);
    expect(getOpenStatus(hours, 'Asia/Kolkata', new Date('2026-10-26T16:00:00Z')).label).toMatch(/opens Wed/);
    expect(getOpenStatus(hours, 'Asia/Kolkata', new Date('2026-10-26T03:00:00Z')).label).toMatch(/today/);
  });
});

describe('WhatsApp messages', () => {
  it('fills placeholders and drops lines whose values are empty', () => {
    const msg = fillTemplate('Hello {store}\nProduct: {product}\nSize: {size}\nName: {name}', { store: 'Loom & Layer', product: 'Velvet', name: 'Asha' });
    expect(msg).toBe('Hello Loom & Layer\nProduct: Velvet\nName: Asha');
  });
  it('encodes the message into a wa.me link with digits only', () => {
    const url = buildWhatsAppUrl('+91 98000 00000', 'Hi & ₹4,999 / pair');
    expect(url).toBe(`https://wa.me/919800000000?text=${encodeURIComponent('Hi & ₹4,999 / pair')}`);
  });
});
