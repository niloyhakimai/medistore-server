import express from 'express';
import { addMedicine, getAllMedicines } from '../controllers/medicineController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, addMedicine); // 🔒 only logged in users
router.get('/', getAllMedicines); // 🔓 public

export default router;