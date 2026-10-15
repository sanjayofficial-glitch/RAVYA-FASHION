'use client';

import { useEffect } from 'react';

/** Registers the offline shell in production. Skipped entirely on save-data. */
export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Dev sessions must never run the offline shell: the dev server keeps
    // stable chunk URLs across edits, so cache-first would serve stale
    // modules and break hydration. Undo any registration a previous session
    // left behind, and drop the poisoned caches.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
        .catch(() => {});
      if ('caches' in window) {
        caches
          .keys()
          .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
          .catch(() => {});
      }
      return;
    }

    if (document.documentElement.dataset.savedata === 'true') return;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);
  return null;
}
