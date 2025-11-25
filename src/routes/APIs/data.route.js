import { Router } from 'express';
import * as dataController from '../../controllers/data.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Data routes wired to controller (MVC)
router.get('/', dataController.index);
router.get('/vaults', dataController.listVaults);

export default router;