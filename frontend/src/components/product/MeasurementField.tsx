import { useId } from 'react';
import type { MeasurementUnit } from '../../types/product';
import { cn } from '../../utils/cn';
import { formatDual, parseMeasurement, type MeasurementInput } from '../../utils/units';

export function UnitToggle({ value, onChange }: { value: MeasurementUnit; onChange: (u: MeasurementUnit) => void }) {
  const options: [MeasurementUnit, string][] = [
    ['in', 'Inches'],
    ['ft_in', 'Feet + in'],
    ['cm', 'cm'],
  ];
  return (
    <div role="radiogroup" aria-label="Measurement unit" className="inline-flex rounded-full bg-sand p-1">
      {options.map(([u, label]) => (
        <button
          key={u}
          type="button"
          role="radio"
          aria-checked={value === u}
          onClick={() => onChange(u)}
          className={cn('min-h-9 rounded-full px-4 text-xs font-semibold transition-colors', value === u ? 'bg-canvas text-ink shadow-soft' : 'text-muted hover:text-ink')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** A width or drop input in the selected unit, with live conversion shown underneath. */
export function MeasurementField({
  label,
  hint,
  value,
  onChange,
  error,
}: {
  label: string;
  hint?: string;
  value: MeasurementInput;
  onChange: (v: MeasurementInput) => void;
  error?: string | null;
}) {
  const id = useId();
  const mm = parseMeasurement(value);
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`, `${id}-conv`].filter(Boolean).join(' ');

  return (
    <div>
      <label htmlFor={`${id}-a`} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-2 text-xs text-muted">
          {hint}
        </p>
      )}
      {value.unit === 'ft_in' ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              id={`${id}-a`}
              inputMode="decimal"
              type="number"
              min={0}
              step="1"
              className="field pr-10"
              value={value.feet ?? ''}
              onChange={(e) => onChange({ ...value, feet: e.target.value })}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              aria-label={`${label} — feet`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted">ft</span>
          </div>
          <div className="relative">
            <input
              inputMode="decimal"
              type="number"
              min={0}
              max={11.5}
              step="0.5"
              className="field pr-10"
              value={value.inches ?? ''}
              onChange={(e) => onChange({ ...value, inches: e.target.value })}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              aria-label={`${label} — inches`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted">in</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            id={`${id}-a`}
            inputMode="decimal"
            type="number"
            min={0}
            step={value.unit === 'cm' ? '1' : '0.5'}
            className="field pr-12"
            value={value.value ?? ''}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
            aria-invalid={!!error}
            aria-describedby={describedBy}
          />
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted">{value.unit}</span>
        </div>
      )}
      <p id={`${id}-conv`} className="mt-1.5 text-xs text-muted" aria-live="polite">
        {mm ? `= ${formatDual(mm)}` : ' '}
      </p>
      {error && (
        <p id={`${id}-err`} className="text-xs font-medium text-sale">
          {error}
        </p>
      )}
    </div>
  );
}
