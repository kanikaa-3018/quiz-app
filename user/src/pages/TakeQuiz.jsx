import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DashboardNavbar from "../components/DashboardNavbar";
import ClassButton from "../components/ClassButton";
import SubjectCard from "../components/SubjectCard";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "../config";

const lowerClassSubjects = [
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "EVS",
];

const seniorSubjects = ["Physics", "Chemistry", "Mathematics", "Biology"];

const topics = [
  "Thermodynamics",
  "Organic Chemistry",
  "Algebra",
  "Cell Biology",
  "Grammar",
  "Light",
];

const getSubjectOptions = (cls) => {
  return cls <= 10 ? lowerClassSubjects : seniorSubjects;
};

const TakeQuiz = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const [quizConfig, setQuizConfig] = useState({
    class: "12",
    stream: "",
    subject: "",
    topic: "",
    questionCount: "10",
    duration: "15",
  });

  const currentClass = parseInt(quizConfig.class);
  const showStream = currentClass > 10;
  const availableSubjects = useMemo(() => getSubjectOptions(currentClass), [currentClass]);

  const startQuizMutation = useMutation({
    mutationFn: async (config) => {
      const params = new URLSearchParams({
        class: config.class,
        subject: config.subject,
        topic: config.topic || "",
        count: config.questionCount,
      });

      if (currentClass >= 11 && config.stream) {
        params.append("stream", config.stream);
      }

      const res = await fetch(`${API_BASE_URL}/quiz?${params.toString()}`);
      console.log(res)
      if (!res.ok) throw new Error("Failed to fetch quiz questions");
      return res.json();
    },
    onSuccess: (questions) => {
      if (questions.some((q) => q._id === undefined)) {
        toast({
          title: "AI Questions Used",
          description: "Some questions were generated using AI.",
        });
      }

      localStorage.setItem(
        "currentQuiz",
        JSON.stringify({
          config: quizConfig,
          questions,
          startTime: Date.now(),
          duration: parseInt(quizConfig.duration) * 60 * 1000,
        })
      );

      navigate("/quiz");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartQuiz = () => {
    if (
      !quizConfig.class ||
      (showStream && !quizConfig.stream) ||
      !quizConfig.subject
    ) {
      toast({
        title: "Missing Information",
        description: "Please select all required fields to start the quiz.",
        variant: "destructive",
      });
      return;
    }

    startQuizMutation.mutate(quizConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Choose Your Quiz</h1>
          <p className="text-gray-600">Select your class, subject and options to begin</p>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Class</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["5", "6", "7", "8", "9", "10", "11", "12"].map((cls) => (
              <ClassButton
                key={cls}
                number={cls}
                isSelected={quizConfig.class === cls}
                onClick={() =>
                  setQuizConfig((prev) => ({ ...prev, class: cls, subject: "", stream: "" }))
                }
              />
            ))}
          </div>
        </div>

        {/* Stream Selection */}
        {showStream && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Stream</h2>
            <div className="flex gap-4">
              {["PCM", "PCB"].map((stream) => (
                <button
                  key={stream}
                  className={`px-4 py-2 rounded-lg border ${
                    quizConfig.stream === stream
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() =>
                    setQuizConfig((prev) => ({ ...prev, stream }))
                  }
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subject Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableSubjects.map((subject) => (
              <SubjectCard
                key={subject}
                icon={<i className="fas fa-book text-xl" />}
                subject={subject}
                topics="..."
                topicsCount="--"
                questionsCount="--"
                isSelected={quizConfig.subject === subject}
                onClick={() =>
                  setQuizConfig((prev) => ({ ...prev, subject }))
                }
              />
            ))}
          </div>
        </div>

        {/* Optional Config */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium mb-1">Topic (optional)</label>
              <select
                value={quizConfig.topic}
                onChange={(e) => setQuizConfig({ ...quizConfig, topic: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                <option value="">Choose Topic</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium mb-1">Questions</label>
              <select
                value={quizConfig.questionCount}
                onChange={(e) => setQuizConfig({ ...quizConfig, questionCount: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                {[10, 15, 20, 25].map((n) => (
                  <option key={n} value={n}>{n} Questions</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <select
                value={quizConfig.duration}
                onChange={(e) => setQuizConfig({ ...quizConfig, duration: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                {[15, 20, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>{m} mins</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartQuiz}
            disabled={!quizConfig.subject || startQuizMutation.isPending}
            className={`px-8 py-3 rounded-md font-medium transition-all duration-300 transform ${
              quizConfig.subject
                ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {startQuizMutation.isPending ? "Starting..." : "Start Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
