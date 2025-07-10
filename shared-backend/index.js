import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { updateLastActive } from "./middleware/auth.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import statsRoutes from "./routes/stats.js";
import studentRoutes from "./routes/students.js";

dotenv.config();
const app = express();

// Allow requests from both admin and user frontend applications
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", process.env.ADMIN_FRONTEND_URL, process.env.USER_FRONTEND_URL],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Application routes - unified backend supporting both admin and user panels
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/students", studentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    message: 'Server error occurred', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    serverApi: { version: "1", strict: false, deprecationErrors: true },
    ssl: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Unified backend server running on port ${PORT}`);
      console.log(`- Supporting Admin Panel at ${process.env.ADMIN_FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`- Supporting User Panel at ${process.env.USER_FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Handle shutdown gracefully
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('Closing server and database connections...');
  mongoose.connection.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
}
