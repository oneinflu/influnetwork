import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  deactivateUser,
  activateUser,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/deactivate', deactivateUser);
router.patch('/:id/activate', activateUser);

export default router;