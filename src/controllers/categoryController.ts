import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// 1. Create Category (Admin Only - but open for now)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const newCategory = await prisma.category.create({
      data: { name }
    });

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

// 2. Get All Categories (Public)
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};