// The one form island (plan §3e), in configurations: `book` (/book) and `general` (topics + extra fields).
// Phase 2 adds part request and insurance claim. A real <form method="post"> to Web3Forms, so it works
// without JS (Web3Forms redirects to /thanks); with JS it submits in place. Never asks for SIN, DOB or banking.
import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from 'react';
import { validateLead } from '../../lib/validate';

export interface ExtraField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  hint?: string;
  inputMode?: 'text' | 'numeric' | 'decimal';
}

export interface ServiceOption { id: string; name: string }

export interface LeadFormProps {
  kind?: 'general' | 'book';
  accessKey?: string;
  subject: string;
  redirectUrl: string;
  phoneDisplay: string;
  privacyHref?: string;
  submitLabel?: string;
  // general
  topics?: string[];
  defaultTopic?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  /** Up to three extra fields (keeps the form short, plan §1 row 5). */
  extraFields?: ExtraField[];
  // book
  services?: ServiceOption[];
  siblingName?: string;
}

// The pick-up request form on the current site lists these types (docs/site-capture, "Pick up").
const VEHICLE_TYPES = ['Travel trailer', 'Fifth wheel', 'Motorhome', 'Tent trailer', 'Other'];

const telOf = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

export default function LeadForm(p: LeadFormProps) {
  const id = useId();
  const kind = p.kind ?? 'general';
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Browser validation only applies until React takes over (no-JS visitors still get the required checks).
  const [hydrated, setHydrated] = useState(false);
  const [focusError, setFocusError] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [handover, setHandover] = useState<'drop-off' | 'pick-up'>('drop-off');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setHydrated(true);
    // A service page links to /book?service=<id>; tick that service.
    const wanted = new URLSearchParams(window.location.search).getAll('service');
    const known = new Set(p.services?.map((s) => s.id));
    const pre = wanted.filter((w) => known.has(w));
    if (pre.length) setPicked(new Set(pre));
  }, []);
  // Move focus only after the error text and aria-invalid have rendered, so screen readers announce them.
  useEffect(() => {
    if (focusError) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusError]);

  // No form key in this build: a form that can't send would lose the lead, so show how to reach us instead.
  if (!p.accessKey) {
    return (
      <div className="rounded border-2 border-rule bg-white p-5">
        <p className="m-0 text-lead font-semibold">Call us and we’ll take it from there.</p>
        <p className="mt-2">Our online form isn’t switched on yet. The shop answers at <a href={telOf(p.phoneDisplay)} className="font-semibold">{p.phoneDisplay}</a>.</p>
        <a href={telOf(p.phoneDisplay)} className="btn btn-primary mt-3 tabular">Call {p.phoneDisplay}</a>
      </div>
    );
  }

  async function onSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    const form = e.currentTarget;
    const data = new FormData(form);
    const str = (k: string) => String(data.get(k) ?? '');
    const next = validateLead({
      name: str('name'),
      phone: str('phone'),
      email: str('email'),
      year: str('vehicle_year'),
      consent: kind === 'book' ? data.get('consent') === 'yes' : undefined,
    });
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
        <p className="mt-2">
          {kind === 'book' ? 'This is a request, not a confirmed booking. We’ll call you to confirm.' : 'We’ll get back to you.'}{' '}
          If it’s urgent, call <a href={telOf(p.phoneDisplay)} className="font-semibold">{p.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  const field = 'block w-full min-h-12 rounded border-2 border-slate/40 bg-white px-3 py-2 text-[1.0625rem] text-ink';
  const label = 'mb-1 block font-semibold text-ink';
  const legend = 'mb-2 block font-semibold text-ink';
  const optional = <span className="font-normal text-slate-60">(optional)</span>;
  const err = (k: string) => errors[k] && <p id={`${id}-${k}-err`} className="m-0 mt-1 font-semibold text-red">{errors[k]}</p>;
  const invalid = (k: string) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${k}-err` } : {});
  const check = (name: string, value: string, text: ReactNode, extra: object = {}) => (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
      <input type="checkbox" name={name} value={value} className="mt-0.5 size-5 shrink-0 accent-red" {...extra} />
      <span>{text}</span>
    </label>
  );
  const radio = (name: string, value: string, text: ReactNode, extra: object = {}) => (
    <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2">
      <input type="radio" name={name} value={value} className="size-5 shrink-0 accent-red" {...extra} />
      {text}
    </label>
  );

  return (
    <form ref={formRef} action="https://api.web3forms.com/submit" method="post" onSubmit={onSubmit} noValidate={hydrated}
      className="grid gap-5 sm:grid-cols-2">
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="m-0 font-semibold text-red sm:col-span-2">
          Please check {Object.keys(errors).length === 1 ? 'the field' : `the ${Object.keys(errors).length} fields`} marked below.
        </p>
      )}
      <input type="hidden" name="access_key" value={p.accessKey} />
      <input type="hidden" name="subject" value={p.subject} />
      <input type="hidden" name="from_name" value="Vacations on Wheels website" />
      <input type="hidden" name="redirect" value={p.redirectUrl} />
      {/* Honeypot: people never see or fill this. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

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

      {kind === 'book' && (
        <>
          <fieldset className="m-0 border-0 p-0 sm:col-span-2">
            <legend className={legend}>How should we reach you?</legend>
            <div className="flex flex-wrap gap-x-6">
              {['Phone call', 'Text message', 'Email'].map((t, i) => radio('preferred_contact', t, t, { defaultChecked: i === 0 }))}
            </div>
          </fieldset>

          <fieldset className="m-0 grid gap-4 border-0 p-0 sm:col-span-2 sm:grid-cols-2">
            <legend className="mb-2 font-[family-name:var(--font-display)] text-[1.5rem] font-bold text-ink">Your RV</legend>
            <div>
              <label htmlFor={`${id}-type`} className={label}>Type {optional}</label>
              <select id={`${id}-type`} name="vehicle_type" className={field} defaultValue="">
                <option value="">Choose one</option>
                {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-year`} className={label}>Year {optional}</label>
              <input id={`${id}-year`} name="vehicle_year" inputMode="numeric" maxLength={4} className={field} {...invalid('year')} />
              {err('year')}
            </div>
            <div>
              <label htmlFor={`${id}-make`} className={label}>Make {optional}</label>
              <input id={`${id}-make`} name="vehicle_make" className={field} />
            </div>
            <div>
              <label htmlFor={`${id}-model`} className={label}>Model {optional}</label>
              <input id={`${id}-model`} name="vehicle_model" className={field} />
            </div>
          </fieldset>

          {p.services && p.services.length > 0 && (
            <fieldset className="m-0 border-0 p-0 sm:col-span-2">
              <legend className={legend}>What does it need? <span className="font-normal text-slate-60">(tick any; not sure is fine)</span></legend>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {p.services.map((s) => (
                  <div key={s.id}>
                    {check(`service_${s.id.replace(/-/g, '_')}`, s.name, s.name, {
                      checked: picked.has(s.id),
                      onChange: (e: ChangeEvent<HTMLInputElement>) => {
                        const next = new Set(picked);
                        if (e.target.checked) next.add(s.id); else next.delete(s.id);
                        setPicked(next);
                      },
                    })}
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="m-0 border-0 p-0 sm:col-span-2">
            <legend className={legend}>Getting it to us</legend>
            <div className="flex flex-wrap gap-x-6">
              {radio('handover', 'I’ll drop it off', 'I’ll drop it off', {
                checked: handover === 'drop-off', onChange: () => setHandover('drop-off'),
              })}
              {radio('handover', 'Please pick it up', 'Please pick it up (a pick-up fee applies)', {
                checked: handover === 'pick-up', onChange: () => setHandover('pick-up'),
              })}
            </div>
            {(!hydrated || handover === 'pick-up') && (
              <div className="mt-3">
                <label htmlFor={`${id}-pickup`} className={label}>Where should we pick it up? {optional}</label>
                <input id={`${id}-pickup`} name="pickup_address" autoComplete="street-address" className={field}
                  aria-describedby={`${id}-pickup-hint`} />
                <p id={`${id}-pickup-hint`} className="m-0 mt-1 text-[0.9375rem] text-slate-60">Street address and town. We tell you the pick-up cost when we call.</p>
              </div>
            )}
          </fieldset>

          <div>
            <label htmlFor={`${id}-week`} className={label}>When would suit you? {optional}</label>
            <input id={`${id}-week`} name="preferred_date" type="date" className={field} aria-describedby={`${id}-week-hint`} />
            <p id={`${id}-week-hint`} className="m-0 mt-1 text-[0.9375rem] text-slate-60">Pick any day in the week you’d like. We’ll confirm the day when we call.</p>
          </div>
        </>
      )}

      {kind === 'general' && p.topics && p.topics.length > 0 && (
        <fieldset className="m-0 border-0 p-0 sm:col-span-2">
          <legend className={legend}>What can we help with?</legend>
          <div className="flex flex-wrap gap-x-6">
            {p.topics.map((t) => radio('topic', t, t, { defaultChecked: t === (p.defaultTopic ?? p.topics![0]) }))}
          </div>
        </fieldset>
      )}

      {kind === 'general' && p.extraFields?.slice(0, 3).map((f) => (
        <div key={f.name}>
          <label htmlFor={`${id}-${f.name}`} className={label}>{f.label} {optional}</label>
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
        <label htmlFor={`${id}-message`} className={label}>
          {kind === 'book' ? 'What’s going on with it?' : (p.messageLabel ?? 'Message')} {optional}
        </label>
        <textarea id={`${id}-message`} name="message" rows={4} className={field}
          placeholder={kind === 'book' ? 'For example: the fridge won’t cool on propane, and we’d like it winterized too.' : p.messagePlaceholder} />
        {kind === 'book' && (
          <p className="m-0 mt-1 text-[0.9375rem] text-slate-60">Photos help. Once we call you, we’ll tell you where to send them.</p>
        )}
      </div>

      {kind === 'book' && (
        <div className="sm:col-span-2">
          {p.siblingName && check('bought_at_sibling', 'yes', `I bought it at ${p.siblingName}`)}
          {check('consent', 'yes', 'It’s OK to contact me about this request by phone, text or email.', {
            required: true, ...invalid('consent'),
          })}
          {err('consent')}
        </div>
      )}

      <div className="sm:col-span-2">
        {kind === 'book' && (
          <p className="m-0 mb-4 rounded border-l-4 border-accent bg-paper px-4 py-3 font-semibold text-ink">
            This is a request, not a confirmed booking. We’ll call you to confirm.
          </p>
        )}
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
