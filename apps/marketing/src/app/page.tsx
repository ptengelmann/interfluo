import { Hero } from '@/sections/hero';
import { BuiltFor } from '@/sections/built-for';
import { Features } from '@/sections/features';
import { Trust } from '@/sections/trust';
import { Pricing } from '@/sections/pricing';
import { Faq } from '@/sections/faq';
import { FinalCta } from '@/sections/final-cta';

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
