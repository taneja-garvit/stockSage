import express from 'express';
import { getProfile } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

export default router;