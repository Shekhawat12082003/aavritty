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
  const prisma = (await import('../config/database.js')).default;

  const where = { isActive: true }; // Only show active products to customers
  if (category) {
    where.category = {
      slug: { contains: category, mode: 'insensitive' },
    };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (featured === 'true') {
    where.isFeatured = true;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
          },
        },
        inventory: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const prisma = (await import('../config/database.js')).default;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },
      inventory: true,
      images: true,
    },
  });

  if (!product) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }
  res.status(200).json(new ApiResponse(200, product));
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;

  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      category: true,
      brand: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },
      inventory: true,
    },
    take: 12,
  });

  res.status(200).json(new ApiResponse(200, featured));
});

export const getCategories = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  res.status(200).json(new ApiResponse(200, categories));
});

export const createProduct = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const {
    vendorId,
    categoryId,
    brandId,
    name,
    slug,
    sku,
    description,
    shortDescription,
    price,
    wholesalePrice,
    mrp,
    gstRate,
    minOrderQty,
    unit,
    isActive,
    isFeatured,
  } = req.body;

  const product = await prisma.product.create({
    data: {
      vendorId,
      categoryId,
      brandId,
      name,
      slug,
      sku,
      description,
      shortDescription,
      price: Number(price),
      wholesalePrice: wholesalePrice ? Number(wholesalePrice) : null,
      mrp: mrp ? Number(mrp) : null,
      gstRate: Number(gstRate),
      minOrderQty: Number(minOrderQty),
      unit,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      inventory: {
        create: {
          quantity: 0,
          reservedQty: 0,
          lowStockAlert: 10,
        },
      },
    },
    include: {
      category: true,
      brand: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },
      inventory: true,
    },
  });

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;
  const {
    categoryId,
    brandId,
    name,
    slug,
    sku,
    description,
    shortDescription,
    price,
    wholesalePrice,
    mrp,
    gstRate,
    minOrderQty,
    unit,
    isActive,
    isFeatured,
  } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      categoryId,
      brandId,
      name,
      slug,
      sku,
      description,
      shortDescription,
      price: price ? Number(price) : undefined,
      wholesalePrice: wholesalePrice ? Number(wholesalePrice) : undefined,
      mrp: mrp ? Number(mrp) : undefined,
      gstRate: gstRate ? Number(gstRate) : undefined,
      minOrderQty: minOrderQty ? Number(minOrderQty) : undefined,
      unit,
      isActive,
      isFeatured,
    },
    include: {
      category: true,
      brand: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },
      inventory: true,
    },
  });

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const toggleProductActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
    include: {
      category: true,
      brand: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },
      inventory: true,
    },
  });

  res.status(200).json(new ApiResponse(200, updatedProduct, 'Product status updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;
  
  await prisma.product.delete({ where: { id } });

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});
