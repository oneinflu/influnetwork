import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllLeads, getLead, addLead, editLead, removeLead, updateLeadStatus } from '../controllers/leadController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllLeads);
router.get('/:id', getLead);

// General lead routes accessible to any authenticated user
router.post('/', addLead);
router.patch('/:id', editLead);
router.delete('/:id', removeLead);
router.post('/:id/status', updateLeadStatus);

export default router;