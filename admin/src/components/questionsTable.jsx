import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import QuestionForm from "./questionForm";

export default function QuestionsTable({ questions, onUpdate }) {
  const { toast } = useToast();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const QUESTIONS_PER_PAGE = 5;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest("DELETE", `/api/questions/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      onUpdate();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditSuccess = () => {
    setEditingQuestion(null);
    onUpdate();
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No questions found. Add your first question to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class/Stream</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correct</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedQuestions.map((question, index) => (
            <tr key={question._id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-600">
                {(currentPage - 1) * QUESTIONS_PER_PAGE + index + 1}
              </td>
              <td className="px-6 py-4 max-w-xs truncate">{question.questionText}</td>
              <td className="px-6 py-4">
                <Badge className="mr-2">Class {question.class}</Badge>
                <Badge variant="outline">{question.stream}</Badge>
              </td>
              <td className="px-6 py-4">{question.subject}</td>
              <td className="px-6 py-4">{question.topic}</td>
              <td className="px-6 py-4 text-green-600 font-medium">
                Option {String.fromCharCode(65 + question.correctAnswerIndex)}
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  {/* Preview Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewQuestion(question)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                      <DialogHeader>
                        <DialogTitle>Preview Question</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <h4 className="font-semibold">{previewQuestion?.questionText}</h4>
                        {previewQuestion?.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded ${
                              i === previewQuestion.correctAnswerIndex
                                ? "bg-green-100 border-1 border-green-200"
                                : "bg-gray-100 border-1 border-gray-400"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}) {opt}
                          </div>
                        ))}
                        <p className="text-sm text-gray-600">
                          Class {previewQuestion?.class} • Stream {previewQuestion?.stream} •{" "}
                          {previewQuestion?.subject} - {previewQuestion?.topic}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuestion(question)}
                        className="text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                      <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                      </DialogHeader>
                      <QuestionForm
                        initialData={{
                          ...editingQuestion,
                          optionA: editingQuestion?.options?.[0] || "",
                          optionB: editingQuestion?.options?.[1] || "",
                          optionC: editingQuestion?.options?.[2] || "",
                          optionD: editingQuestion?.options?.[3] || "",
                          correctAnswer: String.fromCharCode(
                            65 + editingQuestion?.correctAnswerIndex
                          ),
                        }}
                        questionId={editingQuestion?._id}
                        onSuccess={handleEditSuccess}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(question._id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="ghost"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
