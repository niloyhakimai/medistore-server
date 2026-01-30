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

// 3. Update Order Status 
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
    
        const { orderId } = req.params as { orderId: string }; 
        const { status } = req.body; 

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
        console.error("Update Error:", error);
        res.status(500).json({ message: "Failed to update order", error });
    }
};

// 4. Get Seller Orders (Demo Version: Show ALL Orders)
export const getSellerOrders = async (req: Request, res: Response) => {
    try {

        const orders = await prisma.order.findMany({
            include: {
                user: { 
                    select: { name: true, address: true } 
                },
                items: {
                    include: {
                        medicine: true 
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Demo Mode: Showing all ${orders.length} orders`);

        res.status(200).json({ data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};

// Delete Medicine
export const deleteMedicine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; 
        
        await prisma.medicine.delete({ 
            where: { id } 
        });
        
        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete medicine" });
    }
};

// 5. Update Medicine
export const updateMedicine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { name, description, price, stock, manufacturer, expiryDate, categoryId } = req.body;

        const updatedMedicine = await prisma.medicine.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                manufacturer,
                expiryDate: new Date(expiryDate),
                categoryId
            }
        });

        res.status(200).json({ message: "Medicine updated successfully", data: updatedMedicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to update medicine", error });
    }
};