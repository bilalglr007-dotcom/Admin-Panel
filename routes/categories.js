import express from 'express';
import categoryController from '../controllers/CategoryController.js';
import { authenticateToken, checkRole } from '../middlewares/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['categories:*', 'auditlogs:*']), categoryController.createCategory);
router.get('/', authenticateToken, cacheMiddleware('categories'), categoryController.getAllCategories);
router.get('/:id', authenticateToken, cacheMiddleware('categories'), categoryController.getCategoryById);
router.put('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['categories:*', 'auditlogs:*']), categoryController.updateCategory);
router.delete('/:id', authenticateToken, checkRole('SUPER_ADMIN'), invalidateCache(['categories:*', 'auditlogs:*']), categoryController.deleteCategory);

export default router;