import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from './Icon';

export function EmptyState({
  title,
  body,
  icon = 'search',
  action,
  className,
}: {
  title: string;
  body?: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center', className)}>
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="text-xl">{title}</h3>
      {body && <p className="mt-2 max-w-md text-sm text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, className }: { error: Error | null; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center rounded-2xl border border-line bg-surface px-6 py-12 text-center', className)}>
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-[#FBEAE8] text-sale">
        <Icon name="info" size={22} />
      </span>
      <h3 className="text-xl">Something went wrong</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{error?.message ?? 'We could not load this section.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-outline mt-6">
          Try again
        </button>
      )}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[4/5] w-full rounded-2xl" />
      <div className="skeleton mt-4 h-3 w-1/3" />
      <div className="skeleton mt-2 h-4 w-3/4" />
      <div className="skeleton mt-3 h-4 w-1/2" />
    </div>
  );
}

export function GridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4', className)} role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
