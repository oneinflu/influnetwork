import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/verify-email/:token', verifyEmail);

// Protected routes (require authentication)
router.use(authenticate); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/update-profile', updateProfile);
router.patch('/change-password', changePassword);
router.post('/resend-verification', resendEmailVerification);

export default router;