'use client';

import { useEffect, useState } from 'react';

type Step = 'dashboard' | 'upload' | 'pipeline' | 'results';

const ORDER: Step[] = ['dashboard', 'upload', 'pipeline', 'results'];

const TIMINGS: Record<Step, number> = {
  dashboard: 3800,
  upload: 4800,
  pipeline: 4200,
  results: 4800,
};

const LABELS: Record<Step, string> = {
  dashboard: '01 · Matters',
  upload: '02 · Upload the pack',
  pipeline: '03 · Pipeline running',
  results: '04 · Review & adopt',
};

/**
 * Animated demonstration of the app flow.
 * Cycles through four frames that mirror the actual product surfaces.
 * Replace with a <video> tag once we have a real screen recording.
 */
export function HeroDemo() {
  const [step, setStep] = useState<Step>('dashboard');

  useEffect(() => {
    const id = setTimeout(() => {
      const next = ORDER[(ORDER.indexOf(step) + 1) % ORDER.length] ?? 'dashboard';
      setStep(next);
    }, TIMINGS[step]);
    return () => clearTimeout(id);
  }, [step]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(30,28,24,0.35)]">
      <BrowserChrome />
      <StepBar step={step} />

      <div className="relative h-[460px] overflow-hidden bg-paper">
        <Frame active={step === 'dashboard'}>
          <DashboardFrame />
        </Frame>
        <Frame active={step === 'upload'}>
          <UploadFrame play={step === 'upload'} />
        </Frame>
        <Frame active={step === 'pipeline'}>
          <PipelineFrame play={step === 'pipeline'} />
        </Frame>
        <Frame active={step === 'results'}>
          <ResultsFrame play={step === 'results'} />
        </Frame>
      </div>

      <div className="border-t border-line bg-paper-dim/50 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-muted">
        {LABELS[step]}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Shared chrome                                                          */
/* ─────────────────────────────────────────────────────────────────────── */

function BrowserChrome() {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-paper-dim/60 px-4 py-2.5">
      <span className="size-2.5 rounded-full bg-[#FF5F57]" />
      <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="size-2.5 rounded-full bg-[#28C840]" />
      <div className="ml-3 flex flex-1 items-center justify-center">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-surface/80 px-3 py-1 text-[11px] text-muted font-mono">
          <span className="size-2 rounded-full bg-accent-on-dark/70" />
          app.interfluo.co
        </div>
      </div>
      <span className="text-[11px] text-muted">Patel &amp; Co</span>
    </div>
  );
}

function StepBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-line bg-surface py-2.5">
      {ORDER.map((s) => (
        <span
          key={s}
          className={
            s === step
              ? 'h-1 w-10 rounded-full bg-accent transition-all duration-500'
              : 'h-1 w-1.5 rounded-full bg-line-strong/70 transition-all duration-500'
          }
        />
      ))}
    </div>
  );
}

