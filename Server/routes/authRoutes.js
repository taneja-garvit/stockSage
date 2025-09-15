import express from 'express';
import { register, login,sendOTP, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/register-otp', sendOTP);  // Add this
router.post('/verify-otp', verifyOTP);  // Add this

export default router;