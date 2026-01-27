import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController';

const router = express.Router();

// Routes
router.post('/', createCategory); // Create
router.get('/', getAllCategories); // Get All

export default router;