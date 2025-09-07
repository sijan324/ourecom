// Main Express server for Ourecom
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import mock routes (database is currently unavailable)
import authRoutes from './routes/mockAuth.js';
import productRoutes from './routes/mockProduct.js';
import cartRoutes from './routes/mockCart.js';
import orderRoutes from './routes/mockOrder.js';
import esewaPaymentRoutes from './routes/esewaPayment.js';
// import paymentRoutes from './routes/payment.js';
// import adminRoutes from './routes/admin.js';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5174',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes with mock data
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', esewaPaymentRoutes);
// app.use('/api/admin', adminRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Ourecom API is running with mock data', status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Using mock data (database unavailable)`);
});
