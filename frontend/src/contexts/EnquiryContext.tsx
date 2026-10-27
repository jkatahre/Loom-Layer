import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { EnquiryDialog } from '../components/EnquiryDialog';
import type { EnquiryKind } from '../types/store';

/** What a page passes when it opens the shared enquiry dialog. */
export interface EnquiryRequest {
  kind: EnquiryKind;
  product?: string;
  fabric?: string;
  price?: string;
  size?: string;
  details?: string[];
  /** Absolute page link added to the message; defaults to the current URL. */
  link?: string;
}

interface EnquiryContextValue {
  openEnquiry: (request: EnquiryRequest) => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<EnquiryRequest | null>(null);
  const openEnquiry = useCallback((r: EnquiryRequest) => setRequest({ link: window.location.href, ...r }), []);
  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);
  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryDialog request={request} onClose={() => setRequest(null)} />
    </EnquiryContext.Provider>
  );
}

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>');
  return ctx;
}
