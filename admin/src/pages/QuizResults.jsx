import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatTime, getGrade } from "@/lib/utils";
import {
  CheckCircle,
  Percent,
  Clock,
  Trophy,
  RotateCcw,
  Plus,
  Download,
  Check,
  X,
} from "lucide-react";

export default function QuizResults() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("quizResults");
    if (!stored) {
      navigate("/student");
      return;
    }
    setResults(JSON.parse(stored));
  }, [navigate]);

  const handleRetakeQuiz = () => {
    localStorage.removeItem("quizResults");
    navigate("/student");
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const resultsText = `
Quiz Results - ${results.subject}
Class: ${results.class} | Stream: ${results.stream}
Score: ${results.score}%
Time: ${formatTime(results.timeTaken)}
Grade: ${getGrade(results.score)}

Detailed Answers:
${results.questions.map((q, index) => {
  const userAnswer = results.userAnswers[q.id];
  const selectedLabel = userAnswer?.selectedAnswer || "N/A";
  const selectedIndex = selectedLabel ? selectedLabel.charCodeAt(0) - 65 : -1;
  const correctIndex = q.correctAnswerIndex;
  const correctLabel = String.fromCharCode(65 + correctIndex);
  const correctText = typeof q.options?.[correctIndex] === "object" ? q.options[correctIndex]?.text || "" : q.options?.[correctIndex] || "";
  const isCorrect = selectedIndex === correctIndex;

  return `
${index + 1}. ${q.questionText}
Your Answer: ${selectedLabel} - ${isCorrect ? 'Correct' : 'Incorrect'}
Correct Answer: ${correctLabel}) ${correctText}`;
}).join("\n")}
`;

    const blob = new Blob([resultsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quiz_Results_${results.subject}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Success", description: "Results downloaded successfully" });
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const grade = getGrade(results.score);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              results.score >= 80
                ? "bg-green-100"
                : results.score >= 60
                ? "bg-orange-100"
                : "bg-red-100"
            }`}
          >
            <CheckCircle
              className={`text-3xl ${
                results.score >= 80
                  ? "text-green-600"
                  : results.score >= 60
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-lg text-gray-600">Great job! Here are your results:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Percent className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{results.score}%</h3>
            <p className="text-gray-600">Final Score</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="text-orange-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {formatTime(results.timeTaken)}
            </h3>
            <p className="text-gray-600">Time Taken</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{grade}</h3>
            <p className="text-gray-600">Grade</p>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Question-wise Analysis</h3>
          </div>
          <div className="p-6 space-y-6">
            {results.questions.map((question, index) => {
              const userAnswer = results.userAnswers[question.id];
              const selectedLabel = userAnswer?.selectedAnswer || "";
              const selectedIndex = selectedLabel ? selectedLabel.charCodeAt(0) - 65 : -1;
              const correctIndex = question.correctAnswerIndex;
              const isCorrect = selectedIndex === correctIndex;
              const getOptionText = (i) =>
                typeof question.options?.[i] === "object"
                  ? question.options[i]?.text || ""
                  : question.options?.[i] || "";

              return (
                <div key={question.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mr-3">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-gray-900">{question.questionText}</h4>
                    </div>
                    <Badge
                      className={
                        isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }
                    >
                      {isCorrect ? (
                        <>
                          <Check className="w-3 h-3 mr-1" /> Correct
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 mr-1" /> Incorrect
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                      <p className={`text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {selectedLabel
                          ? `${selectedLabel}) ${getOptionText(selectedIndex)}`
                          : "Not Answered"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {String.fromCharCode(65 + correctIndex)}) {getOptionText(correctIndex)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetakeQuiz} className="btn-primary">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
          </Button>
          <Button onClick={handleRetakeQuiz} className="btn-success">
            <Plus className="w-4 h-4 mr-2" /> Take New Quiz
          </Button>
          <Button onClick={handleDownloadResults} variant="outline">
            <Download className="w-4 h-4 mr-2" /> Download Results
          </Button>
        </div>
      </div>
    </div>
  );
}