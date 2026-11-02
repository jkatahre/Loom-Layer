import { Link } from 'react-router';
import { cn } from '../../utils/cn';
import { SmartImage } from './SmartImage';

/** Square image link with its label laid over the photo. */
export function ImageTile({ to, src, alt, label, position, large, className }: { to: string; src: string; alt: string; label: string; position?: string; large?: boolean; className?: string }) {
  return (
    <Link to={to} className={cn('group relative overflow-hidden rounded-xl', className)}>
      <SmartImage src={src} alt={alt} position={position} ratio="1" className="h-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <h3 className={cn('absolute inset-x-0 bottom-0 p-3 text-canvas sm:p-4', large ? 'text-2xl' : 'text-base sm:text-lg')}>{label}</h3>
    </Link>
  );
}
