import { store } from '../config/store';
import { cn } from '../utils/cn';
import { Icon } from './ui/Icon';

export const mapsLink = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.showroom.mapsQuery)}`;

/**
 * Embedded Google Map when `store.showroom.mapsEmbedUrl` is set; otherwise a
 * lightweight placeholder that links to Google Maps (no third-party embed).
 */
export function ShowroomMap({ compact, className }: { compact?: boolean; className?: string }) {
  const { mapsEmbedUrl, name } = store.showroom;
  if (mapsEmbedUrl) {
    return (
      <iframe
        title={`Map showing ${name}`}
        src={mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn('w-full rounded-xl border-0', compact ? 'aspect-[16/7]' : 'aspect-[4/3]', className)}
      />
    );
  }
  return (
    <a
      href={mapsLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex items-center justify-center overflow-hidden rounded-xl border border-line bg-[#EEE8DF]',
        compact ? 'aspect-[16/7]' : 'aspect-[4/3]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #fff 2px, transparent 2px), linear-gradient(0deg, #fff 2px, transparent 2px), linear-gradient(35deg, transparent 48%, #E2D6C4 48% 52%, transparent 52%)',
          backgroundSize: '56px 56px, 56px 56px, 100% 100%',
        }}
      />
      <span className="relative flex flex-col items-center gap-1 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-brand text-canvas shadow-lift transition-transform group-hover:-translate-y-0.5">
          <Icon name="pin" size={20} />
        </span>
        <span className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold shadow-soft">Open in Google Maps</span>
      </span>
    </a>
  );
}
