import {Router} from 'express';
import { createSupplier, getSuppliers } from '../controllers/suppliersController.js';



const router = Router();
router.get("/", getSuppliers);
router.post("/", createSupplier)


export default router;