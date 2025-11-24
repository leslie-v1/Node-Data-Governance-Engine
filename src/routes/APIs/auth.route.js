import authController from '../../controllers/auth.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();


router.post('/register', authController.register);


router.post('/ login', authController.login);

export default router;
