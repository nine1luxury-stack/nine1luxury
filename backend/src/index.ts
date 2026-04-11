import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import customerRoutes from './routes/customers';
import supplierRoutes from './routes/suppliers';
import expenseRoutes from './routes/expenses';
import categoryRoutes from './routes/categories';
import couponRoutes from './routes/coupons';
import offerRoutes from './routes/offers';
import notificationRoutes from './routes/notifications';
import settingRoutes from './routes/settings';
import returnRoutes from './routes/returns';
import bookingRoutes from './routes/bookings';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);
app.use('/coupons', couponRoutes);
app.use('/offers', offerRoutes);
app.use('/notifications', notificationRoutes);
app.use('/settings', settingRoutes);
app.use('/returns', returnRoutes);
app.use('/bookings', bookingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Nine1Luxury Backend is running on http://localhost:${PORT}`);
});
