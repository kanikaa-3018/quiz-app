import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js"; // Adjust path if needed

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

const questions = [
  {
    class: 5,
    stream: "None",
    subject: "Science",
    topic: "Human Body",
    questionText: "Which organ pumps blood throughout the body?",
    options: ["Lungs", "Heart", "Liver", "Kidney"],
    correctAnswerIndex: 1,
  },
  {
    class: 6,
    stream: "None",
    subject: "Mathematics",
    topic: "Fractions",
    questionText: "What is 1/2 + 1/4?",
    options: ["3/6", "3/4", "2/4", "1/3"],
    correctAnswerIndex: 1,
  },
  {
    class: 7,
    stream: "None",
    subject: "Social Science",
    topic: "Geography",
    questionText: "Which is the longest river in the world?",
    options: ["Amazon", "Ganga", "Nile", "Yangtze"],
    correctAnswerIndex: 2,
  },
  {
    class: 8,
    stream: "None",
    subject: "Science",
    topic: "Combustion",
    questionText: "Which of the following is a combustible substance?",
    options: ["Glass", "Stone", "Paper", "Iron"],
    correctAnswerIndex: 2,
  },
  {
    class: 9,
    stream: "None",
    subject: "Mathematics",
    topic: "Polynomials",
    questionText: "Which of the following is a quadratic polynomial?",
    options: ["x + 1", "x^2 + 3x + 2", "x^3 + x", "5x"],
    correctAnswerIndex: 1,
  },
  {
    class: 10,
    stream: "None",
    subject: "Science",
    topic: "Electricity",
    questionText: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswerIndex: 1,
  },
  {
    class: 11,
    stream: "PCM",
    subject: "Physics",
    topic: "Kinematics",
    questionText: "Which of the following is a scalar quantity?",
    options: ["Velocity", "Displacement", "Acceleration", "Speed"],
    correctAnswerIndex: 3,
  },
  {
    class: 11,
    stream: "PCM",
    subject: "Mathematics",
    topic: "Sets",
    questionText: "If A = {1, 2}, B = {2, 3}, then A ∩ B = ?",
    options: ["{1}", "{2}", "{1, 2}", "{2, 3}"],
    correctAnswerIndex: 1,
  },
  {
    class: 11,
    stream: "PCB",
    subject: "Biology",
    topic: "Cell Structure",
    questionText: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    correctAnswerIndex: 2,
  },
  {
    class: 12,
    stream: "PCM",
    subject: "Physics",
    topic: "Electrostatics",
    questionText: "Coulomb’s law is applicable to which type of charge?",
    options: ["Moving", "Stationary", "Negative only", "Positive only"],
    correctAnswerIndex: 1,
  },
  {
    class: 12,
    stream: "PCB",
    subject: "Biology",
    topic: "Genetics",
    questionText: "Which of these carries genetic information?",
    options: ["RNA", "Lipid", "Protein", "Vitamin"],
    correctAnswerIndex: 0,
  },
  {
    class: 5,
    stream: "None",
    subject: "EVS",
    topic: "Plants",
    questionText: "Which part of the plant prepares food?",
    options: ["Root", "Leaf", "Stem", "Flower"],
    correctAnswerIndex: 1,
  },
  {
    class: 6,
    stream: "None",
    subject: "Science",
    topic: "Magnetism",
    questionText: "Which material is attracted to a magnet?",
    options: ["Wood", "Plastic", "Iron", "Glass"],
    correctAnswerIndex: 2,
  },
  {
    class: 7,
    stream: "None",
    subject: "English",
    topic: "Grammar",
    questionText: "Identify the noun in the sentence: 'The dog barked loudly.'",
    options: ["dog", "barked", "loudly", "the"],
    correctAnswerIndex: 0,
  },
  {
    class: 8,
    stream: "None",
    subject: "Social Science",
    topic: "History",
    questionText: "Who was the first Prime Minister of India?",
    options: ["Gandhi", "Ambedkar", "Nehru", "Patel"],
    correctAnswerIndex: 2,
  },
  {
    class: 9,
    stream: "None",
    subject: "Mathematics",
    topic: "Linear Equations",
    questionText: "What is the solution to 2x - 4 = 6?",
    options: ["x=1", "x=2", "x=3", "x=5"],
    correctAnswerIndex: 2,
  },
  {
    class: 10,
    stream: "None",
    subject: "Science",
    topic: "Light",
    questionText: "What is the speed of light in vacuum?",
    options: ["3x10^8 m/s", "3x10^6 m/s", "1x10^8 m/s", "1x10^6 m/s"],
    correctAnswerIndex: 0,
  },
  {
    class: 11,
    stream: "PCM",
    subject: "Chemistry",
    topic: "Atomic Structure",
    questionText: "Which subatomic particle has no charge?",
    options: ["Proton", "Neutron", "Electron", "Ion"],
    correctAnswerIndex: 1,
  },
  {
    class: 11,
    stream: "PCB",
    subject: "Chemistry",
    topic: "Chemical Reactions",
    questionText: "Which of these is a decomposition reaction?",
    options: [
      "H2 + O2 → H2O",
      "NaCl → Na + Cl2",
      "Fe + CuSO4 → FeSO4 + Cu",
      "N2 + 3H2 → 2NH3",
    ],
    correctAnswerIndex: 1,
  },
  {
    class: 12,
    stream: "PCM",
    subject: "Mathematics",
    topic: "Calculus",
    questionText: "What is the derivative of x²?",
    options: ["x", "2x", "x²", "2"],
    correctAnswerIndex: 1,
  },
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Question.deleteMany({});
    console.log("🧹 Cleared previous questions");

    await Question.insertMany(questions);
    console.log("🎯 Seeded 20 questions successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedQuestions();
