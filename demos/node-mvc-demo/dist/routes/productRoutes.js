import { Router } from 'express';
import * as productController from '../controllers/productController.js';
const router = Router();
router.get('/', productController.index);
router.get('/:id', productController.show);
export default router;
