import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

// 1. Register User
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
             res.status(400).json({ message: "User already exists! Please Login." });
             return;
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "CUSTOMER" // Default role
            }
        });

        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Registration failed", error });
    }
};

// 2. Login User
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
             res.status(400).json({ message: "User not found!" });
             return;
        }

        // Check Ban Status
        if (user.isBanned) {
             res.status(403).json({ message: "Your account is banned. Contact Admin." });
             return;
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
             res.status(400).json({ message: "Invalid credentials!" });
             return;
        }

        // Generate Token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        // Send Response
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed", error });
    }
};