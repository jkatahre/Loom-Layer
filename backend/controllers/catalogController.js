import { catalogService } from '../services/catalogService.js';

export const catalogController = {
  async products(req, res, next) {
    try {
      res.json(await catalogService.listProducts());
    } catch (e) {
      next(e);
    }
  },
  async product(req, res, next) {
    try {
      const product = await catalogService.getProductBySlug(req.params.slug);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (e) {
      next(e);
    }
  },
  async categories(req, res, next) {
    try {
      res.json(await catalogService.listCategories());
    } catch (e) {
      next(e);
    }
  },
};
