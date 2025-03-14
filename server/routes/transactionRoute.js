import {Router} from 'express'
import { createTransaction } from '../controllers/TransactionControllers.js'

const router = Router();

router.post('/', createTransaction)

export default router;