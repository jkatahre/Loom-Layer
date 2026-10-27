import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '../../utils/cn';

interface SmartImageProps {
  src: string | null | undefined;
  alt: string;
  /** CSS aspect-ratio, e.g. "4 / 5". Reserves space to prevent layout shift. */
  ratio?: string;
  /** `object-position` focus point, e.g. "50% 30%". */
  position?: string;
  /** Above-the-fold images: eager + high fetch priority. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  style?: CSSProperties;
}

/**
 * Image with a reserved aspect ratio, lazy loading and a graceful fallback
 * (a woven-texture placeholder) if the file is missing or fails to load.
 */
export function SmartImage({ src, alt, ratio, position, priority, className, imgClassName, sizes, style }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showFallback = failed || !src;

  // An image may finish loading (e.g. from cache) before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden bg-sand', className)} style={{ aspectRatio: ratio, ...style }}>
      {showFallback ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgb(118 81 61 / 0.06) 0 2px, transparent 2px 6px), repeating-linear-gradient(0deg, rgb(118 81 61 / 0.05) 0 2px, transparent 2px 6px)',
          }}
        >
          <span className="font-display text-sm text-muted/80 italic">Loom &amp; Layer</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            loaded || priority ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
          style={{ objectPosition: position }}
        />
      )}
    </div>
  );
}
