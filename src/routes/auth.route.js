import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// Auth routes wired to controller (MVC)
router.get('/', authController.index);
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;