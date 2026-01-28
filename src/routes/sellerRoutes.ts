import express from 'express';
import { addMedicine, getMyMedicines, updateOrderStatus } from '../controllers/sellerController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();


router.post('/medicines', authenticate, addMedicine);
router.get('/medicines', authenticate, getMyMedicines);
router.patch('/orders/:orderId', authenticate, updateOrderStatus); // Update Status

export default router;