import express from 'express';
import { getAdminStats } from '../controllers/adminController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();


router.get('/stats', authenticate, getAdminStats);

export default router;