import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
} from '../controllers/adminAuthController.js';

import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', adminMiddleware, getAdminProfile);
router.put('/profile', adminMiddleware, updateAdminProfile);

export default router;
