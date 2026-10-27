import type { PriceView } from '../../utils/priceDisplay';
import { cn } from '../../utils/cn';

/** Consistent price rendering: prefix, amount, selling unit, MRP and valid discount. */
export function PriceTag({ view, size = 'md', showEmi = false, className }: { view: PriceView; size?: 'sm' | 'md' | 'lg'; showEmi?: boolean; className?: string }) {
  if (view.amount === null) {
    return <p className={cn('font-semibold text-ink', size === 'lg' ? 'text-2xl font-display' : 'text-sm', className)}>Price on request</p>;
  }
  return (
    <div className={className}>
      {view.prefix && <p className={cn('text-muted', size === 'lg' ? 'text-sm' : 'text-xs')}>{view.prefix}</p>}
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={cn('font-semibold tabular-nums text-ink', size === 'lg' ? 'font-display text-3xl font-medium' : size === 'md' ? 'text-base' : 'text-sm')}>
          {view.amount}
        </span>
        <span className={cn('text-muted', size === 'lg' ? 'text-sm' : 'text-xs')}>{view.unit}</span>
        {view.mrp && (
          <>
            <s className={cn('tabular-nums text-muted/80', size === 'lg' ? 'text-base' : 'text-xs')} aria-label={`MRP ${view.mrp}`}>
              {view.mrp}
            </s>
            <span className={cn('font-semibold text-sale', size === 'lg' ? 'text-sm' : 'text-xs')}>{view.discountPct}% off</span>
          </>
        )}
      </p>
      {showEmi && view.emi && <p className="mt-1 text-xs text-muted">{view.emi}</p>}
    </div>
  );
}
