import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Upload,
  BarChart3,
  Settings,
  Plus,
  Users,
  ClipboardCheck,
  Percent,
  HelpCircle,
} from "lucide-react";
import QuestionForm from "@/components/questionForm";
import QuestionsTable from "@/components/questionsTable";
import BulkUploadModal from "@/components/bulkUploadModal";
import { API_BASE_URL } from '../config';

export default function AdminDashboard() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [filters, setFilters] = useState({
    class: "all",
    stream: "all",
    subject: "all",
    topic: "all",
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      // console.log(response.json())
      return response.json();
      console.log(stats);
    },
  });

  const { data: questionsData, refetch: refetchQuestions } = useQuery({
    queryKey: ["questions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value);
      });

      const response = await fetch(
        `${API_BASE_URL}/questions?${params}`
      );
      if (!response.ok) throw new Error("Failed to fetch questions");
      return response.json();
    },
  });

  const handleQuestionCreated = () => {
    setShowQuestionForm(false);
    refetchQuestions();
    toast({
      title: "Success",
      description: "Question created successfully",
    });
  };

  const handleBulkUploadSuccess = () => {
    setShowBulkUpload(false);
    refetchQuestions();
    toast({
      title: "Success",
      description: "Questions uploaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                <GraduationCap className="inline mr-2" />
                Tinker Tutor
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/student-stats"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Students Performance
              </Link>
              {/* <Link
                href="/student"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Student Portal
              </Link> */}
            </nav>
            <Link href="/admin/profile">
            <div className="flex items-center space-x-4">
              <Button className="btn-primary">
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div></Link>
            
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Panel
              </h2>
              <nav className="space-y-2">
                <a href="#questions" className="nav-link nav-link-active">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  Manage Questions
                </a>
                <button
                  onClick={() => setShowBulkUpload(true)}
                  className="nav-link nav-link-inactive w-full text-left"
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Bulk Upload
                </button>
                <a href="#analytics" className="nav-link nav-link-inactive">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Analytics
                </a>
                <a href="#settings" className="nav-link nav-link-inactive">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
              </nav>
            </Card>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="stat-icon bg-blue-100">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Questions
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.totalQuestions || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="stat-icon bg-green-100">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Students
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.activeStudents || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="stat-icon bg-orange-100">
                    <ClipboardCheck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Quizzes Taken
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.quizzesTaken || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="stat-icon bg-purple-100">
                    <Percent className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Score
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats?.avgScore ? `${stats.avgScore}%` : "0%"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {showQuestionForm && (
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add New Question
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowQuestionForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <QuestionForm onSuccess={handleQuestionCreated} />
              </Card>
            )}

            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question Bank
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex space-x-2">
                      <Select
                        value={filters.class}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, class: value }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {["5", "6", "7", "8", "9", "10", "11", "12"].map(
                            (c) => (
                              <SelectItem
                                key={c}
                                value={c}
                                className="hover:bg-gray-100 cursor-pointer"
                              >
                                Class {c}
                              </SelectItem>
                            )
                          )}
                          <SelectItem
                            value="all"
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            All Classes
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.stream}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, stream: value }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="All Streams" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem
                            value="all"
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            All Streams
                          </SelectItem>
                          <SelectItem
                            value="PCM"
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            PCM
                          </SelectItem>
                          <SelectItem
                            value="PCB"
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            PCB
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.subject}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, subject: value }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {[
                            "Physics",
                            "Chemistry",
                            "Mathematics",
                            "Biology",
                          ].map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="hover:bg-gray-100 cursor-pointer"
                            >
                              {s}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value="all"
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            All Subjects
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setShowBulkUpload(true)}
                        className="btn-success"
                      >
                        <Upload className="w-4 h-4 mr-2" /> Bulk Upload
                      </Button>
                      <Button
                        onClick={() => setShowQuestionForm(true)}
                        className="btn-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Question
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <QuestionsTable
                questions={questionsData?.questions || []}
                onUpdate={refetchQuestions}
              />
            </Card>
          </div>
        </div>
      </main>

      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onSuccess={handleBulkUploadSuccess}
        />
      )}
    </div>
  );
}
