import express from "express";
import Question from "../models/Question.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [totalQuestions, quizzesTaken, avgScoreResult, activeStudents] = await Promise.all([
      Question.countDocuments(),
      Submission.countDocuments(),
      Submission.aggregate([
        { $group: { _id: null, avgScore: { $avg: "$score" } } },
      ]),
      Submission.distinct("student"), 
    ]);

    res.json({
      totalQuestions,
      quizzesTaken,
      avgScore: avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0,
      activeStudents: activeStudents.length,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
