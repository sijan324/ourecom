// Admin analytics route
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getAnalytics } from '../controllers/adminController.js';
const router = express.Router();
router.get('/analytics', protect, admin, getAnalytics);
export default router;
