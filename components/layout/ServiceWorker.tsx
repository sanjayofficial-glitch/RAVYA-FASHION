'use client';

import { useEffect } from 'react';

/** Registers the offline shell. Skipped entirely on save-data. */
export function ServiceWorker() {
  useEffect(() => {
    if (document.documentElement.dataset.savedata === 'true') return;
    if (!('serviceWorker' in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);
  return null;
}
