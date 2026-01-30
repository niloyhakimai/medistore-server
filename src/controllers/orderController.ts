import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Create Order
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, address } = req.body;
        const userId = (req as any).user.userId;

        // Calculate Total Price
        let totalAmount = 0;
        const orderItemsData = []; // To store items with fetched prices

        for (const item of items) {
            const medicine = await prisma.medicine.findUnique({
                where: { id: item.medicineId }
            });
            if (medicine) {
                totalAmount += medicine.price * item.quantity;
                // Prepare item data for creation
                orderItemsData.push({
                    medicineId: item.medicineId,
                    quantity: item.quantity,
                    price: medicine.price // Save the actual price at time of order
                });
            }
        }

        // Create Order in Database
        const newOrder = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                address,
                status: "PLACED", // ✅ FIX: Updated from PENDING to PLACED
                items: {
                    create: orderItemsData // ✅ FIX: Using prepared data with correct prices
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
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { medicine: true } } },
            orderBy: { createdAt: 'desc' } // Newest first
        });

        res.status(200).json({ data: orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};

// 3. Cancel Order (Customer)
export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const userId = (req as any).user.userId;

        // ✅ FIX: 'as string' added to fix type error
        const order = await prisma.order.findUnique({ where: { id: orderId as string } });

        if (!order || order.userId !== userId) {
             res.status(404).json({ message: "Order not found" });
             return;
        }

        // ✅ FIX: Checking against PLACED as per new schema
        if (order.status !== "PLACED") {
             res.status(400).json({ message: "Order cannot be cancelled now" });
             return;
        }

        await prisma.order.update({
            where: { id: orderId as string },
            data: { status: "CANCELLED" }
        });

        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to cancel order", error });
    }
};