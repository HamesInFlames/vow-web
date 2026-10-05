// The one lead form (plan D12, §1b #3). A real <form method="post"> to Web3Forms, so it works without JS
// (Web3Forms redirects to /thanks); with JS it submits in place. Never asks for SIN, DOB or banking details.
import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';

export interface ExtraField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  hint?: string;
  inputMode?: 'text' | 'numeric' | 'decimal';
}

export interface LeadFormProps {
  accessKey?: string;
  subject: string;
  redirectUrl: string;
  topics?: string[];
  defaultTopic?: string;
  stockNumber?: string;
  unitTitle?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  phoneDisplay: string;
  privacyHref?: string;
  /** Up to three extra fields (keeps the form at 8 fields or fewer, plan D12). */
  extraFields?: ExtraField[];
  submitLabel?: string;
}

export default function LeadForm(p: LeadFormProps) {
  const id = useId();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Browser validation only applies until React takes over (no-JS visitors still get the required checks).
  const [hydrated, setHydrated] = useState(false);
  const [focusError, setFocusError] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => setHydrated(true), []);
  // Move focus only after the error text and aria-invalid have rendered, so screen readers announce them.
  useEffect(() => {
    if (focusError) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusError]);

  // No form key in this build: a form that can't send would lose the lead, so show how to reach us instead.
  if (!p.accessKey) {
    const tel = `tel:+1${p.phoneDisplay.replace(/\D/g, '')}`;
    return (
      <div className="rounded border-2 border-rule bg-white p-5">
        <p className="m-0 text-lead font-semibold">Call us and we’ll take it from there.</p>
        <p className="mt-2">Our online form isn’t switched on yet. The sales desk answers at <a href={tel} className="font-semibold">{p.phoneDisplay}</a>.</p>
        <a href={tel} className="btn btn-primary mt-3 tabular">Call {p.phoneDisplay}</a>
      </div>
    );
  }

  async function onSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};
    if (!String(data.get('name') ?? '').trim()) next.name = 'Please tell us your name.';
    const phone = String(data.get('phone') ?? '').replace(/\D/g, '');
    const email = String(data.get('email') ?? '').trim();
    if (!phone && !email) next.phone = 'Please give us a phone number or an email so we can reply.';
    if (phone && phone.length < 10) next.phone = 'That phone number looks short. Include the area code.';
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'That email address doesn’t look right.';
    setErrors(next);
    e.preventDefault();
    if (Object.keys(next).length) {
      setFocusError((n) => n + 1);
      return;
    }
    setState('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      setState(json.success ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded border-2 border-ok bg-white p-5" role="status">
        <p className="m-0 text-lead font-semibold">Thanks, we got it.</p>
        <p className="mt-2">We call back within one business day. If it’s urgent, call <a href={`tel:+1${p.phoneDisplay.replace(/\D/g, '')}`} className="font-semibold">{p.phoneDisplay}</a>.</p>
      </div>
    );
  }

  const field = 'block w-full min-h-12 rounded border-2 border-slate/40 bg-white px-3 py-2 text-[1.0625rem] text-ink';
  const label = 'mb-1 block font-semibold text-ink';
  const err = (k: string) => errors[k] && <p id={`${id}-${k}-err`} className="m-0 mt-1 font-semibold text-red">{errors[k]}</p>;
  const invalid = (k: string) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${k}-err` } : {});

  return (
    <form ref={formRef} action="https://api.web3forms.com/submit" method="post" onSubmit={onSubmit} noValidate={hydrated}
      className="grid gap-4 sm:grid-cols-2">
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="m-0 font-semibold text-red sm:col-span-2">
          Please check {Object.keys(errors).length === 1 ? 'the field' : `the ${Object.keys(errors).length} fields`} marked below.
        </p>
      )}
      <input type="hidden" name="access_key" value={p.accessKey ?? ''} />
      <input type="hidden" name="subject" value={p.subject} />
      <input type="hidden" name="from_name" value="Vacations on Wheels website" />
      <input type="hidden" name="redirect" value={p.redirectUrl} />
      {p.stockNumber && <input type="hidden" name="stock_number" value={p.stockNumber} />}
      {p.unitTitle && <input type="hidden" name="unit" value={p.unitTitle} />}
      {/* Honeypot: people never see or fill this. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {p.unitTitle && (
        <p className="m-0 sm:col-span-2">About: <strong>{p.unitTitle}</strong>{p.stockNumber && <> (stock {p.stockNumber})</>}</p>
      )}

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-name`} className={label}>Your name</label>
        <input id={`${id}-name`} name="name" autoComplete="name" required className={field} {...invalid('name')} />
        {err('name')}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className={label}>Phone</label>
        <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} {...invalid('phone')} />
        {err('phone')}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className={label}>Email <span className="font-normal text-slate-60">(optional if you gave a phone)</span></label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={field} {...invalid('email')} />
        {err('email')}
      </div>

      {p.topics && p.topics.length > 0 && (
        <fieldset className="m-0 border-0 p-0 sm:col-span-2">
          <legend className={label}>What can we help with?</legend>
          <div className="flex flex-wrap gap-x-6">
            {p.topics.map((t) => (
              <label key={t} className="flex min-h-11 cursor-pointer items-center gap-2">
                <input type="radio" name="topic" value={t} defaultChecked={t === (p.defaultTopic ?? p.topics![0])} className="size-5 accent-red" />
                {t}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {p.extraFields?.slice(0, 3).map((f) => (
        <div key={f.name}>
          <label htmlFor={`${id}-${f.name}`} className={label}>
            {f.label} <span className="font-normal text-slate-60">(optional)</span>
          </label>
          {f.type === 'select' ? (
            <select id={`${id}-${f.name}`} name={f.name} className={field} defaultValue="">
              <option value="">Choose one</option>
              {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input id={`${id}-${f.name}`} name={f.name} inputMode={f.inputMode} className={field}
              aria-describedby={f.hint ? `${id}-${f.name}-hint` : undefined} />
          )}
          {f.hint && <p id={`${id}-${f.name}-hint`} className="m-0 mt-1 text-[0.9375rem] text-slate-60">{f.hint}</p>}
        </div>
      ))}

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={label}>{p.messageLabel ?? 'Message'} <span className="font-normal text-slate-60">(optional)</span></label>
        <textarea id={`${id}-message`} name="message" rows={4} className={field} placeholder={p.messagePlaceholder} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
        <input type="checkbox" name="best_time_text_ok" value="yes" className="mt-1 size-5 shrink-0 accent-red" />
        <span>It’s fine to text me at this number about this request.</span>
      </label>

      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary min-w-48 text-lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : (p.submitLabel ?? 'Send')}
        </button>
        {state === 'error' && (
          <p className="m-0 mt-3 font-semibold text-red" role="alert">
            That didn’t go through. Please call us at {p.phoneDisplay}, or try again.
          </p>
        )}
        <p className="m-0 mt-3 text-[0.9375rem] text-slate-60">
          We use your details only to answer this request.{' '}
          {p.privacyHref && <a href={p.privacyHref}>How we handle your information</a>}
        </p>
      </div>
    </form>
  );
}
