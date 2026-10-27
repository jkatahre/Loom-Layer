import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';

export function SectionHeading({
  eyebrow,
  title,
  intro,
  link,
  align = 'left',
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  link?: { to: string; label: string };
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:mb-10', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="text-[1.875rem] sm:text-[2.25rem]">
          {title}
        </h2>
        {intro && <p className="mt-3 text-muted">{intro}</p>}
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

/** Horizontal scroller on mobile, grid on desktop. */
export function Rail({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <div
      role="list"
      aria-label={label}
      className={cn(
        'scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function RailItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="listitem" className={cn('w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-auto', className)}>
      {children}
    </div>
  );
}
