import express from 'express';
import User from '../models/User.js';
import Submission from '../models/Submission.js';

const router = express.Router();

// GET: Summary of all students with quiz stats
router.get('/summary', async (req, res) => {
  const students = await User.find({ role: 'student' });
  const submissions = await Submission.find();
//   console.log(students)

  const data = students.map(student => {
    const studentSubs = submissions.filter(s => s.student.toString() === student._id.toString());
    const total = studentSubs.length;
    const avg = total ? Math.round(studentSubs.reduce((sum, s) => sum + s.score, 0) / total) : 0;

    return {
      _id: student._id,
      name: student.name,
      class: student.class,
      stream: student.stream,
      totalQuizzes: total,
      avgScore: avg
    };
  });

  res.json(data);
});

// GET: Detailed submissions of one student
router.get('/:id/results', async (req, res) => {
  const student = await User.findById(req.params.id).lean();
  const results = await Submission.find({ student: req.params.id }).sort({ createdAt: -1 }).lean();

  res.json({ student, results });
});

export default router;
