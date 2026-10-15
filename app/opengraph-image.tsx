import { ImageResponse } from 'next/og';

export const alt = 'RAVYA FASHION — Curated style for Rourkela';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#8C6D33', fontWeight: 600 }}>
          ROURKELA · ODISHA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 900, lineHeight: 0.95, color: '#111111', letterSpacing: -2 }}>
            RAVYA
          </div>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 900, lineHeight: 0.95, color: '#C5A059', letterSpacing: -2 }}>
            FASHION
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#6B6B6B' }}>
          Curated in-store fashion · Ramraj · Killer · Sparky · Ignite · Jockey · Unibro
        </div>
      </div>
    ),
    size,
  );
}
