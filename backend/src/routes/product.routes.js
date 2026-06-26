import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/:slug', productController.getProductBySlug);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
