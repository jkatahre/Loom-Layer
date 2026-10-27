import { Router } from 'express';
import { catalogController } from '../controllers/catalogController.js';
import { enquiryController } from '../controllers/enquiryController.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => res.json({ ok: true, service: 'loom-and-layer-api' }));
apiRouter.get('/products', catalogController.products);
apiRouter.get('/products/:slug', catalogController.product);
apiRouter.get('/categories', catalogController.categories);
apiRouter.post('/enquiries', enquiryController.create);
