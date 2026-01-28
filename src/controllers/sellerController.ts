import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Add Medicine (Linked to Seller)
export const addMedicine = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId; 
        const { name, description, price, stock, manufacturer, expiryDate, categoryId } = req.body;

        const newMedicine = await prisma.medicine.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                manufacturer,
                expiryDate: new Date(expiryDate),
                categoryId,
                sellerId: userId 
            }
        });

        res.status(201).json({ message: "Medicine added successfully", data: newMedicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to add medicine", error });
    }
};

// 2. Get Seller's Medicines
export const getMyMedicines = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const medicines = await prisma.medicine.findMany({
            where: { sellerId: userId },
            include: { category: true }
        });
        res.status(200).json({ data: medicines });
    } catch (error) {
        res.status(500).json({ message: "Error fetching medicines", error });
    }
};

// 3. Update Order Status (Seller Feature)
// Flow: PLACED -> PROCESSING -> SHIPPED -> DELIVERED
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // e.g., "SHIPPED"

        // Valid Status Check
        const validStatuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
             res.status(400).json({ message: "Invalid status" });
             return;
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: status }
        });

        res.status(200).json({ message: "Order status updated", data: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error });
    }
};