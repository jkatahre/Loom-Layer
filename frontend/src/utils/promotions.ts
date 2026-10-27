import type { Paise } from '../types/product';
import type { CouponConfig, FestivalConfig } from '../types/store';

/**
 * Promotion rules. A promotion is live only when it is flagged active AND the
 * current time is inside its valid, parseable date window. Anything else —
 * missing dates, typos, expiry — is treated as inactive so an expired offer
 * can never be shown.
 */

const parse = (iso: string | undefined): number | null => {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
};

export function isFestivalLive(festival: FestivalConfig | null | undefined, now: Date = new Date()): festival is FestivalConfig {
  if (!festival || !festival.active) return false;
  const start = parse(festival.startsAt);
  const end = parse(festival.endsAt);
  if (start === null || end === null || end <= start) return false;
  const t = now.getTime();
  return t >= start && t < end;
}

export interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function timeRemaining(endsAt: string, now: Date = new Date()): TimeRemaining {
  const end = parse(endsAt);
  const totalMs = end === null ? 0 : Math.max(0, end - now.getTime());
  const s = Math.floor(totalMs / 1000);
  return {
    totalMs,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Whether a product (by its category slugs and id) qualifies for a coupon. */
export function isCouponEligible(
  coupon: CouponConfig,
  product: { id: string; category_ids: string[] },
): boolean {
  if (coupon.excludedProductIds.includes(product.id)) return false;
  if (coupon.eligibleCategories === 'all') return true;
  return product.category_ids.some((c) => (coupon.eligibleCategories as string[]).includes(c));
}

export type CouponCheck =
  | { valid: true; discount: Paise; code: string }
  | { valid: false; reason: string };

/**
 * Validate a coupon code against the live festival, the product and the
 * order value. Codes are compared case-insensitively.
 */
export function checkCoupon(
  code: string,
  festival: FestivalConfig | null | undefined,
  product: { id: string; category_ids: string[] } | null,
  orderValue: Paise,
  now: Date = new Date(),
): CouponCheck {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { valid: false, reason: 'Enter a coupon code.' };
  if (!isFestivalLive(festival, now) || !festival.coupon) return { valid: false, reason: 'This offer has ended.' };
  const coupon = festival.coupon;
  if (coupon.code.toUpperCase() !== trimmed) return { valid: false, reason: 'This code is not recognised.' };
  if (product && !isCouponEligible(coupon, product)) return { valid: false, reason: 'This design is not part of the offer.' };
  if (!Number.isInteger(orderValue) || orderValue < coupon.minOrder) {
    return { valid: false, reason: 'Order value is below the minimum for this code.' };
  }
  if (coupon.discount <= 0) return { valid: false, reason: 'This offer has no discount configured.' };
  return { valid: true, discount: Math.min(coupon.discount, orderValue), code: coupon.code };
}

/** The live coupon, if any — convenience for components. */
export function liveCoupon(festival: FestivalConfig | null | undefined, now: Date = new Date()): CouponConfig | null {
  return isFestivalLive(festival, now) && festival.coupon ? festival.coupon : null;
}
