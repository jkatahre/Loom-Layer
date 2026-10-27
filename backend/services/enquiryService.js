/** Stores enquiries so the showroom has a record alongside WhatsApp. In-memory placeholder. */
const enquiries = [];

export const enquiryService = {
  create: async (payload) => {
    const record = { id: `enq_${Date.now().toString(36)}`, ...payload, created_at: new Date().toISOString() };
    enquiries.unshift(record);
    return record;
  },
  list: async () => enquiries,
};
