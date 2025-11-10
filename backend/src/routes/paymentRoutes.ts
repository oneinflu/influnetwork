import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllPayments, getPayment, addPayment, editPayment, removePayment } from '../controllers/paymentController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllPayments);
router.get('/:id', getPayment);

router.post('/', addPayment);
router.patch('/:id', editPayment);
router.delete('/:id', removePayment);

export default router;