// // utils/generateMCQs.js
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// import { v4 as uuidv4 } from "uuid";

// dotenv.config();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// export const generateMCQs = async ({ classLevel, stream, subject, topic }) => {
//   const prompt = `
// Generate 5 multiple-choice questions for Class ${classLevel} students in stream "${stream}" on the topic "${topic}" in the subject "${subject}".
// Each question must have 4 options labeled A), B), C), D), and clearly specify the correct answer as "Answer: X".

// Use this format:
// 1. Question here?
// A) Option A
// B) Option B
// C) Option C
// D) Option D
// Answer: B
// `;

//   const url =
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

//   try {
//     const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Gemini API Error:", JSON.stringify(data, null, 2));
//       throw new Error(
//         data.error?.message || "Failed to generate content from Gemini API"
//       );
//     }

//     const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
// console.log(parseMCQResponse(rawText))
//     return parseMCQResponse(rawText);

//   } catch (err) {
//     console.error("Gemini fetch error:", err);
//     throw err;
//   }
// };

// function parseMCQResponse(text) {
//   if (typeof text !== "string") {
//     console.error("parseMCQResponse error: input is not a string");
//     return [];
//   }

//   const questionBlocks = text.trim().split(/\n(?=\d+\.)/);

//   const questions = questionBlocks.map((block, i) => {
//     const lines = block.trim().split("\n").filter(Boolean);

//     const questionText = lines[0].replace(/^\d+\.\s*/, "").trim();

//     const options = lines.slice(1, 5).map((line) => {
//       const match = line.match(/^([A-D])\)\s*(.*)$/);
//       return {
//         label: match?.[1],
//         text: match?.[2] || "",
//       };
//     });

//     const answerLine = lines.find((line) => /^Answer:\s*[A-D]/i.test(line));
//     const correctLabel = answerLine?.match(/Answer:\s*([A-D])/i)?.[1];
//     const correctIndex = options.findIndex((opt) => opt.label === correctLabel);

//     return {
//       id: `q${i + 1}_${uuidv4()}`,
//       questionText,
//       options,
//       correctAnswerIndex: correctIndex,
//     };
//   });

//   return questions.filter(
//     (q) => q.options.length === 4 && q.correctAnswerIndex >= 0
//   );
// }


import fetch from "node-fetch";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const generateMCQs = async ({ classLevel, stream, subject, topic }) => {
  const prompt = `
Generate 5 multiple-choice questions for Class ${classLevel} students in stream "${stream}" on the topic "${topic}" in the subject "${subject}".

Respond ONLY with raw JSON using this format:

[
  {
    "question": "What is 2 + 2?",
    "options": ["1", "2", "3", "4"],
    "correctAnswerIndex": 3
  }
]

Do NOT add triple backticks (\\\`\\\`\\\`) or extra explanations. Output should be **raw JSON** only.
`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  try {
    const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      throw new Error(
        data.error?.message || "Failed to generate content from Gemini API"
      );
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // 🛠 Strip Markdown-style code blocks if present
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ Gemini returned invalid JSON:", rawText);
      throw new Error("Failed to parse JSON from Gemini response");
    }

    // ✅ Validate and format for DB
    const questions = parsed
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctAnswerIndex === "number"
      )
      .map((q, i) => ({
        id: `q${i + 1}_${uuidv4()}`,
        questionText: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctAnswerIndex: q.correctAnswerIndex,
      }));

    return questions;
  } catch (err) {
    console.error("Gemini fetch error:", err);
    throw err;
  }
};
