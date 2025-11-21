import { Router } from 'express';
import * as auditController from '../controllers/audit.controller.js';

const router = Router();

// Audit routes wired to controller (MVC)
router.get('/', auditController.index);
router.get('/list', auditController.listAudits);

export default router;