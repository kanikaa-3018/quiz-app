import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },
  class: {
    type: Number, // Only for students
    enum: [5, 6, 7, 8, 9, 10, 11, 12],
  },
  stream: {
    type: String, // Only for students
    enum: ['PCM', 'PCB', 'None'],
    default: 'None',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  preferences: {
    type: Object,
    default: {
      favoriteSubjects: [],
      studyReminders: false,
      darkMode: false
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  // For tracking progress and stats
  stats: {
    type: Object,
    default: {
      quizzesTaken: 0,
      totalScore: 0,
      averageScore: 0,
      topicsCompleted: 0,
    }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
