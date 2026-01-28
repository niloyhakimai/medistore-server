import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Import routes
import categoryRoutes from './routes/categoryRoutes';
import medicineRoutes from './routes/medicineRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import sellerRoutes from './routes/sellerRoutes';


const app: Application = express();


app.use(express.json());
app.use(cors());

// Application Routes
app.use('/api/auth', authRoutes); // Connect auth routes
app.use('/api/categories', categoryRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: "MediStore API is working perfectly!",
  });
});

export default app;