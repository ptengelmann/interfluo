import { IconArrowRight } from '@/components/icons';
import Link from 'next/link';

export const metadata = {
  title: 'Validation · Interfluo',
  description:
    'Interfluo benchmark snapshot: nine internal adversarial conveyancing scenarios, average Matter Quality Score 98/100.',
};

interface Scenario {
  id: string;
  name: string;
  oneLiner: string;
  score: number;
  verdict: 'EXCELLENT' | 'PASS' | 'BORDERLINE' | 'FAIL';
  notes: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'freehold-enforcement-and-undisclosed-occupier',
    name: 'Active enforcement notice + undisclosed occupier',
    oneLiner:
      'Live CON29 enforcement on a garage conversion. Adult occupier in the contract but not on the TA6.',
    score: 97.0,
    verdict: 'EXCELLENT',
    notes:
      'Pipeline caught all three planted issues plus the TA6 vs CON29 misrepresentation organically.',
  },
  {
    id: 'freehold-clean-with-satisfied-restriction',
    name: 'Clean freehold with Form A restriction',
    oneLiner:
      'Routine joint-ownership trust restriction and a Lloyds charge to redeem on completion.',
    score: 97.0,
    verdict: 'EXCELLENT',
    notes:
      'No critical or high severity flagged. Form A correctly treated as routine, not escalated.',
  },
  {
    id: 'freehold-resolved-boundary-dispute',
    name: 'Resolved historical boundary dispute',
    oneLiner: 'TA6 candidly discloses a 2018 dispute settled by a 2019 boundary agreement.',
    score: 100.0,
    verdict: 'EXCELLENT',
    notes: 'BOUNDARY_DISPUTE_UNRESOLVED correctly NOT emitted. Over-flag suppression works.',
  },
  {
    id: 'freehold-missing-building-regs-cert',
    name: 'Missing building regulations certificate',
    oneLiner: 'Extension confirmed built (2020). Completion certificate genuinely missing.',
    score: 100.0,
    verdict: 'EXCELLENT',
    notes: 'PLANNING_BUILDING_REGS_MISSING emitted on positive evidence, not speculation.',
  },
  {
    id: 'freehold-disclosure-inconsistency-flooding',
    name: 'Disclosure inconsistency, flooding',
    oneLiner:
      'TA6 declares no flooding and no claims. Drainage search and CON29 record a 2019 fluvial flood and an Aviva claim.',
    score: 100.0,
    verdict: 'EXCELLENT',
    notes:
      'All four expected codes hit including SELLER_DISCLOSURE_INCONSISTENCY outside the planning context.',
  },
  {
    id: 'leasehold-short-lease-and-escalation',
    name: 'Short lease with ground-rent escalation',
    oneLiner:
      '72-year unexpired term, doubling ground rent, service charge arrears, pending Section 20.',
    score: 100.0,
    verdict: 'EXCELLENT',
    notes:
      'All five leasehold codes routed correctly. Critical reserved for the lender-blocker combination.',
  },
  {
    id: 'leasehold-flat-with-issues',
    name: 'Leasehold flat with multiple issues',
    oneLiner:
      'The heaviest pack in the corpus: eleven planted issues across leasehold, planning, title, search, and disclosure.',
    score: 94.0,
    verdict: 'EXCELLENT',
    notes:
      'Eleven of eleven planted issues routed correctly. Mild enquiry-density penalty for an 18-enquiry output.',
  },
  {
    id: 'freehold-house-clean',
    name: 'Clean freehold (control)',
    oneLiner: 'The original clean control. No planted material issues; routine items only.',
    score: 100.0,
    verdict: 'EXCELLENT',
    notes: 'No risks invented. Output stayed quiet.',
  },
  {
    id: 'freehold-house-edge-cases',
    name: 'Freehold with over-flag traps',
    oneLiner:
      'Adversarial pack: six routine items designed to provoke over-flagging, three genuine material issues.',
    score: 97.0,
    verdict: 'EXCELLENT',
    notes: 'Six of six adversarial traps correctly low-severity. All three genuine items raised.',
  },
];

const STATS = [
  { label: 'Scenarios baselined', value: '9 / 9' },
  { label: 'Planted signals detected', value: '40 / 40' },
  { label: 'Taxonomy codes routed', value: '33 / 33' },
  { label: 'Over-flagging of routine items', value: '0 / 8' },
  { label: 'Average Matter Quality Score', value: '98 / 100' },
];

const SCORE_COMPONENTS = [
  {
    label: 'Signal detection',
    weight: '40%',
    body: 'Did the pipeline find every planted material issue in the pack?',
  },
  {
    label: 'Taxonomy routing',
    weight: '30%',
    body: 'Did each find route to the correct named code in the conveyancing taxonomy?',
  },
  {
    label: 'No over-flagging',
    weight: '15%',
    body: 'Were routine items (mortgage redemption, FENSA, summer house) kept at the right low severity?',
  },
  {
    label: 'No hallucination',
    weight: '15%',
    body: 'Were any taxonomy codes invented that the pack does not support?',
  },
];

