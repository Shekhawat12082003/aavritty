import { ApiResponse } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sampleProducts, sampleCategories } from '../data/sampleProducts.js';

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security: []
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, featured, page = 1, limit = 12 } = req.query;
  let products = [...sampleProducts];

  if (category) {
    products = products.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }
  if (featured === 'true') {
    products = products.filter((p) => p.isFeatured);
  }

  const start = (Number(page) - 1) * Number(limit);
  const paginated = products.slice(start, start + Number(limit));

  res.status(200).json(
    new ApiResponse(200, {
      products: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: products.length,
        totalPages: Math.ceil(products.length / Number(limit)),
      },
    }),
  );
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = sampleProducts.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }
  res.status(200).json(new ApiResponse(200, product));
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = sampleProducts.filter((p) => p.isFeatured);
  res.status(200).json(new ApiResponse(200, featured));
});

export const getCategories = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, sampleCategories));
});

export const createProduct = asyncHandler(async (req, res) => {
  res.status(501).json(new ApiResponse(501, null, 'Product creation available in Phase 2'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  res.status(501).json(new ApiResponse(501, null, 'Product update available in Phase 2'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  res.status(501).json(new ApiResponse(501, null, 'Product deletion available in Phase 2'));
});
