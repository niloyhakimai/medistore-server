import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Authenticate User (Login Check)
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
     res.status(401).json({ message: "Authentication required" });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // Attach user info to request
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// 2. Authorize Seller (Only Seller)
export const authorizeSeller = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    // Check if user exists and has SELLER role
    if (!user || user.role !== "SELLER") {
         res.status(403).json({ message: "Access Denied: Sellers only" });
         return;
    }
    next();
};

// 3. Authorize Admin (Only Admin)
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    // Check if user exists and has ADMIN role
    if (!user || user.role !== "ADMIN") {
         res.status(403).json({ message: "Access Denied: Admins only" });
         return;
    }
    next();
};