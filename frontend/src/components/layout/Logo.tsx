import { Link } from 'react-router';
import { store } from '../../config/store';
import { cn } from '../../utils/cn';

const Name = ({ inverted }: { inverted?: boolean }) => {
  const [first, ...rest] = store.identity.name.split(' & ');
  return rest.length ? (
    <>
      {first} <span className={cn('italic', inverted ? 'text-festive-gold' : 'text-brand')}>&amp;</span> {rest.join(' & ')}
    </>
  ) : (
    <>{store.identity.name}</>
  );
};

/**
 * Image logo when configured, otherwise a text logo.
 * - `inline` (default): drape mark + name, used in the footer and menus.
 * - `wordmark`: centred name with the tagline beneath, used in the header.
 */
export function Logo({
  className,
  inverted,
  variant = 'inline',
  compact,
}: {
  className?: string;
  inverted?: boolean;
  variant?: 'inline' | 'wordmark';
  /** Wordmark only: hide the tagline and shrink (header on scroll). */
  compact?: boolean;
}) {
  const { name, logo, tagline } = store.identity;

  if (logo) {
    return (
      <Link to="/" className={cn('inline-flex items-center', className)} aria-label={`${name} — home`}>
        <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={variant === 'wordmark' && !compact ? 'h-11 w-auto' : 'h-9 w-auto'} />
      </Link>
    );
  }

  if (variant === 'wordmark') {
    return (
      <Link to="/" className={cn('group inline-flex flex-col items-center text-center', className)} aria-label={`${name} — home`}>
        <span
          className={cn(
            'font-display leading-none tracking-[-0.02em] transition-all duration-300',
            compact ? 'text-[1.375rem]' : 'text-[1.5rem] lg:text-[1.875rem]',
            inverted ? 'text-canvas' : 'text-ink',
          )}
        >
          <Name inverted={inverted} />
        </span>
        <span
          className={cn(
            'overflow-hidden text-[9px] font-semibold tracking-[0.32em] text-muted uppercase transition-all duration-300 max-lg:hidden',
            compact ? 'mt-0 max-h-0 opacity-0' : 'mt-1.5 max-h-4 opacity-100',
          )}
        >
          {tagline.split(' · ')[0]}
        </span>
      </Link>
    );
  }

  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5', className)} aria-label={`${name} — home`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" className={inverted ? 'text-canvas' : 'text-brand'}>
        <path d="M5 6h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 6v21M13 6c0 7 2.5 14 0 21M19 6c0 7-2.5 14 0 21M24 6v21" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span className={cn('font-display text-[1.375rem] leading-none tracking-tight', inverted ? 'text-canvas' : 'text-ink')}>
        <Name inverted={inverted} />
      </span>
    </Link>
  );
}
