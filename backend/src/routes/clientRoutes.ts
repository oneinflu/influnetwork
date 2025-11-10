import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllClients, getClient, addClient, editClient, removeClient } from '../controllers/clientController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllClients);
router.get('/:id', getClient);

router.post('/', addClient);
router.patch('/:id', editClient);
router.delete('/:id', removeClient);

export default router;