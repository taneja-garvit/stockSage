import express from 'express';
import { processQuery } from '../controllers/queryController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/query', authenticateToken, processQuery);

export default router;