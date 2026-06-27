import { BuiltFor } from '@/sections/built-for';
import { Faq } from '@/sections/faq';
import { Features } from '@/sections/features';
import { FinalCta } from '@/sections/final-cta';
import { Hero } from '@/sections/hero';
import { Pricing } from '@/sections/pricing';
import { Trust } from '@/sections/trust';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BuiltFor />
      <Features />
      <Trust />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
