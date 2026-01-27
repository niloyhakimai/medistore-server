import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Create Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { items, address } = req.body; // items = [{ medicineId, quantity }]
        const userId = (req as any).user.userId;

        // Calculate Total Price (Backend calculation is safer)
        let totalAmount = 0;
        
        // We need to fetch medicine details to get the price
        for (const item of items) {
            const medicine = await prisma.medicine.findUnique({
                where: { id: item.medicineId }
            });
            if (medicine) {
                totalAmount += medicine.price * item.quantity;
            }
        }

        // Create Order in Database
        const newOrder = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                address,
                status: "PENDING",
                items: {
                    create: items.map((item: any) => ({
                        medicineId: item.medicineId,
                        quantity: item.quantity,
                        price: 0 // For now simpler, ideally fetch real price
                    }))
                }
            }
        });

        res.status(201).json({ message: "Order placed successfully!", data: newOrder });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to place order", error });
    }
};

// 2. Get My Orders
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { medicine: true } } } // Show medicine details
        });

        res.status(200).json({ data: orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};