// Auth routes with mock data
import express from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/mockAuthController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
