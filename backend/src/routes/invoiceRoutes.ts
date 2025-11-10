import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllInvoices, getInvoice, addInvoice, editInvoice, removeInvoice, sendInvoiceAction, recordPaymentAction } from '../controllers/invoiceController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllInvoices);
router.get('/:id', getInvoice);

router.post('/', addInvoice);
router.patch('/:id', editInvoice);
router.delete('/:id', removeInvoice);

router.post('/:id/send', sendInvoiceAction);
router.post('/:id/payments', recordPaymentAction);

export default router;