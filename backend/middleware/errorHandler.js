import { logger } from '../utils/logger.js';

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  logger.error(err.stack ?? err.message);
  res.status(err.status ?? 500).json({ error: err.expose ? err.message : 'Internal server error' });
}
