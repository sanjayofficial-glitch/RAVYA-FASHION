'use client';

import { directionsUrl, geoFallback } from '@/lib/directions';
import { track } from '@/lib/track';
import { DirectionsIcon } from '@/components/ui/icons';

export function DirectionsButton() {
  return (
    <a
      href={directionsUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        track('directions_tap', { surface: 'visit' });
        const w = window.open(directionsUrl(), '_blank', 'noopener');
        if (w) e.preventDefault();
        // If the popup was blocked, the default geo: navigation attempt is skipped;
        // the universal link in href still works on all platforms.
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        window.location.href = geoFallback();
      }}
      className="btn btn-primary w-full"
    >
      <DirectionsIcon size={18} />
      Get Directions
    </a>
  );
}
