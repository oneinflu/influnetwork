import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllPeople, getPerson, addPerson, editPerson, removePerson } from '../controllers/personController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllPeople);
router.get('/:id', getPerson);

router.post('/', addPerson);
router.patch('/:id', editPerson);
router.delete('/:id', removePerson);

export default router;