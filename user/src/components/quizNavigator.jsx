import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function QuizNavigator({
  questions,
  answers,
  currentQuestionIndex,
  onQuestionSelect,
  onSubmitQuiz,
}) {
  const questionList = questions || [];

  const getQuestionStatus = (index) => {
    const question = questionList[index];
    const answer = answers?.[question?.id];

    if (index === currentQuestionIndex) return "current";
    if (answer?.isMarkedForReview) return "review";
    if (
      typeof answer?.selectedAnswer === "string" &&
      answer.selectedAnswer.trim() !== ""
    ) {
      return "answered";
    }

    return "unanswered";
  };

  const getButtonClass = (status) => {
    switch (status) {
      case "current":
        return "bg-blue-500 text-white";
      case "answered":
        return "bg-green-100 text-green-700";
      case "review":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const answeredCount = questionList.filter(
    (q) =>
      typeof answers?.[q.id]?.selectedAnswer === "string" &&
      answers[q.id].selectedAnswer.trim() !== ""
  ).length;

  const reviewCount = questionList.filter(
    (q) => answers?.[q.id]?.isMarkedForReview
  ).length;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64 max-h-[80vh] overflow-y-auto z-50">
      <h4 className="font-medium text-gray-900 mb-3">Question Navigator</h4>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {questionList.map((question, index) => {
          const status = getQuestionStatus(index);
          return (
            <button
              key={question.id || index}
              onClick={() => onQuestionSelect(index)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${getButtonClass(
                status
              )}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 text-xs mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded mr-2" />
          <span className="text-gray-600">Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-100 rounded mr-2" />
          <span className="text-gray-600">Marked for Review ({reviewCount})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 rounded mr-2" />
          <span className="text-gray-600">
            Not Answered ({questionList.length - answeredCount})
          </span>
        </div>
      </div>

      <Button
        onClick={onSubmitQuiz}
        className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Quiz
      </Button>
    </div>
  );
}
