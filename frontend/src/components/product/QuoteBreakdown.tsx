import type { QuoteResult } from '../../types/quote';
import { formatINR } from '../../utils/currency';
import { formatLength, formatMetres } from '../../utils/units';
import { Icon } from '../ui/Icon';

export const ESTIMATE_LABEL = 'Estimated price — final confirmation by showroom.';

/** Itemised estimate. Only lines the engine could calculate reliably are shown. */
export function QuoteBreakdown({ result, pairs }: { result: Extract<QuoteResult, { kind: 'estimate' }>; pairs: number }) {
  const c = result.consumption;
  return (
    <div>
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-dark">
        <Icon name="info" size={14} /> {ESTIMATE_LABEL}
      </p>
      <table className="w-full text-sm">
        <caption className="sr-only">Estimate line items</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {result.lines.map((l) => (
            <tr key={l.key} className="border-b border-line align-top last:border-0">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal">
                <span className={l.informational ? 'text-muted' : 'font-medium'}>{l.label}</span>
                <span className="block text-xs text-muted">{l.detail}</span>
              </th>
              <td className={`py-2.5 text-right tabular-nums ${l.amount < 0 ? 'font-semibold text-sale' : l.informational ? 'text-muted' : ''}`}>
                {l.amount < 0 ? `− ${formatINR(-l.amount)}` : formatINR(l.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink">
            <th scope="row" className="pt-3 text-left">
              <span className="font-semibold">Estimated total</span>
              <span className="block text-xs font-normal text-muted">
                {pairs} {pairs === 1 ? 'pair' : 'pairs'} · ≈ {formatINR(result.perPair)} / pair
              </span>
            </th>
            <td className="pt-3 text-right font-display text-2xl tabular-nums">{formatINR(result.total)}</td>
          </tr>
        </tfoot>
      </table>
      <details className="mt-4 rounded-xl bg-surface p-4 text-xs text-muted">
        <summary className="font-semibold text-ink">How the fabric was calculated</summary>
        <ul className="mt-2 space-y-1">
          <li>
            {c.panels} panels, each {formatLength(c.flatWidthPerPanel, 'cm')} of flat fabric width (with fullness and side hems)
          </li>
          <li>
            {c.railroaded
              ? 'Fabric railroaded — the roll width becomes the drop, so no vertical seams'
              : `${c.widthsPerPanel} fabric ${c.widthsPerPanel === 1 ? 'width' : 'widths'} per panel, each cut to ${formatLength(c.cutDrop, 'cm')}`}
          </li>
          <li>Total fabric {formatMetres(c.totalFabric)}{c.totalLining ? ` · lining ${formatMetres(c.totalLining)}` : ''}</li>
          {result.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
          <li>Rate card version {result.ruleVersion}</li>
        </ul>
      </details>
    </div>
  );
}
