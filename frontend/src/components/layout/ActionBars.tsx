import { store } from '../../config/store';
import { useEnquiry } from '../../contexts/EnquiryContext';
import { quickWhatsAppUrl } from '../../services/enquiryService';
import { Icon } from '../ui/Icon';

/** Sticky Call / WhatsApp / Enquire bar on mobile. */
export function MobileActionBar() {
  const { openEnquiry } = useEnquiry();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <a href={`tel:${store.contact.phone}`} className="btn btn-outline btn-sm min-h-11">
          <Icon name="phone" size={17} /> Call
        </a>
        <a href={quickWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm min-h-11">
          <Icon name="whatsapp" size={17} /> WhatsApp
        </a>
        <button type="button" className="btn btn-primary btn-sm min-h-11" onClick={() => openEnquiry({ kind: 'general' })}>
          <Icon name="chat" size={17} /> Enquire
        </button>
      </div>
    </div>
  );
}

/** Floating WhatsApp button on desktop. */
export function FloatingWhatsApp() {
  return (
    <a
      href={quickWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-6 bottom-6 z-30 hidden items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-lift transition-all hover:bg-whatsapp-dark md:flex"
      aria-label="Chat with us on WhatsApp"
    >
      <Icon name="whatsapp" size={26} />
      <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 group-focus-visible:max-w-40">
        Chat with us
      </span>
    </a>
  );
}
