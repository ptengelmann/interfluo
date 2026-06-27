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
      `Name:   ${name}`,
      `Firm:   ${firm}`,
      `Email:  ${email}`,
      `Role:   ${role}`,
      `Volume: ${volume}`,
      '',
      'Notes:',
      notes,
    ].join('\n');

    const subject = `Pilot request — ${firm || name}`;
    window.location.href = `mailto:${PILOT_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border-l-2 border-accent pl-6">
        <p className="smallcaps text-[10.5px] text-muted">Sent</p>
        <p className="font-display mt-3 text-[28px] leading-snug text-ink">
          Your email client should have opened with your message.
        </p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          If it didn&rsquo;t, write directly to{' '}
          <a href={`mailto:${PILOT_RECIPIENT}`} className="border-b border-accent text-ink hover:text-accent">
            {PILOT_RECIPIENT}
          </a>
          . We reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Field label="Your name" name="name" required placeholder="Anita Patel" />
      <Field label="Firm" name="firm" required placeholder="Patel & Co Solicitors" />
      <Field
        label="Work email"
        name="email"
        type="email"
        required
        placeholder="anita@patel-co.example"
      />
      <Field label="Role" name="role" placeholder="Partner, COLP, fee-earner…" />
      <Select label="Matters per month, typical" name="volume">
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
        placeholder="Type of matters, current pain points…"
      />
      <button
        type="submit"
        className="mt-8 inline-flex items-baseline justify-start gap-2 self-start text-[15px] text-ink hover:text-accent transition-colors"
      >
        <span>Send pilot request</span>
        <span aria-hidden>→</span>
      </button>
      <span className="mt-2 block h-px w-32 bg-line-strong" />
      <p className="mt-4 text-[12px] italic text-muted">
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
    <div className="flex flex-col border-b border-line py-4">
      <label htmlFor={name} className="smallcaps text-[10.5px] text-muted">
        {label}
        {required && <span className="ml-1 text-accent">·</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder}
          className="mt-2 resize-none bg-transparent text-[16px] leading-[1.6] text-ink placeholder:text-muted/60 focus-visible:outline-none"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="mt-2 h-9 bg-transparent text-[16px] text-ink placeholder:text-muted/60 focus-visible:outline-none"
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
    <div className="flex flex-col border-b border-line py-4">
      <label htmlFor={name} className="smallcaps text-[10.5px] text-muted">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="mt-2 h-9 bg-transparent text-[16px] text-ink focus-visible:outline-none"
      >
        {children}
      </select>
    </div>
  );
}
