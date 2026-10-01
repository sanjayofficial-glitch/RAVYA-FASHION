'use client';

import { useConstraints } from '@/hooks/useConstraints';
import { generalEnquiry } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { WhatsAppIcon } from '@/components/ui/icons';

export function WhatsAppFab() {
  const { reducedMotion } = useConstraints();

  return (
    <a
      href={generalEnquiry()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      onClick={() => track('whatsapp_click', { surface: 'fab' })}
      className={`fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-pill bg-ink text-white shadow-lift md:bottom-6 ${reducedMotion ? '' : 'fab-pulse'}`}
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
