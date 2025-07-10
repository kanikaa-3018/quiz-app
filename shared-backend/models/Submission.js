import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedIndex: {
          type: Number,
          required: true,
          default: -1, 
        },
        correctIndex: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true, 
    },
    class: {
      type: Number,
      required: true,
    },
    stream: {
      type: String,
      enum: ["PCM", "PCB", "None"],
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


submissionSchema.pre('save', function (next) {
  this.questions = this.questions.map((q) => ({
    ...q,
    isCorrect: q.selectedIndex === q.correctIndex,
  }));
  next();
});

export default mongoose.model('Submission', submissionSchema);
