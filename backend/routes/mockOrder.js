import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/mockOrderController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get user orders (requires authentication but can work with guest)
router.get('/', getUserOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Update order status (admin only in real app)
router.put('/:id/status', updateOrderStatus);

export default router;
