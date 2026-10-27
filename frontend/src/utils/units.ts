import type { MeasurementUnit, Millimetres } from '../types/product';

/**
 * Unit conversion. Every dimension is stored as integer millimetres; these
 * helpers convert at the UI boundary only.
 */

export const MM_PER_INCH = 25.4;
export const MM_PER_CM = 10;
export const INCHES_PER_FOOT = 12;

export const UNIT_LABELS: Record<MeasurementUnit, string> = {
  cm: 'Centimetres',
  in: 'Inches',
  ft_in: 'Feet & inches',
};

const trim = (n: number, decimals = 1) => String(Number(n.toFixed(decimals)));

export function cmToMm(cm: number): Millimetres {
  return Math.round(cm * MM_PER_CM);
}

export function inchesToMm(inches: number): Millimetres {
  return Math.round(inches * MM_PER_INCH);
}

export function feetInchesToMm(feet: number, inches = 0): Millimetres {
  return Math.round((feet * INCHES_PER_FOOT + inches) * MM_PER_INCH);
}

export function mmToCm(mm: Millimetres): number {
  return mm / MM_PER_CM;
}

export function mmToInches(mm: Millimetres): number {
  return mm / MM_PER_INCH;
}

/** Split into whole feet and inches, inches rounded to the nearest ½". */
export function mmToFeetInches(mm: Millimetres): { feet: number; inches: number } {
  const totalHalfInches = Math.round((mm / MM_PER_INCH) * 2);
  const feet = Math.floor(totalHalfInches / (INCHES_PER_FOOT * 2));
  const inches = (totalHalfInches - feet * INCHES_PER_FOOT * 2) / 2;
  return { feet, inches };
}

/** A raw measurement as typed into a form. */
export interface MeasurementInput {
  unit: MeasurementUnit;
  /** Used for `cm` and `in`. */
  value?: string | number;
  /** Used for `ft_in`. */
  feet?: string | number;
  inches?: string | number;
}

const toNumber = (v: string | number | undefined): number | null => {
  if (v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : Number(String(v).trim().replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

/**
 * Parse form input into millimetres. Returns `null` for empty, negative or
 * non-numeric input so callers can show a validation message.
 */
export function parseMeasurement(input: MeasurementInput): Millimetres | null {
  if (input.unit === 'ft_in') {
    const feet = toNumber(input.feet);
    const inches = toNumber(input.inches);
    if (feet === null || inches === null || feet < 0 || inches < 0 || inches >= 12) return null;
    const mm = feetInchesToMm(feet, inches);
    return mm > 0 ? mm : null;
  }
  if (input.value === undefined || input.value === '') return null;
  const n = toNumber(input.value);
  if (n === null || n <= 0) return null;
  return input.unit === 'cm' ? cmToMm(n) : inchesToMm(n);
}

/** Convert millimetres back into form values for a given unit. */
export function toMeasurementInput(mm: Millimetres, unit: MeasurementUnit): MeasurementInput {
  if (unit === 'ft_in') {
    const { feet, inches } = mmToFeetInches(mm);
    return { unit, feet: String(feet), inches: String(inches) };
  }
  return { unit, value: unit === 'cm' ? trim(mmToCm(mm)) : trim(mmToInches(mm)) };
}

/** `137 cm`, `54 in`, `4 ft 6 in`. */
export function formatLength(mm: Millimetres, unit: MeasurementUnit): string {
  if (unit === 'cm') return `${trim(mmToCm(mm))} cm`;
  if (unit === 'in') return `${trim(mmToInches(mm))} in`;
  const { feet, inches } = mmToFeetInches(mm);
  if (feet === 0) return `${inches} in`;
  return inches === 0 ? `${feet} ft` : `${feet} ft ${inches} in`;
}

/** `54 in (137 cm)` — inches first, as most Indian customers measure in inches. */
export function formatDual(mm: Millimetres): string {
  return `${trim(mmToInches(mm), 0)} in (${trim(mmToCm(mm), 0)} cm)`;
}

/** `137 × 213 cm` etc. */
export function formatSize(widthMm: Millimetres, dropMm: Millimetres, unit: MeasurementUnit): string {
  if (unit === 'ft_in') return `${formatLength(widthMm, unit)} × ${formatLength(dropMm, unit)}`;
  const w = unit === 'cm' ? mmToCm(widthMm) : mmToInches(widthMm);
  const d = unit === 'cm' ? mmToCm(dropMm) : mmToInches(dropMm);
  return `${trim(w)} × ${trim(d)} ${unit}`;
}

/** Compact feet label used on cards, rounded to ½ ft: `4.5 × 7 ft`. */
export function formatFeetCompact(widthMm: Millimetres, dropMm: Millimetres): string {
  const ft = (mm: number) => Math.round((mm / (MM_PER_INCH * INCHES_PER_FOOT)) * 2) / 2;
  return `${ft(widthMm)} × ${ft(dropMm)} ft`;
}

/** `12.4 m` for fabric quantities. */
export function formatMetres(mm: Millimetres): string {
  return `${trim(mm / 1000, 2)} m`;
}
