import Submission from "../models/Submission.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const submitQuiz = async (req, res) => {
  try {
    const {
      student,
      questions,
      score,
      timeTaken,
      class: cls,
      stream,
      subject,
      topic,
    } = req.body;

    // Validate request data
    if (!student || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Missing student or questions" });
    }

    // Find the questions in the database
    const questionIds = questions.map((q) => q.questionId);
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });

    if (dbQuestions.length !== questionIds.length) {
      return res.status(400).json({ message: "Some questions not found" });
    }

    // Enrich questions with correct answers
    const enrichedQuestions = questions.map((q) => {
      const question = dbQuestions.find(
        (item) => item._id.toString() === q.questionId
      );

      if (!question) {
        throw new Error(`Question not found: ${q.questionId}`);
      }

      return {
        questionId: q.questionId,
        selectedIndex: q.selectedIndex,
        correctIndex: question.correctAnswerIndex,
        isCorrect: q.selectedIndex === question.correctAnswerIndex,
      };
    });

    // Build the submission object
    const submissionData = {
      student,
      questions: enrichedQuestions,
      score,
      timeTaken,
      class: Number(cls),
      subject,
      topic,
    };

    // Only include stream if it is valid (not null, undefined, or "None")
    if (stream && stream !== "None") {
      submissionData.stream = stream;
    }

    // Create submission record
    const submission = await Submission.create(submissionData);

    // Update user stats after submission
    await User.findByIdAndUpdate(student, {
      $inc: { 
        "stats.quizzesTaken": 1,
        "stats.totalScore": score
      },
      $set: {
        lastActive: new Date()
      }
    });

    // Get the current user's stats to calculate average
    const user = await User.findById(student);
    if (user && user.stats) {
      user.stats.averageScore = Math.round(user.stats.totalScore / user.stats.quizzesTaken);
      await user.save();
    }

    // Format results for frontend
    const fullResults = {
      _id: submission._id,
      student,
      score,
      timeTaken,
      class: cls,
      stream: submissionData.stream || null,
      subject,
      topic,
      userAnswers: {},
      answers: enrichedQuestions,
      questions: {
        questions: dbQuestions.map((q) => ({
          id: q._id.toString(),
          questionText: q.questionText,
          correctAnswerIndex: q.correctAnswerIndex,
          options: q.options.map((opt, i) => ({
            label: String.fromCharCode(65 + i),
            text: opt,
          })),
        })),
      },
    };

    for (const q of enrichedQuestions) {
      fullResults.userAnswers[q.questionId] = {
        selectedAnswer:
          q.selectedIndex >= 0
            ? String.fromCharCode(65 + q.selectedIndex)
            : null,
      };
    }

    res.status(201).json(fullResults);
  } catch (err) {
    console.error("❌ Submission Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all submissions for a specific user
export const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if requesting user has permission (admin or the user themselves)
    if (req.user && (req.user.role === 'admin' || req.user._id.toString() === userId)) {
      const submissions = await Submission.find({ student: userId })
        .sort({ createdAt: -1 })
        .populate('student', 'name email')
        .lean();
      
      // Add question count for each submission
      const enrichedSubmissions = submissions.map(sub => ({
        ...sub,
        questionCount: sub.questions?.length || 0
      }));
      
      res.json(enrichedSubmissions);
    } else {
      res.status(403).json({ message: "Not authorized to access this data" });
    }
  } catch (err) {
    console.error("Error fetching user submissions:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get detailed answers for a specific submission
export const getSubmissionAnswers = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate('questions.questionId')
      .populate('student', 'name email class stream')
      .lean();

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Check permissions (admin or submission owner)
    if (req.user && (req.user.role === 'admin' || req.user._id.toString() === submission.student._id.toString())) {
      const answers = submission.questions
        .filter(q => q.questionId)  
        .map((q) => ({
          question: q.questionId.questionText,
          options: q.questionId.options,
          selectedIndex: q.selectedIndex,
          correctIndex: q.correctIndex,
          isCorrect: q.isCorrect,
        }));
      
      // Calculate statistics for this submission
      const totalQuestions = answers.length;
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const incorrectAnswers = totalQuestions - correctAnswers;
      const percentageCorrect = Math.round((correctAnswers / totalQuestions) * 100);
      
      res.json({
        student: submission.student,
        subject: submission.subject,
        topic: submission.topic,
        class: submission.class,
        stream: submission.stream,
        createdAt: submission.createdAt,
        score: submission.score,
        timeTaken: submission.timeTaken,
        stats: {
          totalQuestions,
          correctAnswers,
          incorrectAnswers,
          percentageCorrect
        },
        answers,
      });
    } else {
      res.status(403).json({ error: 'Not authorized to view this submission' });
    }
  } catch (error) {
    console.error('Error fetching submission answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get summary statistics for all submissions
export const getSubmissionStats = async (req, res) => {
  try {
    // Only admins can access this endpoint
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get stats for all submissions
    const [results] = await Submission.aggregate([
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averageTimeTaken: { $avg: '$timeTaken' },
          bySubject: {
            $push: {
              subject: '$subject',
              score: '$score'
            }
          },
          byClass: {
            $push: {
              class: '$class',
              score: '$score'
            }
          }
        }
      }
    ]);
    
    if (!results) {
      return res.json({
        totalSubmissions: 0,
        averageScore: 0,
        averageTimeTaken: 0,
        subjectPerformance: {},
        classPerformance: {}
      });
    }
    
    // Process subject performance
    const subjectPerformance = {};
    results.bySubject.forEach(item => {
      if (!subjectPerformance[item.subject]) {
        subjectPerformance[item.subject] = {
          count: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      subjectPerformance[item.subject].count += 1;
      subjectPerformance[item.subject].totalScore += item.score;
    });
    
    // Calculate average for each subject
    Object.keys(subjectPerformance).forEach(subject => {
      subjectPerformance[subject].averageScore = Math.round(
        subjectPerformance[subject].totalScore / subjectPerformance[subject].count
      );
    });
    
    // Process class performance
    const classPerformance = {};
    results.byClass.forEach(item => {
      const classLevel = item.class.toString();
      if (!classPerformance[classLevel]) {
        classPerformance[classLevel] = {
          count: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      classPerformance[classLevel].count += 1;
      classPerformance[classLevel].totalScore += item.score;
    });
    
    // Calculate average for each class
    Object.keys(classPerformance).forEach(classLevel => {
      classPerformance[classLevel].averageScore = Math.round(
        classPerformance[classLevel].totalScore / classPerformance[classLevel].count
      );
    });
    
    res.json({
      totalSubmissions: results.totalSubmissions,
      averageScore: Math.round(results.averageScore),
      averageTimeTaken: Math.round(results.averageTimeTaken),
      subjectPerformance,
      classPerformance
    });
  } catch (error) {
    console.error('Error generating submission stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export submissions for data analysis
export const exportSubmissions = async (req, res) => {
  try {
    // Only admins can access this endpoint
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { format = 'json', startDate, endDate } = req.query;
    
    // Build filter
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    // Get submissions with user details
    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .populate('student', 'name email class stream')
      .lean();
    
    // Format for export
    const exportData = submissions.map(sub => ({
      id: sub._id,
      student: {
        id: sub.student._id,
        name: sub.student.name,
        email: sub.student.email,
        class: sub.student.class,
        stream: sub.student.stream
      },
      subject: sub.subject,
      topic: sub.topic || 'General',
      score: sub.score,
      timeTaken: sub.timeTaken,
      totalQuestions: sub.questions.length,
      correctAnswers: sub.questions.filter(q => q.isCorrect).length,
      submittedAt: sub.createdAt
    }));
    
    if (format === 'csv') {
      // Return CSV formatted data
      let csv = 'ID,StudentID,StudentName,StudentEmail,Class,Stream,Subject,Topic,Score,TimeTaken,TotalQuestions,CorrectAnswers,SubmittedAt\n';
      
      exportData.forEach(item => {
        csv += `${item.id},${item.student.id},${item.student.name},${item.student.email},${item.student.class},${item.student.stream},${item.subject},${item.topic},${item.score},${item.timeTaken},${item.totalQuestions},${item.correctAnswers},${item.submittedAt}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
      res.send(csv);
    } else {
      // Return JSON data
      res.json(exportData);
    }
  } catch (error) {
    console.error('Error exporting submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
