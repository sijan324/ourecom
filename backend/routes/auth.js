// Auth routes
import express from 'express';

// Use mock controllers for now since database is unavailable
import { signup, login, getProfile, updateProfile } from '../controllers/mockAuthController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
