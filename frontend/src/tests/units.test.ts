import { describe, expect, it } from 'vitest';
import {
  cmToMm,
  feetInchesToMm,
  formatDual,
  formatFeetCompact,
  formatLength,
  formatSize,
  inchesToMm,
  mmToFeetInches,
  parseMeasurement,
  toMeasurementInput,
} from '../utils/units';

describe('unit conversion', () => {
  it('converts to canonical millimetres', () => {
    expect(cmToMm(137)).toBe(1370);
    expect(cmToMm(137.5)).toBe(1375);
    expect(inchesToMm(54)).toBe(1372);
    expect(inchesToMm(84)).toBe(2134);
    expect(feetInchesToMm(7, 0)).toBe(2134);
    expect(feetInchesToMm(4, 6)).toBe(1372);
  });

  it('splits millimetres into feet and inches rounded to ½"', () => {
    expect(mmToFeetInches(2134)).toEqual({ feet: 7, inches: 0 });
    expect(mmToFeetInches(1372)).toEqual({ feet: 4, inches: 6 });
    expect(mmToFeetInches(1380)).toEqual({ feet: 4, inches: 6.5 });
  });

  it('parses form input in every unit', () => {
    expect(parseMeasurement({ unit: 'cm', value: '150' })).toBe(1500);
    expect(parseMeasurement({ unit: 'in', value: '60' })).toBe(1524);
    expect(parseMeasurement({ unit: 'in', value: '60,5' })).toBe(1537);
    expect(parseMeasurement({ unit: 'ft_in', feet: '7', inches: '' })).toBe(2134);
    expect(parseMeasurement({ unit: 'ft_in', feet: '5', inches: '6' })).toBe(1676);
  });

  it('rejects empty, negative and invalid input', () => {
    expect(parseMeasurement({ unit: 'cm', value: '' })).toBeNull();
    expect(parseMeasurement({ unit: 'cm', value: '-10' })).toBeNull();
    expect(parseMeasurement({ unit: 'in', value: 'abc' })).toBeNull();
    expect(parseMeasurement({ unit: 'ft_in', feet: '5', inches: '12' })).toBeNull();
    expect(parseMeasurement({ unit: 'ft_in', feet: '', inches: '' })).toBeNull();
  });

  it('round-trips through a different display unit', () => {
    const mm = parseMeasurement({ unit: 'in', value: '84' })!;
    const asCm = toMeasurementInput(mm, 'cm');
    expect(asCm).toEqual({ unit: 'cm', value: '213.4' });
    expect(parseMeasurement(asCm)).toBe(mm);
  });

  it('formats lengths and sizes', () => {
    expect(formatLength(1372, 'in')).toBe('54 in');
    expect(formatLength(1370, 'cm')).toBe('137 cm');
    expect(formatLength(1372, 'ft_in')).toBe('4 ft 6 in');
    expect(formatDual(1372)).toBe('54 in (137 cm)');
    expect(formatSize(1372, 2134, 'in')).toBe('54 × 84 in');
    expect(formatFeetCompact(1372, 2134)).toBe('4.5 × 7 ft');
  });
});
