import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';

import personRoutes from './personRoutes';
import rateCardRoutes from './rateCardRoutes';
import statsRoutes from './statsRoutes';
import invoiceRoutes from './invoiceRoutes';
import paymentRoutes from './paymentRoutes';
import leadRoutes from './leadRoutes';
import clientRoutes from './clientRoutes';
import paymentTermsRoutes from './paymentTermsRoutes';
import projectRoutes from './projectRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.use('/people', personRoutes);
router.use('/rate-cards', rateCardRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/leads', leadRoutes);
router.use('/clients', clientRoutes);
router.use('/payment-terms', paymentTermsRoutes);
router.use('/projects', projectRoutes);
router.use('/stats', statsRoutes);

export default router;