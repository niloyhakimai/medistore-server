import express from 'express';
import { addMedicine, getMyMedicines, updateOrderStatus, getSellerOrders } from '../controllers/sellerController';
import { authenticate, authorizeSeller } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Middleware Order:  (authenticate),(authorizeSeller)
router.post('/medicines', authenticate, authorizeSeller, addMedicine);
router.get('/medicines', authenticate, authorizeSeller, getMyMedicines);
router.patch('/orders/:orderId', authenticate, authorizeSeller, updateOrderStatus);
router.get('/orders', authenticate, authorizeSeller, getSellerOrders);

export default router;