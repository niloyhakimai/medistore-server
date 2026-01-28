import express from 'express';
import { getAdminStats, getAllUsers, toggleUserBan } from '../controllers/adminController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/stats', authenticate, getAdminStats);
router.get('/users', authenticate, getAllUsers); // View all users
router.patch('/users/:userId', authenticate, toggleUserBan); // Ban user

export default router;