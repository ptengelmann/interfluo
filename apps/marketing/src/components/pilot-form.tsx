'use client';

import { useState, type FormEvent } from 'react';

const PILOT_RECIPIENT = 'pilot@interfluo.co';

export function PilotForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '');
    const firm = String(data.get('firm') ?? '');
    const email = String(data.get('email') ?? '');
    const role = String(data.get('role') ?? '');
    const volume = String(data.get('volume') ?? '');
    const notes = String(data.get('notes') ?? '');

    const body = [
      `Name: ${name}`,
      `Firm: ${firm}`,
      `Email: ${email}`,
      `Role: ${role}`,
      `Matter volume: ${volume}`,
      '',
      'Notes:',
      notes,
    ].join('\n');

    const subject = `Pilot request — ${firm || name}`;
    const mailto = `mailto:${PILOT_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent-tint/40 p-8">
        <p className="label">Thanks</p>
        <h2 className="font-display mt-3 text-[28px] leading-tight text-ink">
          Your email client should have opened with your message.
        </h2>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          If it didn't, please email{' '}
          <a href={`mailto:${PILOT_RECIPIENT}`} className="text-accent-dark underline">
            {PILOT_RECIPIENT}
          </a>{' '}
          directly. We'll get back to you within one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-8"
    >
      <Field label="Your name" name="name" required placeholder="Anita Patel" />
      <Field label="Firm name" name="firm" required placeholder="Patel & Co Solicitors" />
      <Field
        label="Work email"
        name="email"
        type="email"
        required
        placeholder="anita@patel-co.example"
      />
      <Field label="Your role" name="role" placeholder="Partner, COLP, fee-earner…" />
      <Select label="Matters per month (typical)" name="volume">
        <option value="">— Select —</option>
        <option value="<20">Fewer than 20</option>
        <option value="20-50">20 to 50</option>
        <option value="50-150">50 to 150</option>
        <option value="150+">150 or more</option>
      </Select>
      <Field
        label="Anything we should know?"
        name="notes"
        multiline
        placeholder="Type of matters, current pain points, anything else…"
      />
      <button
        type="submit"
        className="mt-2 inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-[15px] font-semibold text-white hover:bg-accent-dark transition-colors"
      >
        Request pilot
      </button>
      <p className="text-[12.5px] text-muted">
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
      <label htmlFor={name} className="label">
        {label}
        {required && <span className="ml-1 text-accent-dark">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder}
          className="rounded-md border border-line bg-surface px-3.5 py-3 text-[14px] text-ink placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="h-11 rounded-md border border-line bg-surface px-3.5 text-[14px] text-ink placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent"
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
      <label htmlFor={name} className="label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="h-11 rounded-md border border-line bg-surface px-3.5 text-[14px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent"
      >
        {children}
      </select>
    </div>
  );
}
