import type { Metadata, Viewport } from 'next';
import { Syne } from 'next/font/google';
import { site } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import MoreSheet from '@/components/layout/MoreSheet';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { ServiceWorker } from '@/components/layout/ServiceWorker';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateStoreJsonLd, generateWebSiteJsonLd } from '@/lib/seo';
import { STORE_OPEN_WARN } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Clothing Store in Rourkela`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: site.url,
    title: `${site.name} — Clothing Store in Rourkela`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Clothing Store in Rourkela`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

const CONSTRAINT_SCRIPT = `var c=navigator.connection||{};var d=document.documentElement;d.dataset.js='true';
if(c.saveData||/2g/.test(c.effectiveType||''))d.dataset.savedata='true';
if((navigator.deviceMemory||8)<4)d.dataset.lowmem='true';
if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.motion='reduced';`;

// Syne is the brand voice, so it stays for display only — with a reason to
// override the platform. Body copy runs on the system stack, which is both
// Apple's default and the reason five fewer font files stop competing with the
// hero for preload on a 2G first load.
//
// Weight 800 only. Every font-display consumer (Header, Footer, BrandStrip,
// StoreSnapshot, CategoryTiles, brands, about) and both .display-* rules are
// font-extrabold / 800 — nothing on the site renders Syne at 700, so shipping
// that weight only cost a file and a preload competing with the hero.
const syne = Syne({ subsets: ['latin'], weight: ['800'], variable: '--font-syne', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={syne.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONSTRAINT_SCRIPT }} />
        {process.env.NODE_ENV !== 'production' && STORE_OPEN_WARN ? (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "console.warn('[ravya] PHONE + WHATSAPP still placeholder — set PLACEHOLDER_PHONE and PLACEHOLDER_WHATSAPP in config/site.ts. See docs/UPDATE-STORE-INFO.md.');",
            }}
          />
        ) : null}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="min-h-[50vh] pb-24 md:pb-0" style={{ paddingTop: 84 }}>
          {children}
        </main>
        <Footer />
        <BottomNav />
        <MoreSheet />
        <WhatsAppFab />
        <ServiceWorker />
        <JsonLd data={generateStoreJsonLd()} />
        <JsonLd data={generateWebSiteJsonLd()} />
      </body>
    </html>
  );
}
