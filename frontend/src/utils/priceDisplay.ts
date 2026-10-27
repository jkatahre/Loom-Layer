import { store } from '../config/store';
import type { Paise, PriceMode, SellingUnit } from '../types/product';
import { emiPerMonth, formatINR, validDiscountPct } from './currency';
import { SELLING_UNIT_SUFFIX } from './labels';

/**
 * Turns a price + mode into display parts so every surface (cards, product
 * page, enquiry messages) shows the same wording and selling unit.
 */
export interface PriceView {
  mode: PriceMode;
  /** Main figure, e.g. "₹4,299" — null when the price is on request. */
  amount: string | null;
  /** e.g. "Starting from" */
  prefix: string | null;
  /** e.g. "/ pair" */
  unit: string;
  mrp: string | null;
  discountPct: number | null;
  /** Plain-text version for messages: "₹4,299 / pair". */
  text: string;
  emi: string | null;
}

export function priceView(
  mode: PriceMode,
  sale: Paise | null,
  mrp: Paise | null,
  unit: SellingUnit,
  opts: { forceStartingFrom?: boolean } = {},
): PriceView {
  const unitText = SELLING_UNIT_SUFFIX[unit];
  if (mode === 'on_request' || sale == null || sale <= 0) {
    return { mode: 'on_request', amount: null, prefix: null, unit: unitText, mrp: null, discountPct: null, text: 'Price on request', emi: null };
  }
  const discountPct = validDiscountPct(mrp, sale);
  const prefix = mode === 'starting_from' || opts.forceStartingFrom ? 'Starting from' : null;
  const amount = formatINR(sale);
  const emiCfg = store.pricing.emi;
  const emi =
    emiCfg?.enabled && sale >= emiCfg.minPrice ? `EMI from ${formatINR(emiPerMonth(sale, emiCfg.months))}/month × ${emiCfg.months}` : null;
  return {
    mode,
    amount,
    prefix,
    unit: unitText,
    mrp: discountPct ? formatINR(mrp!) : null,
    discountPct,
    text: `${prefix ? `${prefix} ` : ''}${amount} ${unitText}`,
    emi,
  };
}
