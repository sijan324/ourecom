// Payment routes
import express from 'express';
import { initiatePayment, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
export default router;
