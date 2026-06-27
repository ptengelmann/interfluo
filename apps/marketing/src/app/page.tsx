import Link from 'next/link';
import { Logo } from '@/brand/Logo';

const PAGE_TITLE = 'Drafting infrastructure for residential conveyancing.';

export default function HomePage() {
  return (
    <article className="mx-auto max-w-[1180px] px-6 sm:px-10">
      <Masthead />
      <Hero />
      <Spec01 />
      <Spec02 />
      <Spec03 />
      <Spec04 />
      <Spec05 />
      <Coda />
    </article>
  );
}

/* —————————————————————————————————————————————————————————
   Masthead  ·  newspaper-style header above the hero
   ———————————————————————————————————————————————————————— */

function Masthead() {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <div className="grid grid-cols-3 items-center border-b border-line py-3 text-[11.5px] uppercase tracking-[0.18em] text-muted">
      <span className="text-left">Vol. I · No. 1</span>
      <span className="text-center font-display italic normal-case tracking-normal text-[14px] text-ink">
        A statement of intent
      </span>
      <span className="text-right tnum">{today}</span>
    </div>
  );
}

/* —————————————————————————————————————————————————————————
   Hero  ·  one sentence, a pull-mark, generous rule
   ———————————————————————————————————————————————————————— */

function Hero() {
  return (
    <section className="pt-20 pb-24 sm:pt-32 sm:pb-40">
      <div className="flex justify-center">
        <span
          className="font-display italic text-[clamp(120px,18vw,220px)] leading-[0.86] text-ink"
          aria-hidden
          style={{ letterSpacing: '-0.04em' }}
        >
          if
        </span>
      </div>
      <h1 className="mx-auto mt-12 max-w-5xl text-center font-display text-[clamp(38px,5.4vw,80px)] leading-[1.04] tracking-tight text-ink">
        {PAGE_TITLE}
      </h1>
      <p className="mx-auto mt-10 max-w-2xl text-center text-[17px] leading-[1.6] text-ink-soft">
        Interfluo reads a UK residential conveyancing pack — contract, title, property forms, searches — and drafts the enquiries and the Report on Title. Every line cites the page it came from. The supervising fee-earner reviews and adopts.
      </p>
      <div className="mt-12 flex flex-col items-center gap-1">
        <Link
          href="/pilot"
          className="group inline-flex items-baseline gap-2 text-[15px] text-ink hover:text-accent transition-colors"
        >
          <span className="smallcaps text-muted text-[11px]">Pilot</span>
          <span>Request access for your firm</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
        <span className="mt-3 block h-px w-24 bg-line-strong" />
        <p className="mt-4 text-[12.5px] italic text-muted">
          Three matters at no cost. England &amp; Wales firms only at present.
        </p>
      </div>
    </section>
  );
}

/* —————————————————————————————————————————————————————————
   Section frame  ·  marginalia + body, hairline rule above
   ———————————————————————————————————————————————————————— */

