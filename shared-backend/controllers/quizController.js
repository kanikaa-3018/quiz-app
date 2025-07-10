import Question from '../models/Question.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { generateMCQs } from "../utils/generateQuestion.js";

// Get questions for quiz creation
export const getQuizQuestions = async (req, res) => {
  const {
    class: classLevel,
    stream = "None",
    subject,
    topic = "",
    count = 10,
  } = req.query;

  const parsedClass = parseInt(classLevel);
  const questionCount = parseInt(count);

  if (!parsedClass || !subject) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Step 1: Find existing questions
    const filter = {
      class: parsedClass,
      subject,
    };
    if (parsedClass >= 11 && stream !== "None") filter.stream = stream;
    if (topic) filter.topic = topic;

    let existingQuestions = await Question.find(filter).lean();

    // Step 2: Return if enough exist
    if (existingQuestions.length >= questionCount) {
      const selected = existingQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, questionCount);
      return res.json(selected);
    }

    // Step 3: Generate remaining questions via AI
    const remaining = questionCount - existingQuestions.length;

    const generated = await generateMCQs({
      classLevel: parsedClass,
      stream,
      subject,
      topic,
    });

    const formatted = generated
      .slice(0, remaining)
      .filter((q) => q.options?.length === 4 && q.correctAnswerIndex >= 0)
      .map((q) => ({
        class: parsedClass,
        stream,
        subject,
        topic: topic || "General",
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
      }));

    let inserted = [];
    if (formatted.length > 0) {
      inserted = await Question.insertMany(formatted);
    }

    const finalQuestions = [...existingQuestions, ...inserted]
      .sort(() => 0.5 - Math.random())
      .slice(0, questionCount);

    res.json(finalQuestions);
  } catch (err) {
    console.error("Error in getQuizQuestions:", err);
    res.status(500).json({ error: "Failed to fetch or generate questions" });
  }
};

