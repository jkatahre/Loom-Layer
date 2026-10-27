/** Express app shared by the local server (server.js) and the Vercel function (api/index.js). */
import express from 'express';
import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiRouter } from './routes/index.js';

export const app = express();

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
