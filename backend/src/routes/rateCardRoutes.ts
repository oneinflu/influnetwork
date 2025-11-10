import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllRateCards, getRateCard, addRateCard, editRateCard, removeRateCard, toggleVisibility } from '../controllers/rateCardController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllRateCards);
router.get('/:id', getRateCard);

router.post('/', addRateCard);
router.patch('/:id', editRateCard);
router.delete('/:id', removeRateCard);
router.post('/:id/toggle-visibility', toggleVisibility);

export default router;