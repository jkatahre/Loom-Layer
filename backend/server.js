/**
 * Loom & Layer — placeholder API.
 *
 * The frontend runs entirely on local demo data and does NOT need this server.
 * It exists so a real API can grow here with the same shape the frontend's
 * service layer expects (see README › Future API integration).
 *
 *   npm run dev:backend      → http://localhost:4000/api/health
 */
import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

app.listen(config.port, () => logger.info(`Loom & Layer API listening on http://localhost:${config.port}`));
