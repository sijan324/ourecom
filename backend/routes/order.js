// Order routes
import express from 'express';
import { auth } from '../middleware/auth.js';

// Use mock controllers for now since database is unavailable
import { 
  createOrder, 
  getUserOrders, 
  getOrderById,
  updateOrderStatus 
} from '../controllers/mockOrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
