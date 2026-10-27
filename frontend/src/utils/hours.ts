import type { Weekday } from '../types/store';

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

type Hours = Record<Weekday, { open: string; close: string } | null>;

const toMinutes = (hhmm: string) => {
  const [h = '0', m = '0'] = hhmm.split(':');
  return Number(h) * 60 + Number(m);
};

/** `10:30` → `10:30 am`. */
export function formatTime(hhmm: string): string {
  const mins = toMinutes(hhmm);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${suffix}`;
}

/** Weekday and minutes-since-midnight in the showroom's timezone. */
export function localClock(now: Date, timeZone: string): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = get('weekday').slice(0, 3).toLowerCase() as Weekday;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export interface OpenStatus {
  isOpen: boolean;
  today: Weekday;
  /** Human summary, e.g. "Open now · closes 8:30 pm" or "Closed · opens Mon 10:30 am". */
  label: string;
}

export function getOpenStatus(hours: Hours, timeZone: string, now: Date = new Date()): OpenStatus {
  const { day, minutes } = localClock(now, timeZone);
  const today = hours[day];
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { isOpen: true, today: day, label: `Open now · closes ${formatTime(today.close)}` };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { isOpen: false, today: day, label: `Closed · opens ${formatTime(today.open)} today` };
  }
  const idx = WEEKDAYS.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const next = WEEKDAYS[(idx + i) % 7]!;
    const h = hours[next];
    if (h) {
      const when = i === 1 ? 'tomorrow' : WEEKDAY_LABELS[next].slice(0, 3);
      return { isOpen: false, today: day, label: `Closed · opens ${when} ${formatTime(h.open)}` };
    }
  }
  return { isOpen: false, today: day, label: 'Closed' };
}
