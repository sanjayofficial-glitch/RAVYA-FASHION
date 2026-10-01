'use client';

import { useEffect, useState } from 'react';

function attr(name: string): boolean {
  return document.documentElement.dataset[name] === 'true' ||
    document.documentElement.dataset[name] === 'reduced';
}

export function useConstraints() {
  const [state, setState] = useState({
    savedata: false,
    lowmem: false,
    reducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    const read = () =>
      setState({
        savedata: attr('savedata'),
        lowmem: attr('lowmem'),
        reducedMotion: document.documentElement.dataset.motion === 'reduced',
        ready: true,
      });
    read();
  }, []);

  return state;
}
