import { Hero } from '@/sections/hero';
import { Problem } from '@/sections/problem';
import { HowItWorks } from '@/sections/how-it-works';
import { Trust } from '@/sections/trust';
import { Pricing } from '@/sections/pricing';
import { Faq } from '@/sections/faq';
import { FinalCta } from '@/sections/final-cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Trust />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
