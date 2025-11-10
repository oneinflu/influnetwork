import express from 'express';
import { authenticate } from '../middleware/auth';
import { getDashboardStats } from '../controllers/statsController';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);

export default router;