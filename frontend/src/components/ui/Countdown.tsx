import { useState } from 'react';
import { cn } from '../../utils/cn';
import { timeRemaining } from '../../utils/promotions';
import { Icon } from './Icon';

/** Days / hours / minutes / seconds until `endsAt`. Render only while the promotion is live. */
export function Countdown({ endsAt, now, className }: { endsAt: string; now: Date; className?: string }) {
  const t = timeRemaining(endsAt, now);
  const parts: [number, string][] = [
    [t.days, 'days'],
    [t.hours, 'hrs'],
    [t.minutes, 'min'],
    [t.seconds, 'sec'],
  ];
  const label = `${t.days} days ${t.hours} hours ${t.minutes} minutes left`;
  return (
    <div className={cn('flex items-center gap-1.5', className)} role="timer" aria-label={label}>
      {parts.map(([value, unit]) => (
        <span key={unit} className="flex min-w-12 flex-col items-center rounded-lg bg-black/25 px-2 py-1.5" aria-hidden="true">
          <span className="font-display text-lg leading-none tabular-nums">{String(value).padStart(2, '0')}</span>
          <span className="mt-1 text-[10px] tracking-wider uppercase opacity-70">{unit}</span>
        </span>
      ))}
    </div>
  );
}

/** Copies text to the clipboard with visible + announced feedback. */
export function CopyButton({ text, label = 'Copy code', className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={cn('btn btn-sm', className)} aria-live="polite">
      <Icon name={copied ? 'check' : 'copy'} size={15} />
      {copied ? 'Copied!' : label}
    </button>
  );
}
