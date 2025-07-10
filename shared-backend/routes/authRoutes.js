import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { authenticate, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
