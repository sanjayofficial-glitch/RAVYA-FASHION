import { Hero } from '@/components/home/Hero';
import { Ticker } from '@/components/home/Ticker';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { NewInStoreCarousel } from '@/components/home/NewInStoreCarousel';
import { BrandStrip } from '@/components/home/BrandStrip';
import { StoreSnapshot } from '@/components/home/StoreSnapshot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <CategoryTiles />
      <NewInStoreCarousel />
      <BrandStrip />
      <StoreSnapshot />
    </>
  );
}
