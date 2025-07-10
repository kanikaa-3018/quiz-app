import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Users,
  Play,
  Clock,
  BookOpen,
  Tags,
  ListOrdered,
  Info,
  TrendingUp,
  Award,
  Timer,
} from "lucide-react";
import { API_BASE_URL } from '../config';

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

export default function StudentPortal() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [quizConfig, setQuizConfig] = useState({
    class: "",
    stream: "",
    subject: "",
    topic: "",
    questionCount: "10",
    duration: "15",
  });

  const currentClass = parseInt(quizConfig.class || 0);
  const showStream = currentClass > 10;
  const availableSubjects = useMemo(
    () => getSubjectOptions(currentClass),
    [currentClass]
  );

  const { data: recentAttempts } = useQuery({
    queryKey: ["/api/quiz/attempts"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/quiz/attempts`);
      if (!res.ok) throw new Error("Failed to fetch attempts");
      return res.json();
    },
  });

  const startQuizMutation = useMutation({
    mutationFn: async (config) => {
      const params = new URLSearchParams({
        class: config.class,
        subject: config.subject,
        topic: config.topic || "",
        count: config.questionCount,
      });

      if (config.class >= 11 && config.stream !== "None") {
        params.append("stream", config.stream);
      }

      const response = await fetch(
        `${API_BASE_URL}/quiz?` + params.toString()
      );

      if (!response.ok) throw new Error("Failed to fetch quiz questions");
      return response.json();
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

  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (
      !quizConfig.class ||
      (!quizConfig.stream && showStream) ||
      !quizConfig.subject
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please select class, stream (if required), and subject to start the quiz.",
        variant: "destructive",
      });
      return;
    }
    startQuizMutation.mutate(quizConfig);
  };

  const updateConfig = (field, value) => {
    setQuizConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">
              <GraduationCap className="inline mr-2" /> EduQuiz Platform
            </h1>
            <nav className="hidden md:flex space-x-8">
              <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                Admin Dashboard
              </Link>
              <Link
                href="/student"
                className="text-gray-700 hover:text-blue-600"
              >
                Student Portal
              </Link>
            </nav>
            <Button className="btn-primary">
              <Users className="w-4 h-4 mr-2" /> Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Student Quiz Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your class, stream, and subject to start practicing with
            customized quizzes.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6">Start a New Quiz</h3>
          <form onSubmit={handleStartQuiz} className="space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="w-full">
                  <label className="text-sm font-medium mb-2 block">
                    Select Class
                  </label>
                  <Select
                    value={quizConfig.class}
                    onValueChange={(value) => updateConfig("class", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent className="z-1000 bg-white">
                      {[...Array(8)].map((_, i) => (
                        <SelectItem key={i + 5} value={(i + 5).toString()}>
                          Class {i + 5}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showStream && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Stream
                    </label>
                    <Select
                      value={quizConfig.stream}
                      onValueChange={(value) => updateConfig("stream", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Stream" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white">
                        <SelectItem value="PCM">PCM</SelectItem>
                        <SelectItem value="PCB">PCB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <Select
                    value={quizConfig.subject}
                    onValueChange={(value) => updateConfig("subject", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                      {availableSubjects.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Topic
                  </label>
                  <Select
                    value={quizConfig.topic}
                    onValueChange={(value) => updateConfig("topic", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Topic (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Number of Questions
                  </label>
                  <Select
                    value={quizConfig.questionCount}
                    onValueChange={(value) =>
                      updateConfig("questionCount", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                      {[10, 15, 20, 25, 30].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} Questions
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration
                  </label>
                  <Select
                    value={quizConfig.duration}
                    onValueChange={(value) => updateConfig("duration", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                      {[15, 20, 30, 45, 60].map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {m} Minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Quiz Instructions
                  </h4>
                  <ul className="text-sm text-blue-700 list-disc list-inside">
                    <li>Questions are randomized</li>
                    <li>Auto-submit on time expiry</li>
                    <li>Review before submission</li>
                    <li>Results shown immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={startQuizMutation.isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold"
              >
                {startQuizMutation.isPending ? (
                  <>
                    <Timer className="w-5 h-5 mr-3 animate-spin" /> Loading
                    Quiz...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-3" /> Start Quiz
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Quiz History</h3>
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="space-y-4">
              {recentAttempts.map((attempt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {attempt.subject} - {attempt.topic || "General"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Class {attempt.class} •{" "}
                      {new Date(attempt.createdAt).toLocaleDateString()} •{" "}
                      {attempt.questionCount} Questions
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        attempt.score >= 80
                          ? "text-green-600"
                          : attempt.score >= 60
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {attempt.score}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.floor(attempt.timeTaken / 60)}:
                      {(attempt.timeTaken % 60).toString().padStart(2, "0")}{" "}
                      mins
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No quiz attempts yet.</p>
          )}
        </Card>
      </main>
    </div>
  );
}
