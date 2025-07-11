import express from 'express';
import { 
  submitQuiz, 
  getUserSubmissions, 
  getSubmissionAnswers, 
  getSubmissionStats, 
  exportSubmissions 
} from '../controllers/submissionController.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.js';

const router = express.Router();


router.post('/', submitQuiz);

router.get('/view/:id', authenticate, getSubmissionAnswers);

// User panel specific endpoints
router.get('/user/:userId', authenticate, getUserSubmissions);

// Admin panel specific endpoints
router.get('/admin/stats', authenticate, isAdmin, getSubmissionStats);
router.get('/admin/export', authenticate, isAdmin, exportSubmissions);

export default router;
