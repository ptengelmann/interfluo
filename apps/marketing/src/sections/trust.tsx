const POINTS = [
  {
    title: 'Citation-grounded by construction',
    body:
      'Every line in the Report on Title and every drafted enquiry maps to a specific page in a specific source document with a verbatim quote. The fee-earner can verify any assertion in two clicks. If the model can\'t produce a real quote, the fact is dropped — never hallucinated.',
  },
  {
    title: 'Append-only audit log',
    body:
      'Every accept, reject, edit, export, and pipeline run is recorded immutably per matter. Your COLP / COFA record of what was reviewed, when, and by whom. Defensible under any SRA file inspection.',
  },
  {
    title: 'Severity calibrated, not inflated',
    body:
      '"Critical" means deal-blocker — would advise client not to proceed. Routine items like a seller\'s mortgage to be redeemed on completion are informational. Calibration verified by adversarial benchmark on every release.',
  },
  {
    title: 'Drafting aid, not legal adviser',
    body:
      'Interfluo proposes. The fee-earner approves. The supervising solicitor remains the responsible professional under the SRA Code of Conduct. The product is built around that distinction in every interaction and every export.',
  },
  {
    title: 'Your firm\'s template, your house style',
    body:
      'Upload a .docx template once. Every Report on Title export merges into it — your letterhead, your typography, your section structure. No more rewriting the AI\'s house format.',
  },
  {
    title: 'UK data residency by default',
    body:
      'Production hosted in AWS London (eu-west-2). Anthropic zero-retention mode under DPA. Per-firm encryption keys. Year-1 Cyber Essentials Plus, Year-2 ISO 27001 in flight.',
  },
];

export function Trust() {
  return (
    <section id="trust" className="border-y border-line bg-paper-dim/40">
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="label">What makes it different</p>
          <h2 className="font-display mt-4 text-[clamp(32px,4vw,52px)] leading-[1.05] text-ink">
            Defensible by construction.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-ink-soft">
            The features your COLP cares about — citations, audit trail, calibrated severity, regulated-profession positioning — are the foundation, not the marketing.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} className="flex flex-col gap-3 bg-surface p-8">
              <h3 className="text-[17px] font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