function Section({
  num,
  label,
  title,
  children,
}: {
  num: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="grid gap-10 md:grid-cols-[180px_1fr] md:gap-16">
        <aside className="md:sticky md:top-10 md:self-start">
          <p className="section-marker text-[18px]">§ {num}</p>
          <p className="mt-2 smallcaps text-[10.5px] text-muted">{label}</p>
        </aside>
        <div>
          <h2 className="font-display text-[clamp(30px,4.4vw,56px)] leading-[1.05] tracking-tight text-ink">
            {title}
          </h2>
          <div className="mt-10 space-y-6 text-[17px] leading-[1.7] text-ink">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* —————————————————————————————————————————————————————————
   § 01  ·  the problem stated as a single argument
   ———————————————————————————————————————————————————————— */

function Spec01() {
  return (
    <Section num="01" label="The leak" title="A fee-earner drafts the same four hours' work, on every matter, by hand.">
      <p className="dropcap">
        A UK residential conveyancing transaction takes roughly seventeen weeks. Inside it, three tasks consume between four and eight hours of the supervising fee-earner: reading the contract pack and the searches; drafting the enquiries to raise with the seller's solicitor; drafting the Report on Title for the buyer. The rest is workflow — chasing, signing, filing — and the case management systems already do it well.
      </p>
      <p>
        Five and a half thousand firms run the same loop a million times a year. Each time, a competent lawyer copies clauses from one document into a question, finds and re-finds the page where a covenant was disclosed, types the same disclaimer about indemnity insurance into the same Section 4 of the Report. The hours don't compound into firm equity. They evaporate into the margin gap.
      </p>
      <p className="font-display italic text-[clamp(24px,3vw,36px)] leading-[1.25] text-ink-soft border-l-2 border-accent pl-6">
        The work that ought to feel like judgement feels like data-entry.
      </p>
    </Section>
  );
}

/* —————————————————————————————————————————————————————————
   § 02  ·  what the product actually does, prose not cards
   ———————————————————————————————————————————————————————— */

function Spec02() {
  return (
    <Section num="02" label="The wedge" title="One screen. One verb. Draft my enquiries and Report on Title from this pack.">
      <p>
        Interfluo runs a five-stage pipeline on the pack you upload. The model classifies each document (TR1, title register, TA6, TA7, TA10, lease, CON29, drainage, environmental, mortgage offer, draft contract — seventeen recognised types). It extracts the legally material facts page-by-page, requiring a verbatim quote for each. It identifies the risks that span documents — the mortgage offer's special condition that requires freeholder consent; the title restriction that requires the same; the lease term that defeats the lender's eighty-year floor. It drafts ranked enquiries in the firm's voice. It writes the Report on Title in a fixed ten-section structure.
      </p>
      <p>
        It does all of that in thirty to sixty seconds on a clean pack. Vision OCR recovers the pages of a scanned annexe where the text layer is missing. The fee-earner reads through the enquiries in fifteen minutes, edits two or three, rejects one, accepts the rest. Every action lands in an append-only audit table — the COLP's record of professional review.
      </p>
      <Specimen />
    </Section>
  );
}

/* A small "specimen" block — visualises what one enquiry looks like in the
   product, set in the same typography. This is the product, not a screenshot. */
function Specimen() {
  return (
    <figure className="mt-12 border border-line bg-surface">
      <figcaption className="flex items-center justify-between border-b border-line px-6 py-3 text-[11.5px] uppercase tracking-[0.18em] text-muted">
        <span>Specimen · drafted enquiry</span>
        <span className="font-display italic normal-case tracking-normal text-[14px] text-accent">
          P1 · leasehold
        </span>
      </figcaption>
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-[16.5px] leading-[1.65] text-ink">
          The Lease dated 1 January 1998 was granted for a term of 99 years, giving an unexpired residue of approximately 71 years at the anticipated completion date. The Buyer's mortgage offer (Nationwide Building Society, NW-MA-2026-44128) contains a special condition requiring the unexpired term to exceed 80 years at completion, failing which the offer will be withdrawn.
        </p>
        <p className="mt-4 text-[16.5px] leading-[1.65] text-ink">
          Please confirm whether the Seller has taken any steps to extend the lease pursuant to the Leasehold Reform, Housing and Urban Development Act 1993, and if so please provide copies of any section 42 notice, counter-notice, or agreed terms.
        </p>
        <p className="mt-6 text-[12.5px] italic text-muted leading-relaxed">
          Why we are asking — The unexpired lease term (~71 years) falls below the lender's 80-year minimum, making this a deal-critical issue that must be resolved before exchange.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 text-[12px] text-muted">
          <Cite doc="Title Register" page="pp. 2–3" />
          <Cite doc="Lease" page="pp. 1–2" />
          <Cite doc="Mortgage Offer" page="p. 2" />
        </div>
      </div>
    </figure>
  );
}

function Cite({ doc, page }: { doc: string; page: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[10px] text-accent-dark">§</span>
      <span className="text-ink-soft">{doc}</span>
      <span>·</span>
      <span className="tnum">{page}</span>
    </span>
  );
}

/* —————————————————————————————————————————————————————————
   § 03  ·  the trust argument as a definition list
   ———————————————————————————————————————————————————————— */

function Spec03() {
  return (
    <Section num="03" label="Defensibility" title="The features your COLP cares about — built as foundations, not marketing.">
      <p>
        Three things have to be true before a firm with professional-indemnity exposure can adopt a generative tool. We've built around all three from the first commit. They aren't a feature checklist; they're the architecture.
      </p>

      <dl className="mt-10 divide-y divide-line">
        <DefRow term="Citation by construction">
          Every drafted line — every enquiry, every paragraph of the Report — carries a verbatim quote and a page reference back to the source document. The extractor rejects facts whose quote cannot be located in the cited page. The model is forbidden from inventing citations. The fee-earner verifies any assertion in two clicks.
        </DefRow>
        <DefRow term="Append-only audit log">
          Every accept, reject, edit, export, and pipeline run is recorded immutably per matter, scoped to the firm, identified by the Clerk user id of the actor. The record cannot be amended. It is the firm's evidence of professional review under any SRA file inspection or PI insurer enquiry.
        </DefRow>
        <DefRow term="Calibrated severity">
          The model's "critical" means deal-blocker — would advise the client not to proceed. The model's "P1" means we cannot exchange without resolution. Routine matters (the seller's mortgage to be redeemed on completion; notice of assignment fees; a TPO on a neighbouring tree) are informational. The calibration is anchored by an adversarial benchmark that runs against every release: any drift in severity language is a build failure.
        </DefRow>
        <DefRow term="Drafting aid, not legal adviser">
          Interfluo proposes. The fee-earner approves, edits, or rejects. The supervising solicitor remains the responsible professional under the SRA Code of Conduct. We do not sign anything, send anything, or certify anything. Every export carries the same disclosure in its footer.
        </DefRow>
      </dl>
    </Section>
  );
}

function DefRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 py-7 md:grid-cols-[220px_1fr] md:gap-12">
      <dt className="font-display italic text-[22px] leading-tight text-ink">{term}</dt>
      <dd className="text-[15.5px] leading-[1.7] text-ink-soft">{children}</dd>
    </div>
  );
}

/* —————————————————————————————————————————————————————————
   § 04  ·  pricing as prose
   ———————————————————————————————————————————————————————— */

function Spec04() {
  return (
    <Section num="04" label="Economics" title="Priced per matter. The arithmetic does itself.">
      <p>
        A firm typically charges the client between eight hundred and one and a half thousand pounds for a residential matter. Recovering four hours of fee-earner time for a fifty-pound assist is, plainly, the easiest spreadsheet in legal technology. There is no per-seat fee — partners and trainees and paralegals all log in equally — because solicitor headcount is small and matter count is the actual volume driver.
      </p>

      <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        <PriceTier
          label="Pilot"
          headline="Free"
          sub="three matters · end-to-end"
          body="We run your first three matters at no cost. The maths is obvious before any commitment."
        />
        <PriceTier
          label="Per matter"
          headline="£40–60"
          sub="per matter · billed monthly"
          body="Unlimited fee-earners, unlimited firm templates, full audit log, .docx export, UK data residency."
        />
        <PriceTier
          label="Subscription"
          headline="£500–2,000"
          sub="per month · 50+ matters / mo"
          body="Predictable monthly cost replaces per-matter billing. Priority support and quarterly calibration review."
        />
      </div>

      <p className="mt-8 text-[14px] italic text-muted">
        Pilot is a real product, not a trial. You upload real matters, the output is real, the audit log is real. You convert if and when you want to.
      </p>
    </Section>
  );
}

function PriceTier({
  label,
  headline,
  sub,
  body,
}: {
  label: string;
  headline: string;
  sub: string;
  body: string;
}) {
  return (
    <div className="bg-surface p-8">
      <p className="smallcaps text-[10.5px] text-muted">{label}</p>
      <p className="font-display mt-4 text-[44px] leading-none text-ink tnum">{headline}</p>
      <p className="mt-2 text-[12.5px] italic text-muted">{sub}</p>
      <p className="mt-6 text-[14px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

/* —————————————————————————————————————————————————————————
   § 05  ·  Q&A as marginalia
   ———————————————————————————————————————————————————————— */

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Is this legal advice?',
    a: 'No. Interfluo is drafting infrastructure. The supervising fee-earner reviews every output, decides what to accept, and remains the responsible professional under the SRA Code of Conduct. We do not sign, send, or certify anything.',
  },
  {
    q: 'What about scanned PDFs?',
    a: 'A per-page text-density check identifies pages without an extractable text layer; those pages are recovered via Claude vision. Native text pages are left alone for accuracy. A scanned annexe buried in a mixed-mode pack is never silently missed.',
  },
  {
    q: 'Where does the data live?',
    a: 'UK (London) in production: AWS eu-west-2 for compute and blobs, Neon Postgres pinned to eu-west-2. Anthropic API runs in zero-retention mode under a DPA — no training on customer data. Cyber Essentials Plus in flight for Year 1, ISO 27001 for Year 2.',
  },
  {
    q: 'Does it integrate with my case management system?',
    a: 'PDF in, .docx out today — no integration required. LEAP and Actionstep integrations follow in Phase 2. We integrate; we do not replace.',
  },
  {
    q: 'What happens if it misses something material?',
    a: 'The fee-earner is the responsible professional and reviews every output. The audit log records the order, timing, and identity of every accept and edit. If a fee-earner adopts a draft, that adoption is their professional act, with a defensible record of what was put in front of them.',
  },
  {
    q: 'Why "Interfluo"?',
    a: 'Latin: to flow between. The connective tissue between buyer, seller, lender, and solicitor. The name is also a quiet refusal to sound like a chatbot.',
  },
];

function Spec05() {
  return (
    <Section num="05" label="Q&A" title="The questions a partner asks first.">
      <p>If we haven't answered yours below, ask us directly when you request a pilot.</p>
      <dl className="mt-10 divide-y divide-line">
        {QUESTIONS.map((item) => (
          <div key={item.q} className="grid gap-3 py-7 md:grid-cols-[260px_1fr] md:gap-10">
            <dt className="font-display italic text-[20px] leading-snug text-ink">{item.q}</dt>
            <dd className="text-[15px] leading-[1.7] text-ink-soft">{item.a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* —————————————————————————————————————————————————————————
   Coda  ·  one paragraph, one typographic mark, one link
   ———————————————————————————————————————————————————————— */

function Coda() {
  return (
    <section className="border-t border-line py-28 sm:py-40 text-center">
      <Logo size={32} />
      <p className="mx-auto mt-14 max-w-2xl font-display text-[clamp(28px,3.4vw,44px)] leading-[1.25] text-ink">
        Your first three matters cost nothing. The fourth pays for the first thousand.
      </p>
      <div className="mt-12 flex flex-col items-center gap-2">
        <Link
          href="/pilot"
          className="group inline-flex items-baseline gap-2 text-[16px] text-ink hover:text-accent transition-colors"
        >
          <span>Request a pilot for your firm</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
        <span className="mt-2 block h-px w-32 bg-line-strong" />
        <a
          href="mailto:hello@interfluo.co"
          className="mt-3 text-[12.5px] italic text-muted hover:text-ink"
        >
          or write to hello@interfluo.co
        </a>
      </div>
    </section>
  );
}
