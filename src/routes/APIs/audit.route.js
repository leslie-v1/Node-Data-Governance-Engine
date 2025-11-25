import { Router } from 'express';
import * as auditController from '../../controllers/audit.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import adminMiddleware from '../../middlewares/admin.middleware.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Apply admin middleware to all audit routes (audits are sensitive)
router.use(adminMiddleware);

// Audit routes wired to controller (MVC)
router.get('/', auditController.index);
router.get('/list', auditController.listAudits);

export default router;