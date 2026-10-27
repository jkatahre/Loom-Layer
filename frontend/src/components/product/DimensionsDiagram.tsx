import type { Millimetres } from '../../types/product';
import { formatDual } from '../../utils/units';

/**
 * Labelled diagram of a curtain pair: rod, finished width and finished drop,
 * shown in inches and centimetres. `panelWidth` adds per-panel labels for
 * standard sizes (where width is quoted per panel).
 */
export function DimensionsDiagram({
  width,
  drop,
  panelWidth,
  rodWidth,
  className,
}: {
  /** Total finished width covered by the pair. */
  width: Millimetres | null;
  drop: Millimetres | null;
  panelWidth?: Millimetres;
  rodWidth?: Millimetres;
  className?: string;
}) {
  const wLabel = width ? formatDual(width) : 'Finished width';
  const dLabel = drop ? formatDual(drop) : 'Finished drop';
  return (
    <figure className={className}>
      <svg viewBox="0 0 360 300" className="w-full" role="img" aria-label={`Diagram: finished width ${wLabel}, finished drop ${dLabel}`}>
        <defs>
          <marker id="dd-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="var(--color-brand)" />
          </marker>
          <pattern id="dd-folds" width="14" height="10" patternUnits="userSpaceOnUse">
            <rect width="14" height="10" fill="var(--color-brand-soft)" />
            <rect width="3" height="10" x="10" fill="color-mix(in oklab, var(--color-brand) 18%, transparent)" />
          </pattern>
        </defs>
        {/* window */}
        <rect x="120" y="58" width="120" height="150" rx="2" fill="#EAF1F4" stroke="#C9D3D8" />
        <line x1="180" y1="58" x2="180" y2="208" stroke="#C9D3D8" />
        {/* rod */}
        <line x1="62" y1="44" x2="298" y2="44" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
        {rodWidth && (
          <text x="180" y="36" textAnchor="middle" fontSize="10" fill="var(--color-muted)">
            Rod ≈ {formatDual(rodWidth)}
          </text>
        )}
        {/* panels */}
        <rect x="70" y="48" width="84" height="196" fill="url(#dd-folds)" stroke="var(--color-brand)" strokeOpacity=".35" />
        <rect x="206" y="48" width="84" height="196" fill="url(#dd-folds)" stroke="var(--color-brand)" strokeOpacity=".35" />
        {panelWidth && (
          <>
            <text x="112" y="150" textAnchor="middle" fontSize="9.5" fill="var(--color-brand-dark)">Panel</text>
            <text x="112" y="162" textAnchor="middle" fontSize="9.5" fill="var(--color-brand-dark)">{formatDual(panelWidth)}</text>
            <text x="248" y="150" textAnchor="middle" fontSize="9.5" fill="var(--color-brand-dark)">Panel</text>
            <text x="248" y="162" textAnchor="middle" fontSize="9.5" fill="var(--color-brand-dark)">{formatDual(panelWidth)}</text>
          </>
        )}
        {/* floor */}
        <line x1="20" y1="252" x2="340" y2="252" stroke="var(--color-line)" strokeWidth="2" />
        {/* width arrow */}
        <line x1="70" y1="272" x2="290" y2="272" stroke="var(--color-brand)" strokeWidth="1.5" markerStart="url(#dd-arrow)" markerEnd="url(#dd-arrow)" />
        <text x="180" y="292" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink)">
          {panelWidth ? `Pair: ${wLabel}` : wLabel}
        </text>
        {/* drop arrow */}
        <line x1="40" y1="48" x2="40" y2="244" stroke="var(--color-brand)" strokeWidth="1.5" markerStart="url(#dd-arrow)" markerEnd="url(#dd-arrow)" />
        <text x="30" y="146" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink)" transform="rotate(-90 30 146)">
          {drop ? `Drop ${dLabel}` : dLabel}
        </text>
      </svg>
      <figcaption className="sr-only">
        The finished width is measured across both panels laid flat side by side; the drop is measured from the top of the heading to the hem.
      </figcaption>
    </figure>
  );
}

/** Definitions shown next to measurement inputs. */
export function MeasurementGuide({ className }: { className?: string }) {
  const items: [string, string][] = [
    ['Window width', 'The glass and frame only. Curtains should be wider than this so they can stack back clear of the glass.'],
    ['Curtain-rod width', 'The length of the rod or track between the finials. Usually window width + 15–30 cm on each side.'],
    ['Finished width', 'The width the closed pair should cover — normally the rod width plus a little overlap at the centre. We add fullness on top of this.'],
    ['Finished drop', 'From the top of the heading (eyelet rings, hooks or pocket) to the hem. Floor length: stop 1 cm above the floor.'],
  ];
  return (
    <dl className={className}>
      {items.map(([t, d]) => (
        <div key={t} className="border-b border-line py-3 last:border-0">
          <dt className="text-sm font-semibold">{t}</dt>
          <dd className="mt-0.5 text-sm text-muted">{d}</dd>
        </div>
      ))}
    </dl>
  );
}
