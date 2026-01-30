import express from 'express';
import { addMedicine, getAllMedicines, getMedicineById } from '../controllers/medicineController';
import { authenticate, authorizeSeller } from '../middlewares/authMiddleware';

const router = express.Router();

// Public Routes
router.get('/', getAllMedicines);
router.get('/:id', getMedicineById); 

// Protected Routes (Seller Only)
router.post('/', authenticate, authorizeSeller, addMedicine);

export default router;