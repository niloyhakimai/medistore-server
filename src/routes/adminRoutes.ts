import express from 'express';
import { getAdminStats, getAllUsers, toggleUserBan } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware'; 
const router = express.Router();

// 'authorizeAdmin' 
router.get('/stats', authenticate, authorizeAdmin, getAdminStats);
router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.patch('/users/:userId', authenticate, authorizeAdmin, toggleUserBan); // Ban/Unban user

export default router;