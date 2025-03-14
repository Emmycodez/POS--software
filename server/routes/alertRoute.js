import {Router} from 'express';
import { getAlerts, updateAlerts } from '../controllers/alertsController.js';

const router = Router();
router.get('/', getAlerts)
router.post('/', updateAlerts)

export default router;