import { Router } from 'express';
import * as requestController from '../../controllers/request.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Request routes wired to controller (MVC)
router.get('/', requestController.index);
router.post('/', requestController.createRequest);

export default router;