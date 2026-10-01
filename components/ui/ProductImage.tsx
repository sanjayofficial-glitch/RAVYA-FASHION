'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  lqip?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * LQIP blur-up image with a branded ivory SVG fallback — never a broken-image icon.
 */
export function ProductImage({
  src,
  alt,
  lqip,
  className = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  priority = false,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-canvas-alt ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg viewBox="0 0 80 100" className="h-2/3 w-2/3 text-line" aria-hidden focusable="false">
          <path
            d="M28 30c0-6.6 5.4-12 12-12s12 5.4 12 12-5.4 12-12 12-12-5.4-12-12Zm24 26H28l-8 22h40l-8-22Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  const hasLqip = Boolean(lqip) && lqip !== 'PLACEHOLDER_LQIP';

  const lqipLayer =
    !loaded && hasLqip ? (
      // eslint-disable-next-line @next/next/no-img-element -- base64 LQIP placeholder; next/image cannot render data URIs
      <img src={lqip} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-[1.02] object-cover blur-lg" />
    ) : null;

  return (
    <div className={`relative overflow-hidden bg-canvas-alt ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`lqip-img object-cover ${loaded ? '' : 'opacity-0'}`}
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        placeholder={hasLqip ? 'blur' : 'empty'}
        blurDataURL={hasLqip ? lqip : undefined}
      />
      {lqipLayer}
    </div>
  );
}
