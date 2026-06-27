import { DocumentsMock } from '@/mocks/documents-mock';
import { ViewerMock } from '@/mocks/viewer-mock';
import { ActivityMock } from '@/mocks/activity-mock';

export function Features() {
  return (
    <section id="features" className="border-b border-line/60">
      <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The product</p>
          <h2 className="mt-5 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            One screen. One verb.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.55] text-ink-soft">
            <em className="font-display not-italic-tight italic text-ink">Draft my enquiries and Report on Title from this pack.</em> The whole product fits behind that sentence.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-28">
          <Row
            eyebrow="Ingest & classify"
            title="Drop in the pack. Interfluo reads everything."
            body="PDFs in, structured facts out. The model recognises seventeen document types: contracts, TR1, title register, TA6, TA7, TA10, lease, CON29, drainage, environmental, mortgage offer. Scanned pages are recovered with vision OCR; native text pages are kept as-is for accuracy."
            visual={<DocumentsMock />}
          />
          <Row
            reverse
            eyebrow="Grounded by construction"
            title="Every line cites the page it came from."
            body="Click any citation chip to jump to the cited PDF page with the quote highlighted. If the model can't produce a verifiable verbatim quote, the fact is dropped. Never hallucinated. Your fee-earner verifies any assertion in two clicks."
            visual={<ViewerMock />}
          />
          <Row
            eyebrow="Defensible by design"
            title="Every action, recorded. Append-only."
            body="Each accept, edit, reject, export, and pipeline run is written to an immutable audit table per matter. The supervising fee-earner remains the responsible professional, and has the record to prove it. Under SRA file inspection, this is the difference between a hard conversation and a short one."
            visual={<ActivityMock />}
          />
        </div>
      </div>
    </section>
  );
}

function Row({
  eyebrow,
  title,
  body,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
      <div className={reverse ? 'lg:order-2' : ''}>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-4 text-[clamp(26px,3.4vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h3>
        <p className="mt-5 max-w-lg text-[15.5px] leading-[1.7] text-ink-soft">{body}</p>
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>{visual}</div>
    </div>
  );
}
