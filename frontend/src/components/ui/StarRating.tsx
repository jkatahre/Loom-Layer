import { cn } from '../../utils/cn';
import { Icon } from './Icon';

export function StarRating({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-star', className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} filled={value >= i - 0.25} className={value >= i - 0.25 ? '' : 'text-line'} />
      ))}
    </span>
  );
}
