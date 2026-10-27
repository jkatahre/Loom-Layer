import type { HeadingStyle, LiningOption, MeasurementUnit, Millimetres, Paise } from './product';

export type QuoteStatus = 'draft' | 'estimated' | 'needs_confirmation' | 'sent';

/** What the customer configures. Dimensions are already canonical (mm). */
export interface QuoteInput {
  productId: string;
  variantId: string;
  /** Total finished width the pair must cover when closed (both panels together). */
  finishedWidth: Millimetres;
  finishedDrop: Millimetres;
  /** Unit the customer entered — kept only so messages echo it back. */
  displayUnit: MeasurementUnit;
  pairs: number;
  fullnessRatio: number;
  heading: HeadingStyle;
  lining: LiningOption;
  installation: boolean;
  measurementService: boolean;
  couponCode?: string;
}

export interface QuoteLine {
  key:
    | 'fabric'
    | 'stitching'
    | 'heading'
    | 'lining'
    | 'measurement'
    | 'installation'
    | 'discount'
    | 'gst';
  label: string;
  detail: string;
  amount: Paise;
  /** Line is informational (e.g. GST already included) and not added to the total. */
  informational?: boolean;
}

export interface FabricConsumption {
  panels: number;
  /** Fabric widths (drops) cut per panel. */
  widthsPerPanel: number;
  /** Cut length of each drop including hems, heading and pattern repeat. */
  cutDrop: Millimetres;
  /** Whether the fabric was railroaded (roll width used as the drop). */
  railroaded: boolean;
  /** Total fabric for all pairs, rounded up to 10 cm. */
  totalFabric: Millimetres;
  /** Total lining for all pairs (0 when unlined). */
  totalLining: Millimetres;
  /** Flat (ungathered) width per panel including side hems. */
  flatWidthPerPanel: Millimetres;
}

export type QuoteResult =
  | {
      kind: 'estimate';
      consumption: FabricConsumption;
      lines: QuoteLine[];
      subtotal: Paise;
      discount: Paise;
      gst: Paise;
      total: Paise;
      perPair: Paise;
      ruleVersion: string;
      notes: string[];
    }
  | {
      kind: 'needs_confirmation';
      reasons: string[];
      ruleVersion: string;
    }
  | {
      kind: 'invalid';
      errors: Partial<Record<QuoteField, string>>;
    };

export type QuoteField = 'finishedWidth' | 'finishedDrop' | 'pairs' | 'fullnessRatio' | 'variantId' | 'heading' | 'lining';

/** Persisted shape, matching the future `custom_quotes` table. */
export interface CustomQuote {
  id: string;
  product_id: string;
  variant_id: string;
  finished_width: Millimetres;
  finished_drop: Millimetres;
  dimension_unit: 'mm';
  selling_unit: 'pair';
  panels_per_pair: number;
  pairs: number;
  fullness_ratio: number;
  lining_option: LiningOption;
  heading_option: HeadingStyle;
  installation_required: boolean;
  measurement_service_required: boolean;
  fabric_consumption: Millimetres | null;
  stitching_charge: Paise | null;
  lining_charge: Paise | null;
  heading_charge: Paise | null;
  installation_charge: Paise | null;
  estimated_total: Paise | null;
  currency: 'INR';
  pricing_rule_version: string;
  status: QuoteStatus;
  created_at: string;
}
