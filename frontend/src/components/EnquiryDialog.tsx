import type { EnquiryRequest } from '../contexts/EnquiryContext';
import { ENQUIRY_LABELS } from '../services/enquiryService';
import { EnquiryForm } from './EnquiryForm';
import { Dialog } from './ui/Dialog';

const DESCRIPTIONS: Partial<Record<EnquiryRequest['kind'], string>> = {
  price: 'Tell us where you are and we will share our best price on WhatsApp.',
  custom_quote: 'We will check your measurements and confirm the final price.',
  fabric_sample: 'Pick up free swatches at the showroom, or ask us to courier them.',
  measurement: 'Our fitter will visit to measure every window.',
  showroom_visit: 'Let us know when you plan to visit so samples are ready.',
};

/** The one dialog every "Enquire" button on the site opens. */
export function EnquiryDialog({ request, onClose }: { request: EnquiryRequest | null; onClose: () => void }) {
  return (
    <Dialog
      open={request !== null}
      onClose={onClose}
      title={request ? ENQUIRY_LABELS[request.kind] : ''}
      description={request ? (DESCRIPTIONS[request.kind] ?? 'Share a few details and continue on WhatsApp.') : undefined}
    >
      {/* key resets the form whenever a new enquiry is opened */}
      {request && <EnquiryForm key={JSON.stringify(request)} request={request} />}
    </Dialog>
  );
}
