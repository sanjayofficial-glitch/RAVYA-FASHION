/**
 * WhatsApp Business Cloud API sender (server-only, best-effort).
 * Returns true when a message was accepted, false when unconfigured or
 * rejected — callers must never fail a hold/booking because notify failed.
 *
 * Required env: WHATSAPP_TOKEN (permanent system-user token),
 * WHATSAPP_PHONE_NUMBER_ID (the business phone-number ID from Meta dashboard).
 */

export function notifyConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return false;
  try {
    const res = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body, preview_url: false },
      }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}
