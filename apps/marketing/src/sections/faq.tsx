const QA: { q: string; a: string }[] = [
  {
    q: 'Is this legal advice?',
    a: 'No. Interfluo is a drafting aid. The supervising fee-earner reviews every output, decides what to accept, and remains the responsible professional under the SRA Code of Conduct. We do not sign anything, send anything, or certify anything.',
  },
  {
    q: 'What about scanned PDFs?',
    a: 'When a page has no extractable text layer, Interfluo falls back to vision OCR (Claude PDF document input) just for the affected pages. Native text pages are kept as-is for accuracy. Per-page detection — not a document-level average — so a single scanned page in the middle of a mixed pack is never missed.',
  },
  {
    q: 'Where is data hosted?',
    a: 'UK (London) for production: AWS eu-west-2, Neon Postgres pinned to eu-west-2. Anthropic API runs in zero-retention mode under a DPA. Per-firm encryption keys planned for Year 1 alongside Cyber Essentials Plus.',
  },
  {
    q: 'Does it work with my case management system?',
    a: 'PDF in, Word out today — no integrations required. Phase 2 (post-pilot) ships LEAP and Actionstep integrations; OSPREY, ALB, Clio follow. We integrate; we don\'t replace.',
  },
  {
    q: 'What happens if it misses something material?',
    a: 'The fee-earner is the responsible professional and reviews every output. Our audit log records exactly what was cited and what was accepted, edited, or rejected — and when. If a fee-earner adopts a draft, that adoption is their professional act. Interfluo gives them a defensible record of the review.',
  },
  {
    q: 'How accurate is it on real matters?',
    a: 'We benchmark continuously on synthetic packs with planted issues (deliberately material, deliberately ambiguous, and deliberately routine). Current results: 100% hit rate on material issues, zero hallucinations on the clean control, zero over-flagging of routine items as deal-blockers. We want your real packs to tell us the next benchmark to add.',
  },
  {
    q: 'Can we use our firm\'s Report on Title template?',
    a: 'Yes. Upload your .docx template once. Every exported report merges into your house format — letterhead, typography, section headings — using {{placeholder}} tokens. You keep your style; we keep the drafting.',
  },
  {
    q: 'What\'s out of scope?',
    a: 'AML / source-of-funds (Thirdfort, Armalytix do this well). Case management (LEAP, Actionstep — we integrate). Completion ledger, SDLT filing, Land Registry submission. We focus on the three high-cognitive tasks a fee-earner spends real time on: read the pack, draft the enquiries, draft the report.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-y border-line bg-paper-dim/40">
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <p className="label">FAQ</p>
            <h2 className="font-display mt-4 text-[clamp(32px,4vw,52px)] leading-[1.05] text-ink">
              Questions a partner asks first.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-ink-soft">
              If we haven't answered yours, ask us directly when you request a pilot.
            </p>
          </div>
          <dl className="divide-y divide-line rounded-lg border border-line bg-surface">
            {QA.map((item) => (
              <div key={item.q} className="px-6 py-5">
                <dt className="text-[15.5px] font-semibold tracking-tight text-ink">{item.q}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
