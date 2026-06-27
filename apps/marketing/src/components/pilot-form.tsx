'use client';

import { useState, type FormEvent } from 'react';
import { IconArrowRight } from '@/components/icons';

const PILOT_RECIPIENT = 'pilot@interfluo.co';

export function PilotForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const firm = String(data.get('firm') ?? '');
    const email = String(data.get('email') ?? '');
    const role = String(data.get('role') ?? '');
    const volume = String(data.get('volume') ?? '');
    const notes = String(data.get('notes') ?? '');

    const body = [
      `Name:   ${name}`,
      `Firm:   ${firm}`,
      `Email:  ${email}`,
      `Role:   ${role}`,
      `Volume: ${volume}`,
      '',
      'Notes:',
      notes,
    ].join('\n');

    const subject = `Pilot request · ${firm || name}`;
    window.location.href = `mailto:${PILOT_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-lg bg-accent-tint/60 p-6">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-accent-dark">Sent</p>
        <p className="mt-3 text-[20px] font-semibold tracking-tight text-ink">
          Your email client should have opened with your message.
        </p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          If it didn&rsquo;t, write directly to{' '}
          <a href={`mailto:${PILOT_RECIPIENT}`} className="font-semibold text-accent-dark hover:underline">
            {PILOT_RECIPIENT}
          </a>
          . We reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Your name" name="name" required placeholder="Anita Patel" />
      <Field label="Firm" name="firm" required placeholder="Patel & Co Solicitors" />
      <Field label="Work email" name="email" type="email" required placeholder="anita@patel-co.example" />
      <Field label="Role" name="role" placeholder="Partner, COLP, fee-earner…" />
      <Select label="Matters per month (typical)" name="volume">
        <option value="">Select</option>
        <option value="<20">Fewer than 20</option>
        <option value="20-50">20 to 50</option>
        <option value="50-150">50 to 150</option>
        <option value="150+">150 or more</option>
      </Select>
      <Field label="Anything we should know?" name="notes" multiline placeholder="Type of matters, current pain points…" />
      <button
        type="submit"
        className="group mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-accent pl-5 pr-1.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Send pilot request
        <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
          <IconArrowRight width={12} height={12} />
        </span>
      </button>
      <p className="text-[12px] text-muted">
        We use your email to reply about your pilot only. No marketing list. No third parties.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  multiline = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder}
          className="resize-none rounded-lg border border-line bg-surface px-4 py-3 text-[14.5px] text-ink placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent transition-shadow"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="h-11 rounded-lg border border-line bg-surface px-4 text-[14.5px] text-ink placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent transition-shadow"
        />
      )}
    </div>
  );
}

function Select({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="h-11 rounded-lg border border-line bg-surface px-4 text-[14.5px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent"
      >
        {children}
      </select>
    </div>
  );
}
