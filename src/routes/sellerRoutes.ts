import express from 'express';
import { addMedicine, getMyMedicines, updateOrderStatus, getSellerOrders,deleteMedicine,updateMedicine } from '../controllers/sellerController';
import { authenticate, authorizeSeller } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Middleware Order:  (authenticate),(authorizeSeller)
router.post('/medicines', authenticate, authorizeSeller, addMedicine);
router.get('/medicines', authenticate, authorizeSeller, getMyMedicines);
router.patch('/orders/:orderId', authenticate, authorizeSeller, updateOrderStatus);
router.get('/orders', authenticate, authorizeSeller, getSellerOrders);
router.delete('/medicines/:id', authenticate, authorizeSeller, deleteMedicine);
router.put('/medicines/:id', authenticate, authorizeSeller, updateMedicine);
export default router;