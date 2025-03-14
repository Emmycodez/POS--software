import {Router} from 'express'
import { getPosProducts } from '../controllers/posControllers.js'

const router = Router();


router.get("/", getPosProducts)

export default router;