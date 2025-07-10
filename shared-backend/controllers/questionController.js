import Question from '../models/Question.js';
import { parse } from "csv-parse/sync";

import XLSX from "xlsx";
import { generateMCQs } from '../utils/generateQuestion.js';

// export const createQuestion = async (req, res) => {
//   try {
//     const {
//       questionText,
//       optionA,
//       optionB,
//       optionC,
//       optionD,
//       correctAnswer,
//       class: classNum,
//       stream,
//       subject,
//       topic,
//     } = req.body;

//     const options = [optionA, optionB, optionC, optionD];
//     const correctIndex = ["A", "B", "C", "D"].indexOf(correctAnswer);

//     // ✅ Log before creation
//     console.log("📝 Incoming data:", {
//       questionText,
//       options,
//       correctAnswerIndex: correctIndex,
//       class: parseInt(classNum),
//       stream: stream || "None",
//       subject,
//       topic,
//     });

//     // ❌ If correctAnswer is invalid (not A–D), this will be -1
//     if (correctIndex === -1) {
//       return res.status(400).json({ message: "Invalid correctAnswer value" });
//     }

//     const question = await Question.create({
//       questionText,
//       options,
//       correctAnswerIndex: correctIndex,
//       class: parseInt(classNum),
//       stream: stream || "None",
//       subject,
//       topic,
//     });

//     res.status(201).json(question);
//   } catch (err) {
//     console.error("❌ Error in createQuestion:", err); // ✅ Show detailed error
//     res.status(500).json({ message: err.message });
//   }
// };

export const createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswerIndex,
      class: classNum,
      stream,
      subject,
      topic,
    } = req.body;

    // Safety checks
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: "Must provide 4 options" });
    }

    if (typeof correctAnswerIndex !== "number" || correctAnswerIndex < 0 || correctAnswerIndex > 3) {
      return res.status(400).json({ message: "Invalid correctAnswerIndex" });
    }

    const question = await Question.create({
      questionText,
      options,
      correctAnswerIndex,
      class: parseInt(classNum),
      stream: stream || "None",
      subject,
      topic,
    });

    res.status(201).json(question);
  } catch (err) {
    console.error("❌ Error in createQuestion:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getQuestions = async (req, res) => {
  try {
    const filter = {};
    const { class: cls, stream, subject, topic } = req.query;

    if (cls && cls !== 'all') filter.class = Number(cls);
    if (stream && stream !== 'all') filter.stream = stream;
    if (subject && subject !== 'all') filter.subject = subject;
    if (topic && topic !== 'all') filter.topic = topic;

    const questions = await Question.find(filter);
    // console.log(questions)
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkUploadQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

 
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);


    const questions = sheetData.map((row, idx) => {
      const options = [row["Option A"], row["Option B"], row["Option C"], row["Option D"]];
      const correctAnswerLetter = row["Correct Answer"]?.trim()?.toUpperCase();
      const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(correctAnswerLetter);

      if (correctAnswerIndex === -1) {
        throw new Error(`Invalid correct answer in row ${idx + 2}`);
      }

      return {
        class: parseInt(row["Class"]),
        stream: row["Stream"]?.trim() || "None",
        subject: row["Subject"]?.trim(),
        topic: row["Topic"]?.trim(),
        questionText: row["Question"]?.trim(),
        options,
        correctAnswerIndex,
      };
    });

    const inserted = await Question.insertMany(questions);
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to upload questions" });
  }
};



