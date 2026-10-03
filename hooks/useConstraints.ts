'use client';

import { useState } from 'react';

function attr(name: string): boolean {
  return document.documentElement.dataset[name] === 'true' ||
    document.documentElement.dataset[name] === 'reduced';
}

export function useConstraints() {
  const [state] = useState(() => {
    if (typeof document === 'undefined') {
      return { savedata: false, lowmem: false, reducedMotion: false, ready: false };
    }
    return {
      savedata: attr('savedata'),
      lowmem: attr('lowmem'),
      reducedMotion: document.documentElement.dataset.motion === 'reduced',
      ready: true,
    };
  });

  return state;
}
