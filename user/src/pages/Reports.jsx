import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { useUser } from "../context/UserContext";
import axios from 'axios'

const Reports = () => {
  const { userData } = useUser();
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [timeFilter, setTimeFilter] = useState("Last 30 Days");
  const [results, setResults] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(localStorage.getItem("token"))

  useEffect(() => {
    const fetchRecentAttempts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/quiz/attempts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res)
        
        setQuizHistory(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Failed to fetch recent quiz attempts:", err);
      }
    };

    fetchRecentAttempts();
  }, []);

  // useEffect(() => {
  //   const stored = localStorage.getItem("quizResults");
  //   if (stored) {
  //     const parsed = JSON.parse(stored);
     
  //     setResults(Array.isArray(parsed) ? parsed : [parsed]);
  //     console.log(results)
  //   }
  // }, []);

  useEffect(() => {
  const fetchQuizAttempts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/quiz/attempts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Failed to fetch recent quiz attempts:", err);
    }
  };

  fetchQuizAttempts();
}, []);

  const getTotalQuizzes = () => results.length;

  const getTotalTime = () => {
    const totalSec = results.reduce((sum, r) => sum + (r.timeTaken || 0), 0);
    return (totalSec / 3600).toFixed(1); // in hours
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + (r.score || 0), 0);
    return Math.round(total / results.length);
  };

  const getSubjectStats = () => {
    const stats = {};
    results.forEach((r) => {
      const subject = r.subject;
      if (!stats[subject]) {
        stats[subject] = {
          id: subject.toLowerCase(),
          name: subject,
          quizzes: 0,
          totalTime: 0,
          totalScore: 0,
        };
      }
      stats[subject].quizzes += 1;
      stats[subject].totalTime += r.timeTaken || 0;
      stats[subject].totalScore += r.score || 0;
    });

    return Object.values(stats).map((s) => ({
      ...s,
      timeStudied: (s.totalTime / 3600).toFixed(1) + "h",
      average: Math.round(s.totalScore / s.quizzes),
      icon:
        s.name === "Physics"
          ? "atom"
          : s.name === "Chemistry"
          ? "flask"
          : "square-root-alt",
      color:
        s.name === "Physics"
          ? "blue"
          : s.name === "Chemistry"
          ? "green"
          : "purple",
    }));
  };

  const subjectPerformance = getSubjectStats();
  const averageScore = getAverageScore();
  const totalTimeStudied = getTotalTime();
  const totalQuizzes = getTotalQuizzes();

  // const quizHistory = results.slice(-5).reverse().map((r, i) => ({
  //   id: i + 1,
  //   date: new Date(r.date || Date.now()).toLocaleDateString(),
  //   subject: r.subject,
  //   topic: r.topic || "N/A",
  //   score: r.score,
  //   time: new Date(r.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //   status: 'Completed'
  // }));

  // Same as your teammate's helper function for rendering progress bars and icons
  const renderProgressBar = (percentage, subject) => {
    const getGradient = () => {
      switch (subject) {
        case "Physics":
          return "bg-gradient-to-r from-blue-400 to-blue-500";
        case "Chemistry":
          return "bg-gradient-to-r from-green-400 to-green-500";
        case "Mathematics":
          return "bg-gradient-to-r from-purple-400 to-purple-500";
        default:
          return "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500";
      }
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${getGradient()} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const renderSubjectIcon = (icon, color) => {
    const getBgColor = () => {
      switch (color) {
        case "blue":
          return "bg-blue-100";
        case "green":
          return "bg-green-100";
        case "purple":
          return "bg-purple-100";
        default:
          return "bg-gray-100";
      }
    };
    return (
      <div
        className={`${getBgColor()} w-10 h-10 rounded flex items-center justify-center`}
      >
        <i className={`fas fa-${icon}`}></i>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Report Card</h1>
          <p className="text-gray-600">Track your progress and performance</p>
        </div>

        {/* Filters (same as before) */}
        <div className="flex flex-col md:flex-row justify-end gap-4 mb-6">
          <div className="relative">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="block w-full p-2.5 bg-white border border-gray-200 rounded-md pr-8"
            >
              <option>All Subjects</option>
              {subjectPerformance.map((s) => (
                <option key={s.name}>{s.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="block w-full p-2.5 bg-white border border-gray-200 rounded-md pr-8"
            >
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        {/* Overall Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">Overall Performance</h2>
              <i className="fas fa-chart-line text-blue-500"></i>
            </div>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {averageScore}%
            </div>
            <div className="text-sm text-gray-500 mb-4">Average Score</div>
            {renderProgressBar(averageScore)}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">Total Quizzes</h2>
              <i className="fas fa-clipboard-list text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {totalQuizzes}
            </div>
            <div className="text-sm text-gray-500 mb-4">Completed</div>
            <div className="flex items-center text-sm text-green-500">
              <i className="fas fa-arrow-up mr-1"></i>
              <span>Keep going!</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">Study Time</h2>
              <i className="fas fa-clock text-orange-500"></i>
            </div>
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {totalTimeStudied}h
            </div>
            <div className="text-sm text-gray-500 mb-4">Logged Time</div>
          </div>
        </div>

        {/* Subject Performance Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Subject Performance</h2>
          <div className="space-y-6">
            {subjectPerformance.map((subject) => (
              <div key={subject.id} className="flex items-center">
                <div className="mr-4">
                  {renderSubjectIcon(subject.icon, subject.color)}
                </div>
                <div className="flex-grow mr-6">
                  <div className="flex justify-between mb-1">
                    <div>
                      <h3 className="font-medium">{subject.name}</h3>
                      <p className="text-xs text-gray-500">
                        {subject.quizzes} quizzes • {subject.timeStudied}{" "}
                        studied
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{subject.average}%</p>
                      <p className="text-xs text-gray-500">Average</p>
                    </div>
                  </div>
                  {renderProgressBar(subject.average, subject.name)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Quiz History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Topic</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((quiz, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-4">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">{quiz.subject}</td>
                    <td className="py-4">{quiz.topic}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          quiz.score >= 90
                            ? "bg-green-100 text-green-800"
                            : quiz.score >= 80
                            ? "bg-blue-100 text-blue-800"
                            : quiz.score >= 70
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quiz.score}%
                      </span>
                    </td>
                    <td className="py-4">
                      {new Date(quiz.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
