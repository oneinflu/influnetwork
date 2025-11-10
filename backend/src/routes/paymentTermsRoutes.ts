import express from 'express';
import { authenticate } from '../middleware/auth';
import { 
  getAllPaymentTermsTemplates, 
  getPaymentTermsTemplate, 
  addPaymentTermsTemplate, 
  editPaymentTermsTemplate, 
  removePaymentTermsTemplate,
  getActiveTemplates
} from '../controllers/paymentTermsController';

const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Routes
router.get('/', getAllPaymentTermsTemplates);
router.get('/active', getActiveTemplates);
router.post('/init-defaults', getActiveTemplates); // Initialize defaults if needed
router.get('/:id', getPaymentTermsTemplate);
router.post('/', addPaymentTermsTemplate);
router.patch('/:id', editPaymentTermsTemplate);
router.delete('/:id', removePaymentTermsTemplate);

export default router;