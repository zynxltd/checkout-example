import { Router } from 'express';
import * as authController from '../controllers/authController.js';
const router = Router();
router.get('/login', authController.show);
router.post('/login', authController.submit);
router.post('/logout', authController.logout);
export default router;
