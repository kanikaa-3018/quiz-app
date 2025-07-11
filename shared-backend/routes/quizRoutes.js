import express from 'express';
import { 
  getRandomQuiz, 
  getRecentQuizAttempts, 
  getQuizQuestions,
  getAllQuizAttempts,
  getUserPerformanceStats,
  getRecommendedQuizzes
} from '../controllers/quizController.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Shared endpoints (accessible to both admin and students)
router.get('/', getQuizQuestions);
router.get('/random', getRandomQuiz); // Public endpoint to allow guest quizzes

// User panel specific endpoints
router.get('/attempts', authenticate, getRecentQuizAttempts);
router.get('/recommendations', authenticate, isStudent, getRecommendedQuizzes);
router.get('/performance/:userId', authenticate, getUserPerformanceStats);

// Admin panel specific endpoints
router.get('/admin/attempts', authenticate, isAdmin, getAllQuizAttempts);
 
export default router;
