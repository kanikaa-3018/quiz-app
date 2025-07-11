import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";
import {
  Clock,
  Pause,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
} from "lucide-react";
import QuizNavigator from "@/components/quizNavigator.jsx";
import { API_BASE_URL } from '../config';

export default function QuizInterface() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")); 
const studentId = user?._id;

  useEffect(() => {
    const stored = localStorage.getItem("currentQuiz");
    if (!stored) {
      navigate("/student");
      return;
    }
    const data = JSON.parse(stored);

    const questions = data.questions.map((q, idx) => {
      return {
        id: q.id || `qid-${idx}`,
        ...structuredClone(q),
        options: q.options.map((opt, i) =>
          typeof opt === "string"
            ? { label: String.fromCharCode(65 + i), text: opt }
            : { ...opt }
        ),
      };
    });

    setQuizData({ ...data, questions });
    setTimeRemaining(
      Math.floor((data.startTime + data.duration - Date.now()) / 1000)
    );
  }, [navigate]);

  useEffect(() => {
    if (!quizData || isPaused || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizData, isPaused, timeRemaining]);

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        selectedAnswer,
        isMarkedForReview: prev[questionId]?.isMarkedForReview || false,
      },
    }));
  };

  const handleMarkForReview = () => {
    if (!quizData) return;
    const questionId = quizData.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        selectedAnswer: prev[questionId]?.selectedAnswer || "",
        isMarkedForReview: !prev[questionId]?.isMarkedForReview,
      },
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;

    const quizAnswers = quizData?.questions?.map((question) => {
      const userAnswer = answers[question.id];
      const selectedLabel = userAnswer?.selectedAnswer || "";
      const selectedIndex =
        selectedLabel.length > 0 ? selectedLabel.charCodeAt(0) - 65 : -1;
      const correctIndex = question.correctAnswerIndex;

      const correctLabel =
        typeof correctIndex === "number"
          ? String.fromCharCode(65 + correctIndex)
          : "";
      const correctText = question.options?.[correctIndex]?.text || "";

      return {
        questionId: question._id,
        selectedIndex,
        correctIndex,
        selectedLabel,
        correctLabel,
        correctText,
      };
    });

    const correctAnswers = quizAnswers.filter(
      (q) => q.selectedIndex === q.correctIndex
    ).length;

    const score = Math.round(
      (correctAnswers / quizData.questions.length) * 100
    );

    const timeSpent = Math.floor(
      (quizData.duration - timeRemaining * 1000) / 1000
    );

    const classNumber = Number(quizData.config.class);
    const streamValue =
      classNumber < 11 || quizData.config.stream === "None"
        ? null
        : quizData.config.stream;

    const quizResult = {
      student: studentId,
      questions: quizAnswers,
      score,
      timeTaken: timeSpent,
      class: classNumber,
      stream: streamValue,
      subject: quizData.config.subject,
      topic: quizData.config.topic || null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizResult),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");

      localStorage.setItem(
        "quizResults",
        JSON.stringify({
          ...quizResult,
          questions: quizData.questions,
          userAnswers: answers,
        })
      );

      localStorage.removeItem("currentQuiz");
      navigate("/results");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goToQuestion = (index) => setCurrentQuestionIndex(index);
  const nextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const currentQuestion = quizData?.questions?.[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  const progress =
    ((currentQuestionIndex + 1) / (quizData?.questions?.length || 1)) * 100;
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {quizData.config.subject} Quiz
                </h3>
                <p className="text-sm text-blue-700">
                  Question {currentQuestionIndex + 1} of {quizData.questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Clock
                      className={`w-5 h-5 ${
                        timeRemaining < 300 ? "text-red-500" : "text-orange-500"
                      }`}
                    />
                    <span
                      className={`font-mono text-lg font-semibold ${
                        timeRemaining < 300 ? "text-red-900" : "text-gray-900"
                      }`}
                    >
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsPaused(!isPaused)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="w-full h-2" />
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8">
            <div className="mb-8">
              <h4 className="text-xl font-medium text-gray-900 mb-4">
                {currentQuestion.questionText}
              </h4>
              <p className="text-gray-600 text-sm mb-6">
                Select the correct answer from the options below:
              </p>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <label
                  key={`${currentQuestion.id}-${option.label}`}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentAnswer?.selectedAnswer === option.label
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.label}
                    checked={currentAnswer?.selectedAnswer === option.label}
                    onChange={(e) =>
                      handleAnswerSelect(currentQuestion.id, e.target.value)
                    }
                    className="mt-1 mr-4 text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mr-3">
                        {option.label}
                      </span>
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                  className={
                    currentAnswer?.isMarkedForReview
                      ? "bg-orange-100 text-orange-700"
                      : ""
                  }
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {currentAnswer?.isMarkedForReview
                    ? "Unmark"
                    : "Mark for Review"}
                </Button>

                {currentQuestionIndex === quizData.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="btn-primary">
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <QuizNavigator
          questions={quizData.questions}
          answers={answers}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionSelect={goToQuestion}
          onSubmitQuiz={handleSubmitQuiz}
        />
      </div>
    </div>
  );
}