// Generate a random quiz for users
export const getRandomQuiz = async (req, res) => {
  try {
    let {
      class: cls,
      stream,
      subject,
      topic = "",
      count = "10",
      duration = "15",
    } = req.query;

    if (!cls || !subject) {
      return res.status(400).json({
        message: "Missing required fields: class or subject",
      });
    }

    cls = parseInt(cls);
    count = parseInt(count);
    duration = parseInt(duration);

    const hasStream = cls >= 11 && stream && stream !== "None";

    const filter = {
      class: cls,
      subject: new RegExp(`^${subject}$`, "i"),
    };

    if (hasStream) {
      filter.stream = new RegExp(`^${stream}$`, "i");
    }

    if (topic && topic.trim() !== "") {
      filter.topic = new RegExp(`^${topic}$`, "i");
    }

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: count } },
    ]);

    if (!questions.length) {
      return res.status(404).json({
        message: "No questions found for the given criteria",
      });
    }

    const formattedQuestions = questions.map((q) => ({
      id: q._id,
      questionText: q.questionText,
      options: q.options.map((opt, idx) => ({
        label: String.fromCharCode(65 + idx),
        text: opt,
      })),
      correctAnswerIndex: q.correctAnswerIndex,
    }));

    const quiz = {
      config: {
        class: cls.toString(),
        stream: hasStream ? stream : "None",
        subject,
        topic,
        duration: duration.toString(),
        questionCount: count.toString(),
      },
      questions: formattedQuestions,
      startTime: Date.now(),
      duration: duration * 60 * 1000,
    };

    // If authenticated user, track this quiz attempt
    if (req.user) {
      // Update user's last activity
      await User.findByIdAndUpdate(req.user._id, { 
        lastActive: new Date() 
      });
    }

    return res.status(200).json(quiz);
  } catch (err) {
    console.error("❌ Quiz generation error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get recent quiz attempts for the current user
export const getRecentQuizAttempts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const userId = req.user._id;

    const attempts = await Submission.find({ student: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("score timeTaken subject topic createdAt class questions")
      .lean();

    const enrichedAttempts = attempts.map((attempt) => ({
      ...attempt,
      questionCount: attempt.questions?.length || 0,
    }));

    res.json(enrichedAttempts);
  } catch (err) {
    console.error("Error fetching quiz attempts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all quiz attempts (for admin)
export const getAllQuizAttempts = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const { class: classFilter, subject, topic } = req.query;
    
    // Build filter
    const filter = {};
    if (classFilter) filter.class = parseInt(classFilter);
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    
    // Count total matching documents for pagination
    const total = await Submission.countDocuments(filter);
    
    // Get submissions with student details
    const attempts = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('student', 'name email class stream')
      .select('score timeTaken subject topic createdAt class questions student')
      .lean();
    
    const enrichedAttempts = attempts.map((attempt) => ({
      ...attempt,
      questionCount: attempt.questions?.length || 0,
    }));
    
    res.json({
      attempts: enrichedAttempts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching all quiz attempts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user performance statistics
export const getUserPerformanceStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }
    
    // Find all submissions for this user
    const submissions = await Submission.find({ student: userId })
      .sort({ createdAt: -1 })
      .lean();
    
    if (!submissions.length) {
      return res.json({
        quizzesTaken: 0,
        averageScore: 0,
        subjectPerformance: {},
        recentScores: []
      });
    }
    
    // Calculate overall stats
    const quizzesTaken = submissions.length;
    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const averageScore = Math.round(totalScore / quizzesTaken);
    
    // Calculate per-subject performance
    const subjectPerformance = {};
    submissions.forEach(sub => {
      if (!subjectPerformance[sub.subject]) {
        subjectPerformance[sub.subject] = {
          attempts: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      
      subjectPerformance[sub.subject].attempts += 1;
      subjectPerformance[sub.subject].totalScore += sub.score;
      subjectPerformance[sub.subject].averageScore = Math.round(
        subjectPerformance[sub.subject].totalScore / subjectPerformance[sub.subject].attempts
      );
    });
    
    // Get recent scores for charting
    const recentScores = submissions
      .slice(0, 10)
      .map(sub => ({
        date: sub.createdAt,
        score: sub.score,
        subject: sub.subject,
        topic: sub.topic
      }));
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      stats: {
        quizzesTaken,
        totalScore,
        averageScore,
        topicsCompleted: Object.keys(subjectPerformance).length
      }
    });
    
    res.json({
      quizzesTaken,
      averageScore,
      subjectPerformance,
      recentScores
    });
  } catch (err) {
    console.error("Error fetching performance stats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get recommended quizzes based on user history
export const getRecommendedQuizzes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const userId = req.user._id;
    const user = await User.findById(userId).lean();
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Get user's recent submissions
    const recentSubmissions = await Submission.find({ student: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Create recommendations based on:
    // 1. Poor performance areas (score < 60%)
    // 2. User's class level
    // 3. User's stream (if applicable)
    
    const weakSubjects = new Set();
    const practicedTopics = new Set();
    
    recentSubmissions.forEach(sub => {
      if (sub.score < 60) {
        weakSubjects.add(sub.subject);
      }
      
      if (sub.topic) {
        practicedTopics.add(`${sub.subject}-${sub.topic}`);
      }
    });
    
    // Build recommendations
    const recommendations = [];
    
    // 1. Recommend quizzes for weak subjects
    if (weakSubjects.size > 0) {
      for (const subject of weakSubjects) {
        recommendations.push({
          type: "improvement",
          subject,
          topic: "",
          description: `Practice ${subject} to improve your score`
        });
      }
    }
    
    // 2. Find topics in user's class that haven't been practiced
    const availableTopics = await Question.aggregate([
      {
        $match: { 
          class: user.class,
          ...(user.stream && user.stream !== "None" && user.class >= 11 ? { stream: user.stream } : {})
        }
      },
      {
        $group: { 
          _id: { subject: "$subject", topic: "$topic" }
        }
      }
    ]);
    
    for (const topicGroup of availableTopics) {
      const subject = topicGroup._id.subject;
      const topic = topicGroup._id.topic;
      
      if (topic && !practicedTopics.has(`${subject}-${topic}`)) {
        recommendations.push({
          type: "new",
          subject,
          topic,
          description: `Try a quiz on ${subject}: ${topic}`
        });
        
        // Limit to 3 new topic recommendations
        if (recommendations.filter(r => r.type === "new").length >= 3) {
          break;
        }
      }
    }
    
    res.json({
      recommendations: recommendations.slice(0, 5)  // Return top 5 recommendations
    });
  } catch (err) {
    console.error("Error generating recommendations:", err);
    res.status(500).json({ error: "Server error" });
  }
};
