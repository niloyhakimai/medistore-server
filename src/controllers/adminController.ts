import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Get Admin Dashboard Stats
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


// 2. Get All Users (Customer & Seller)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true }
        });
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
    }
};

// 3. Ban/Unban User
export const toggleUserBan = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { isBanned } = req.body; // true or false

        const updatedUser = await prisma.user.update({
            where: { id: userId as string },
            data: { isBanned }
        });

        res.status(200).json({ message: `User ${isBanned ? 'banned' : 'activated'} successfully`, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user status", error });
    }
};