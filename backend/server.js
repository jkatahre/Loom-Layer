/**
 * Loom & Layer — placeholder API.
 *
 * The frontend runs entirely on local demo data and does NOT need this server.
 * It exists so a real API can grow here with the same shape the frontend's
 * service layer expects (see README › Future API integration).
 *
 *   npm run dev:backend      → http://localhost:4000/api/health
 */
import express from 'express';
import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiRouter } from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(requestLogger);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => logger.info(`Loom & Layer API listening on http://localhost:${config.port}`));
