import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';

export function SectionHeading({
  title,
  intro,
  link,
  align = 'left',
  className,
  id,
}: {
  title: ReactNode;
  intro?: ReactNode;
  link?: { to: string; label: string };
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn('mb-4 flex gap-3', align === 'center' ? 'flex-col items-center text-center' : 'items-center justify-between', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <h2 id={id} className="text-[1.375rem] sm:text-2xl">
          {title}
        </h2>
        {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
      </div>
      {link && (
        <Link to={link.to} className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-ink hover:text-brand">
          {link.label}
          <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** Product grid: nothing is hidden behind a sideways scroll. */
export function Rail({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <div
      role="list"
      aria-label={label}
      className={cn(
        'grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 md:grid-cols-4 lg:gap-x-4 lg:gap-y-9',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function RailItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="listitem" className={className}>
      {children}
    </div>
  );
}