const CAVEATS = [
  'Interfluo is drafting infrastructure for a regulated professional. It is not a source of legal advice.',
  'The benchmark corpus is synthetic and internal. Real conveyancing matters vary; a passing scenario score is not a claim about market-wide performance.',
  'The supervising fee-earner remains the responsible professional. Interfluo produces first-draft enquiries and Report on Title; the fee-earner reviews, edits, accepts, rejects, and exports.',
  'Citation-grounding reduces but does not eliminate the need to read the source documents.',
];

export default function ValidationPage() {
  return (
    <article className="mx-auto max-w-[980px] px-6 py-20 lg:px-10">
      <p className="eyebrow">Validation</p>
      <h1 className="mt-5 text-[clamp(40px,5.4vw,64px)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">
        Internally validated, openly disclosed.
      </h1>
      <p className="mt-6 max-w-2xl text-[16.5px] leading-[1.6] text-ink-soft">
        Interfluo has been validated against nine internal adversarial conveyancing benchmark
        scenarios. Across the corpus the pipeline detected every planted issue, routed every
        expected taxonomy code, and produced zero over-flags of routine items. Average Matter
        Quality Score: 98 out of 100.
      </p>
      <p className="mt-4 max-w-2xl text-[14px] leading-[1.65] text-muted italic">
        Internal validation. Not a substitute for fee-earner review.
      </p>

      <section className="mt-16">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          What we tested
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
          Each scenario is a synthetic contract pack (title register, TA6, TA10, CON29, drainage
          search, draft contract, plus lease and TA7 for leaseholds) seeded with specific issues
          that a competent UK conveyancer should raise. The pipeline runs end to end against the
          pack, producing risks, enquiries, and a Report on Title. The scorer measures issue
          detection, taxonomy routing, citation grounding, severity calibration, and routine-noise
          suppression.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          Headline numbers
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(30,28,24,0.06)]"
            >
              <p
                className="font-display text-[28px] leading-none tracking-[-0.015em] text-ink"
                style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}
              >
                {s.value}
              </p>
              <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          Per-scenario results
        </h2>
        <dl className="mt-6 border-t border-line">
          {SCENARIOS.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-[36px_1fr_auto] gap-x-5 border-b border-line py-7 sm:grid-cols-[48px_1fr_120px]"
            >
              <span className="font-display italic text-[22px] leading-none tracking-[-0.02em] text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <dt className="text-[16px] font-semibold leading-snug tracking-[-0.005em] text-ink">
                  {s.name}
                </dt>
                <dd className="mt-2 text-[13.5px] leading-[1.6] text-ink-soft">{s.oneLiner}</dd>
                <dd className="mt-2 text-[12.5px] leading-[1.5] text-muted italic">{s.notes}</dd>
              </div>
              <div className="flex flex-col items-end justify-start gap-1.5">
                <span
                  className="font-display text-[22px] leading-none tracking-[-0.015em] text-ink"
                  style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}
                >
                  {s.score.toFixed(1)}
                </span>
                <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
                  {s.verdict}
                </span>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          What the Matter Quality Score measures
        </h2>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-[1.65] text-ink-soft">
          A single composite metric from 0 to 100. Verdict bands: 90+ excellent, 80 to 89 pass, 70
          to 79 borderline, below 70 fail. An enquiry-density penalty of 1 point per enquiry above
          15 keeps the pipeline rewarding sharper output over louder output.
        </p>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {SCORE_COMPONENTS.map((c) => (
            <div key={c.label} className="grid gap-3 py-5 md:grid-cols-[200px_80px_1fr] md:gap-8">
              <p className="text-[14.5px] font-semibold tracking-tight text-ink">{c.label}</p>
              <p className="font-display text-[16px] tracking-tight text-accent-dark">{c.weight}</p>
              <p className="text-[13.5px] leading-[1.65] text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-line-strong bg-paper-dim/40 p-7">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
          What we do not claim
        </h2>
        <ul className="mt-5 flex flex-col gap-3.5">
          {CAVEATS.map((c) => (
            <li key={c} className="flex gap-3 text-[14px] leading-[1.6] text-ink-soft">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 flex flex-col items-start gap-5 border-t border-line pt-12">
        <p className="eyebrow">Next step</p>
        <h2 className="font-display text-[clamp(28px,3.4vw,40px)] leading-[1.1] tracking-[-0.015em] text-ink">
          The benchmark is internal. The next validation is one fee-earner.
        </h2>
        <p className="max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
          We use the corpus to catch regressions in calibration, citation grounding, and severity
          routing. The buyer-facing milestone is different: a conveyancing partner runs Interfluo
          against one real matter, with us on the call, and tells us where the model helps and where
          it gets in the way. That is what we ask for next.
        </p>
        <Link
          href="/pilot"
          className="group mt-2 inline-flex h-10 items-center gap-1.5 rounded-full bg-accent pl-5 pr-1.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Book a review session
          <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
            <IconArrowRight width={12} height={12} />
          </span>
        </Link>
      </section>

      <p className="mt-16 text-[11px] leading-[1.6] text-muted">
        Methodology and per-scenario regression rules:{' '}
        <a
          href="https://github.com/ptengelmann/interfluo/blob/main/packages/fixtures/BASELINES.md"
          className="font-medium text-accent-dark underline-offset-4 hover:underline"
        >
          packages/fixtures/BASELINES.md
        </a>
        . Last validated: 2026-06-28.
      </p>
    </article>
  );
}
