
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
    enum: [5, 6, 7, 8, 9, 10, 11, 12],
  },
  stream: {
    type: String,
    required: true,
    enum: ['PCM', 'PCB', 'None'],
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 4, 'Must have exactly 4 options'],
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
