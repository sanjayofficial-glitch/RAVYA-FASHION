'use client';

import { site } from '@/config/site';
import { generalEnquiry } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';

export function VisitActions() {
  return (
    <div className="grid gap-3">
      <a
        href={`tel:${site.PLACEHOLDER_PHONE}`}
        onClick={() => track('call_tap')}
        className="btn btn-secondary w-full"
      >
        <PhoneIcon size={18} />
        Call the store
      </a>
      <a
        href={generalEnquiry()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp_click', { surface: 'visit' })}
        className="btn btn-secondary w-full"
      >
        <WhatsAppIcon size={18} />
        WhatsApp us
      </a>
    </div>
  );
}