function Frame({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={
        active
          ? 'absolute inset-0 transition-opacity duration-500 opacity-100'
          : 'pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-0'
      }
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Frame 1: Dashboard                                                     */
/* ─────────────────────────────────────────────────────────────────────── */

function DashboardFrame() {
  return (
    <div className="relative h-full px-6 py-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Workspace</p>
          <h3 className="font-display mt-1 text-[26px] leading-none text-ink">Matters</h3>
        </div>
        <div className="relative">
          <button
            type="button"
            className="relative inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-4 text-[12px] font-semibold text-white"
          >
            New matter
            <span className="text-[14px] leading-none">+</span>
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <MatterRow ref_="MAT-2026-0142" addr="Flat 3, 24 Wynyard Terrace, London SE17 3JL" status="Ready" />
        <MatterRow ref_="MAT-2026-0138" addr="47 Beechwood Avenue, Sheffield S11 9EE" status="Drafting" subtle />
        <MatterRow ref_="MAT-2026-0131" addr="12 Crown Mews, Cambridge CB2 1TN" status="Completed" subtle />
      </div>

      {/* Cursor that floats toward New matter */}
      <Cursor className="absolute right-[88px] top-[26px] animate-cursor-to-new-matter" />
    </div>
  );
}

function MatterRow({
  ref_,
  addr,
  status,
  subtle,
}: {
  ref_: string;
  addr: string;
  status: string;
  subtle?: boolean;
}) {
  return (
    <div className={subtle ? 'rounded-lg border border-line bg-surface/70 p-3.5' : 'rounded-lg border border-line bg-surface p-3.5'}>
      <div className="flex items-center gap-4">
        <span className="font-display italic text-[20px] text-ink" style={{ letterSpacing: '-0.02em' }}>
          if
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[12.5px] font-semibold text-ink truncate">{ref_}</span>
            <span className="rounded-full bg-paper-dim px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {status}
            </span>
          </div>
          <p className="text-[11px] text-ink-soft truncate">{addr}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Frame 2: Upload                                                        */
/* ─────────────────────────────────────────────────────────────────────── */

const UPLOAD_DOCS = [
  { filename: '01-title-register.pdf', type: 'Title Register', pages: 4 },
  { filename: '02-lease.pdf', type: 'Lease', pages: 5 },
  { filename: '03-ta6-property-information.pdf', type: 'TA6 Property Information', pages: 5 },
  { filename: '04-con29-local-authority.pdf', type: 'CON29 Local Authority', pages: 3 },
  { filename: '05-mortgage-offer.pdf', type: 'Mortgage Offer', pages: 2 },
];

function UploadFrame({ play }: { play: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!play) return setStep(0);
    setStep(0);
    const ids: ReturnType<typeof setTimeout>[] = [];
    UPLOAD_DOCS.forEach((_, i) => {
      ids.push(setTimeout(() => setStep(i + 1), 500 + i * 700));
    });
    return () => ids.forEach(clearTimeout);
  }, [play]);

  return (
    <div className="h-full px-6 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        MAT-2026-0142 · Upload the pack
      </p>
      <h3 className="font-display mt-1 text-[22px] leading-none text-ink">
        Drop in the contract pack
      </h3>

      <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-paper-dim/30 px-6 py-5 text-center">
        <p className="text-[12px] text-ink-soft">
          PDFs only. Contract, TR1, title register, TA6, TA7, TA10, lease, searches.
        </p>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {UPLOAD_DOCS.map((d, i) => (
          <li
            key={d.filename}
            className={
              i < step
                ? 'flex items-center gap-3 rounded-md border border-line bg-surface px-3 py-2 transition-all duration-400'
                : 'pointer-events-none flex items-center gap-3 rounded-md border border-line bg-surface px-3 py-2 opacity-0 transition-all duration-400 translate-y-1'
            }
            style={i < step ? { opacity: 1, transform: 'translateY(0)' } : undefined}
          >
            <span className="grid size-6 place-items-center rounded-md bg-accent-tint text-accent-dark text-[11px]">
              ✓
            </span>
            <span className="flex-1 truncate text-[11.5px] text-ink">{d.filename}</span>
            <span className="text-[10.5px] text-muted">{d.pages} pages · 99%</span>
            <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-dark">
              {d.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Frame 3: Pipeline                                                      */
/* ─────────────────────────────────────────────────────────────────────── */

const PIPELINE_PHASES = [
  { pct: 18, label: 'Extracting facts from 9 documents…' },
  { pct: 42, label: 'Identifying risks across the pack…' },
  { pct: 68, label: 'Drafting enquiries…' },
  { pct: 88, label: 'Writing Report on Title…' },
  { pct: 100, label: 'Complete · 19 enquiries · 7 risks' },
];

function PipelineFrame({ play }: { play: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!play) return setPhase(0);
    setPhase(0);
    const ids: ReturnType<typeof setTimeout>[] = [];
    PIPELINE_PHASES.forEach((_, i) => {
      ids.push(setTimeout(() => setPhase(i), 200 + i * 800));
    });
    return () => ids.forEach(clearTimeout);
  }, [play]);

  const current = PIPELINE_PHASES[phase] ?? PIPELINE_PHASES[0]!;

  return (
    <div className="h-full px-6 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        MAT-2026-0142 · Pipeline
      </p>
      <h3 className="font-display mt-1 text-[22px] leading-none text-ink">
        Reading the pack
      </h3>

      <div className="mt-6 rounded-xl border border-line bg-surface p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">Progress</p>
          <p className="font-mono text-[12px] tnum text-ink-soft">{current.pct}%</p>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
            style={{ width: `${current.pct}%` }}
          />
        </div>
        <p className="mt-4 text-[13.5px] text-ink-soft">{current.label}</p>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {['Classify', 'Extract', 'Analyse', 'Enquiries', 'Report'].map((s, i) => (
          <div
            key={s}
            className={
              i <= Math.min(phase, 4)
                ? 'flex items-center justify-center rounded-md border border-accent/30 bg-accent-tint py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-dark transition-colors'
                : 'flex items-center justify-center rounded-md border border-line bg-surface py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors'
            }
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Frame 4: Results                                                       */
/* ─────────────────────────────────────────────────────────────────────── */

function ResultsFrame({ play }: { play: boolean }) {
  const [revealCitation, setRevealCitation] = useState(false);

  useEffect(() => {
    if (!play) {
      setRevealCitation(false);
      return;
    }
    const t = setTimeout(() => setRevealCitation(true), 1400);
    return () => clearTimeout(t);
  }, [play]);

  return (
    <div className="grid h-full grid-cols-[1.05fr_1fr] gap-3 px-5 py-4">
      {/* Left: enquiry list */}
      <div className="flex flex-col gap-2.5 overflow-hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          Enquiries · 19 drafted
        </p>
        <div className="flex flex-col gap-2 overflow-hidden">
          <EnquiryCard
            priority="P1"
            category="leasehold"
            text="Please confirm whether the Seller has taken steps to extend the lease pursuant to the Leasehold Reform, Housing and Urban Development Act 1993."
            highlight={revealCitation}
          />
          <EnquiryCard
            priority="P1"
            category="title"
            text="Please confirm that written consent of the freeholder of title NGL000123 has been obtained in respect of the proposed transfer."
          />
          <EnquiryCard
            priority="P2"
            category="planning"
            text="Please confirm the current status of the planning enforcement investigation arising from the 2019 rear extension."
            faded
          />
        </div>
      </div>

      {/* Right: viewer drawer slides in */}
      <div
        className={
          revealCitation
            ? 'translate-x-0 opacity-100 transition-all duration-500 ease-out'
            : 'translate-x-4 opacity-0 transition-all duration-500 ease-out'
        }
      >
        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-2">
            <span className="rounded-full bg-paper-dim px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
              Lease
            </span>
            <span className="text-[10px] text-muted">p. 2 / 5</span>
          </div>
          <div className="border-b border-line bg-accent-tint/60 px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
              Cited on pp. 1, 2
            </p>
            <p className="mt-0.5 text-[11px] italic leading-snug text-ink">
              "The Lease was granted on 1 January 1998 for a term of 99 years."
            </p>
          </div>
          <div className="flex-1 bg-paper-dim/30 p-3">
            <div className="mx-auto h-full max-w-[180px] rounded border border-line bg-white p-2.5">
              <div className="space-y-1">
                <div className="h-1.5 w-1/3 rounded bg-ink-soft/70" />
                <div className="h-0.5 w-2/3 rounded bg-line-strong/50" />
              </div>
              <div className="mt-3 space-y-0.5">
                <div className="h-0.5 w-full rounded bg-line-strong/40" />
                <div className="h-0.5 w-[94%] rounded bg-line-strong/40" />
                <div className="h-0.5 w-[88%] rounded bg-line-strong/40" />
              </div>
              <div className="mt-3 rounded-sm bg-accent/15 px-1 py-1 space-y-0.5">
                <div className="h-0.5 w-[90%] rounded bg-accent/50" />
                <div className="h-0.5 w-[80%] rounded bg-accent/50" />
              </div>
              <div className="mt-3 space-y-0.5">
                <div className="h-0.5 w-full rounded bg-line-strong/40" />
                <div className="h-0.5 w-[60%] rounded bg-line-strong/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnquiryCard({
  priority,
  category,
  text,
  highlight,
  faded,
}: {
  priority: string;
  category: string;
  text: string;
  highlight?: boolean;
  faded?: boolean;
}) {
  return (
    <div
      className={
        faded
          ? 'rounded-md border border-line bg-surface/60 p-3 opacity-60'
          : 'rounded-md border border-line bg-surface p-3'
      }
    >
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-[#f3e4e1] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-danger">
          {priority}
        </span>
        <span className="rounded-full bg-paper-dim px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {category}
        </span>
      </div>
      <p className="mt-2 text-[11.5px] leading-snug text-ink line-clamp-3">{text}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={
            highlight
              ? 'inline-flex items-center gap-1 rounded-sm border-l-2 border-accent bg-accent-tint/60 px-1.5 py-0.5 text-[10px] text-accent-dark transition-all duration-300'
              : 'inline-flex items-center gap-1 rounded-sm border-l-2 border-line px-1.5 py-0.5 text-[10px] text-muted transition-all duration-300'
          }
        >
          Lease · pp. 1, 2
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Cursor (CSS-drawn arrow)                                               */
/* ─────────────────────────────────────────────────────────────────────── */

function Cursor({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3 2 L17 9 L10 11 L8 18 Z"
        fill="#17181c"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
