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

// Customer can only cancel if it's still PLACED
export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const userId = (req as any).user.userId;

        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order || order.userId !== userId) {
             res.status(404).json({ message: "Order not found" });
             return;
        }

        if (order.status !== "PLACED") {
             res.status(400).json({ message: "Order cannot be cancelled now" });
             return;
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" }
        });

        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to cancel order", error });
    }
};