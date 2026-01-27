import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Add Medicine (Private - Seller)
export const addMedicine = async (req: Request, res: Response) => {
    try {
        const { name, price, description, categoryId, expiryDate, manufacturer, stock } = req.body;
        const userId = (req as any).user.userId; // Get logged in user ID

        const newMedicine = await prisma.medicine.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                expiryDate: new Date(expiryDate), // Convert string to Date
                manufacturer,
                stock: parseInt(stock),
                categoryId,
                sellerId: userId
            }
        });

        res.status(201).json({ message: "Medicine added successfully", data: newMedicine });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add medicine", error });
    }
};

// 2. Get All Medicines (Public)
export const getAllMedicines = async (req: Request, res: Response) => {
    try {
        const medicines = await prisma.medicine.findMany({
            include: { category: true } // Include category details
        });
        res.status(200).json({ data: medicines });
    } catch (error) {
        res.status(500).json({ message: "Error fetching medicines", error });
    }
};