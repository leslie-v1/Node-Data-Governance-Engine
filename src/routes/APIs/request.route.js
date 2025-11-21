import { Router } from 'express';
import * as requestController from '../../controllers/request.controller.js';

const router = Router();

// Request routes wired to controller (MVC)
router.get('/', requestController.index);
router.post('/', requestController.createRequest);

export default router;