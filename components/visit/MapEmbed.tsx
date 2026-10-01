'use client';

import { useState } from 'react';
import { mapEmbedUrl } from '@/lib/directions';
import { useConstraints } from '@/hooks/useConstraints';

/** Static placeholder first; interactive map only on tap and never on save-data. */
export function MapEmbed() {
  const [active, setActive] = useState(false);
  const { savedata } = useConstraints();

  if (active && !savedata) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line">
        <iframe
          src={mapEmbedUrl()}
          title="Map to Ravya Fashion"
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      disabled={savedata}
      className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-card border border-line bg-canvas-alt"
      aria-label={savedata ? 'Map hidden in data-saver mode' : 'Tap to load the interactive map'}
    >
      <div aria-hidden className="absolute inset-0 opacity-40">
        <svg viewBox="0 0 400 300" className="h-full w-full text-line">
          <path d="M0 80 Q120 60 200 90 T400 70 V0 H0 Z" fill="currentColor" />
          <path d="M0 200 Q140 180 240 210 T400 190 V300 H0 Z" fill="currentColor" />
          <path d="M60 0 L120 300" stroke="currentColor" strokeWidth="6" />
          <path d="M0 150 L400 130" stroke="currentColor" strokeWidth="6" />
        </svg>
      </div>
      <div aria-hidden className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute h-12 w-12 rounded-full border-2 border-accent/50" />
        <span className="h-3.5 w-3.5 rounded-full bg-accent" />
      </div>
      <span className="absolute bottom-4 rounded-pill bg-canvas px-4 py-2 text-[13px] font-medium text-ink shadow-lift">
        {savedata ? 'Map hidden in data-saver mode' : 'Tap to load map'}
      </span>
    </button>
  );
}
