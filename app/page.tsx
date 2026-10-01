import { Hero } from '@/components/home/Hero';
import { Ticker } from '@/components/home/Ticker';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { NewInStoreCarousel } from '@/components/home/NewInStoreCarousel';
import { BrandStrip } from '@/components/home/BrandStrip';
import { StoreSnapshot } from '@/components/home/StoreSnapshot';

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
