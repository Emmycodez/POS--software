import {Router} from 'express';
import { getInventory, UpdateInventory } from '../controllers/inventoryControllers.js';


const router = Router();
router.get("/", getInventory);
router.post('/', UpdateInventory)

export default router;