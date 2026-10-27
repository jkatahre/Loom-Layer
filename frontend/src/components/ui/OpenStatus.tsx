import { store } from '../../config/store';
import { useNow } from '../../hooks/useNow';
import { cn } from '../../utils/cn';
import { formatTime, getOpenStatus, WEEKDAY_LABELS, WEEKDAYS } from '../../utils/hours';

/** "Open now · closes 8:30 pm" badge, live-updated every minute in the showroom's timezone. */
export function OpenStatus({ className }: { className?: string }) {
  const now = useNow(60_000);
  const status = getOpenStatus(store.showroom.hours, store.showroom.timezone, now);
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', className)}>
      <span className={cn('size-2 rounded-full', status.isOpen ? 'bg-whatsapp' : 'bg-sale')} aria-hidden="true" />
      {status.label}
    </span>
  );
}

export function HoursTable({ className, compact }: { className?: string; compact?: boolean }) {
  const now = useNow(60_000);
  const { today } = getOpenStatus(store.showroom.hours, store.showroom.timezone, now);
  return (
    <table className={cn('w-full text-sm', className)}>
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {WEEKDAYS.map((d) => {
          const h = store.showroom.hours[d];
          return (
            <tr key={d} className={cn(d === today && 'font-semibold text-ink')} aria-current={d === today ? 'date' : undefined}>
              <th scope="row" className={cn('py-1 pr-4 text-left font-normal', d === today ? 'font-semibold' : 'text-muted')}>
                {compact ? WEEKDAY_LABELS[d].slice(0, 3) : WEEKDAY_LABELS[d]}
              </th>
              <td className="py-1 text-right tabular-nums">{h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
