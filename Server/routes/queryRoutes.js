import express from 'express';
import { processQuery, processFreeQuery } from '../controllers/queryController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/query', authenticateToken, processQuery);
router.post('/free-query', processFreeQuery);

export default router;