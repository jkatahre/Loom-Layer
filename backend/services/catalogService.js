/**
 * Catalogue data access. Replace the in-memory arrays with database queries.
 * Each function matches a function in frontend/src/services/productService.ts.
 */
const products = [];
const categories = [];

export const catalogService = {
  listProducts: async () => products,
  getProductBySlug: async (slug) => products.find((p) => p.slug === slug) ?? null,
  listCategories: async () => categories,
};
