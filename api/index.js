/** Vercel serverless entry: serves the backend Express app at /api/*. Env vars come from the Vercel project settings. */
import { app } from '../backend/app.js';

export default app;
