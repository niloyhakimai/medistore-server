import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// All order routes are protected (Login required)
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);

export default router;