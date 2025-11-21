import { Router } from 'express';
import * as dataController from '../../controllers/data.controller.js';

const router = Router();

// Data routes wired to controller (MVC)
router.get('/', dataController.index);
router.get('/vaults', dataController.listVaults);

export default router;