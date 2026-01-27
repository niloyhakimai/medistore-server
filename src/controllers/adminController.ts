import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        // 1. Total Sales
        const salesData = await prisma.order.aggregate({
            _sum: { totalAmount: true }
        });

        // 2. Total Orders 
        const totalOrders = await prisma.order.count();

        // 3. Total Users (Customer + Seller)
        const totalUsers = await prisma.user.count();

        // 4. Recent Orders 
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } } 
        });

        res.status(200).json({
            data: {
                totalSales: salesData._sum.totalAmount || 0,
                totalOrders,
                totalUsers,
                recentOrders
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admin stats", error });
    }
};