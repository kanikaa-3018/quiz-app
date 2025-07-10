import express from 'express';
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  bulkUploadQuestions,
 
} from '../controllers/questionController.js';
import multer from 'multer'

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', createQuestion);
router.get('/', getQuestions);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);
router.post("/bulk-upload", upload.single("file"), bulkUploadQuestions);


export default router;
