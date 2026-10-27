import { useId, useState, type FormEvent } from 'react';
import { isSampleWhatsapp, store } from '../config/store';
import type { EnquiryRequest } from '../contexts/EnquiryContext';
import { buildEnquiryMessage, ENQUIRY_LABELS, send, type EnquiryPayload, type SendResult } from '../services/enquiryService';
import type { EnquiryKind } from '../types/store';
import { cn } from '../utils/cn';
import { Icon } from './ui/Icon';

const CITY_REQUIRED: EnquiryKind[] = ['price', 'custom_quote', 'fabric_sample', 'measurement', 'installation'];
const DATE_KINDS: EnquiryKind[] = ['measurement', 'installation', 'showroom_visit'];
const SELECTABLE_KINDS: EnquiryKind[] = ['general', 'custom_quote', 'fabric_sample', 'measurement', 'installation', 'showroom_visit'];

interface EnquiryFormProps {
  request: EnquiryRequest;
  /** Show a selector so the customer can change the enquiry type (contact page). */
  allowKindChange?: boolean;
  onSent?: (result: SendResult) => void;
  className?: string;
}

/**
 * The single enquiry form used across the site. Validates the customer's
 * details, previews the WhatsApp message and hands it to `send()`.
 */
export function EnquiryForm({ request, allowKindChange, onSent, className }: EnquiryFormProps) {
  const uid = useId();
  const [kind, setKind] = useState<EnquiryKind>(request.kind);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  const cityRequired = CITY_REQUIRED.includes(kind);
  const errors = {
    name: name.trim().length < 2 ? 'Please enter your name.' : null,
    city: cityRequired && city.trim().length < 2 ? 'Please enter your city or area.' : null,
  };
  const valid = !errors.name && !errors.city;

  const payload: EnquiryPayload = {
    kind,
    name: name.trim(),
    city: city.trim(),
    product: request.product,
    fabric: request.fabric,
    price: request.price,
    size: request.size,
    details: request.details,
    message,
    preferredDate: date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined,
    link: request.link,
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const r = send(payload);
    setResult(r);
    onSent?.(r);
  };

  if (result) {
    return (
      <div className={cn('text-center', className)} role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#E7F7EE] text-whatsapp-dark">
          <Icon name="whatsapp" size={28} />
        </span>
        <h3 className="mt-4 text-xl">{result.opened ? 'WhatsApp has opened' : 'Open WhatsApp to send'}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Your message is ready in WhatsApp. <strong className="text-ink">Please press Send in WhatsApp</strong> — we only receive your
          enquiry once you send it there.
        </p>
        <a href={result.url} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-5">
          <Icon name="whatsapp" /> {result.opened ? 'Open WhatsApp again' : 'Open WhatsApp'}
        </a>
        <button type="button" className="btn btn-ghost mt-2 w-full" onClick={() => setResult(null)}>
          Edit message
        </button>
      </div>
    );
  }

  const fieldError = (msg: string | null, id: string) =>
    touched && msg ? (
      <p id={id} className="mt-1.5 text-xs font-medium text-sale">
        {msg}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className={cn('space-y-4', className)}>
      {allowKindChange && (
        <div>
          <label htmlFor={`${uid}-kind`} className="mb-1.5 block text-sm font-medium">
            What can we help with?
          </label>
          <select id={`${uid}-kind`} className="field" value={kind} onChange={(e) => setKind(e.target.value as EnquiryKind)}>
            {SELECTABLE_KINDS.map((k) => (
              <option key={k} value={k}>
                {ENQUIRY_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
      )}

      {(request.product || request.details?.length) && (
        <div className="rounded-xl bg-surface p-4 text-sm">
          <p className="eyebrow mb-2 text-[10px]">Included in your message</p>
          <dl className="space-y-1">
            {request.product && <Row k="Design" v={request.product} />}
            {request.fabric && <Row k="Fabric" v={request.fabric} />}
            {request.size && <Row k="Size" v={request.size} />}
            {request.price && <Row k="Price" v={request.price} />}
            {request.details?.map((d) => {
              const [k, ...v] = d.split(': ');
              return v.length ? <Row key={d} k={k!} v={v.join(': ')} /> : <p key={d} className="text-muted">{d}</p>;
            })}
          </dl>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-medium">
            Your name <span className="text-sale" aria-hidden="true">*</span>
          </label>
          <input
            id={`${uid}-name`}
            data-autofocus
            className="field"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={touched && !!errors.name}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            required
          />
          {fieldError(errors.name, `${uid}-name-err`)}
        </div>
        <div>
          <label htmlFor={`${uid}-city`} className="mb-1.5 block text-sm font-medium">
            City / area {cityRequired ? <span className="text-sale" aria-hidden="true">*</span> : <span className="text-muted">(optional)</span>}
          </label>
          <input
            id={`${uid}-city`}
            className="field"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-invalid={touched && !!errors.city}
            aria-describedby={errors.city ? `${uid}-city-err` : undefined}
            required={cityRequired}
          />
          {fieldError(errors.city, `${uid}-city-err`)}
        </div>
      </div>

      {DATE_KINDS.includes(kind) && (
        <div>
          <label htmlFor={`${uid}-date`} className="mb-1.5 block text-sm font-medium">
            Preferred date <span className="text-muted">(optional)</span>
          </label>
          <input id={`${uid}-date`} type="date" className="field" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-msg`} className="mb-1.5 block text-sm font-medium">
          Message <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id={`${uid}-msg`}
          rows={3}
          className="field resize-y"
          placeholder={kind === 'custom_quote' ? 'Number of windows, rod type, anything we should know…' : 'Anything you would like us to know'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <details className="group rounded-xl border border-line text-sm">
        <summary className="flex min-h-11 items-center justify-between px-4 font-medium">
          Preview WhatsApp message
          <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap border-t border-line px-4 py-3 font-sans text-xs text-muted">{buildEnquiryMessage(payload)}</pre>
      </details>

      <button type="submit" className="btn btn-whatsapp w-full">
        <Icon name="whatsapp" /> Continue on WhatsApp
      </button>
      <p className="text-center text-xs text-muted">
        WhatsApp will open with your message filled in — you send it yourself. {store.identity.name} does not store this form.
        {isSampleWhatsapp && import.meta.env.DEV && <span className="mt-1 block text-sale">Demo: a sample WhatsApp number is configured.</span>}
      </p>
    </form>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-muted">{k}</dt>
      <dd className="min-w-0 font-medium text-ink">{v}</dd>
    </div>
  );
}
