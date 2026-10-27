/** Minimal required-field check for request bodies. Replace with zod/joi as the API grows. */
export function requireFields(body, fields) {
  const missing = fields.filter((f) => body?.[f] === undefined || body?.[f] === '');
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(', ')}`);
    err.status = 400;
    err.expose = true;
    throw err;
  }
}
