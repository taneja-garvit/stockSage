import express from 'express';
import { submitTask, verifyTask } from '../controllers/taskController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/submit-task', authenticateToken, submitTask);
router.put('/verify-task/:taskId', verifyTask); // Note: Should add admin authentication in production

export default router;