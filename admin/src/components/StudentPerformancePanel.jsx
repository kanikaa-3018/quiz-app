import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CSVLink } from "react-csv";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "../config";

export default function StudentPerformancePanel() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState({
    class: "",
    stream: "",
    subject: "",
    name: "",
  });
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [answerModal, setAnswerModal] = useState({ open: false, data: [] });
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/students/summary`)
      .then((res) => setStudents(res.data));
  }, []);

  useEffect(() => {
    if (filter.class >= 5 && filter.class <= 10) {
      setFilter((f) => ({ ...f, stream: "" }));
      setAvailableSubjects(["Math", "Science", "English", "SST"]);
    } else if (filter.class >= 11) {
      setAvailableSubjects(
        filter.stream === "PCM"
          ? ["Math", "Physics", "Chemistry"]
          : filter.stream === "PCB"
          ? ["Biology", "Physics", "Chemistry"]
          : []
      );
    } else {
      setAvailableSubjects([]);
    }
    setSelectedStudent(null);
    setResults([]);
    setPage(1);
  }, [filter.class, filter.stream]);

  const handleView = (studentId) => {
    axios.get(`${API_BASE_URL}/students/${studentId}/results`).then((res) => {
      setSelectedStudent(res.data.student);
      setResults(res.data.results);
      setPage(1);
    });
  };

  const handleViewAnswers = (submissionId) => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE_URL}/submissions/view/${submissionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAnswerModal({ open: true, data: res?.data?.answers });
      })
      .catch((err) => {
        console.error(
          "Failed to fetch answers:",
          err.response?.data || err.message
        );
      });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      (!filter.class || String(s.class) === filter.class) &&
      (!filter.stream || s.stream === filter.stream) &&
      (!filter.subject || s.subject === filter.subject)
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const chartData = results.map((res) => ({
    date: new Date(res.createdAt).toLocaleDateString(),
    score: res.score,
  }));

  const csvData = results.map((res) => ({
    Subject: res.subject,
    Topic: res.topic,
    Score: res.score,
    TimeTaken: res.timeTaken,
    Date: new Date(res.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Student Performance Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          className="border p-2 rounded-md"
          placeholder="Search by name"
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <select
          className="border p-2 rounded-md"
          onChange={(e) => setFilter({ ...filter, class: e.target.value })}
        >
          <option value="">Filter by class</option>
          {[5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
            <option key={cls}>{cls}</option>
          ))}
        </select>
        {filter.class >= 11 && (
          <select
            className="border p-2 rounded-md"
            onChange={(e) => setFilter({ ...filter, stream: e.target.value })}
          >
            <option value="">Filter by stream</option>
            <option value="PCM">PCM</option>
            <option value="PCB">PCB</option>
          </select>
        )}
        {availableSubjects.length > 0 && (
          <select
            className="border p-2 rounded-md"
            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          >
            <option value="">Filter by subject</option>
            {availableSubjects.map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-4">
        {paginatedStudents.map((student) => (
          <Card key={student._id} className="border shadow-md rounded-xl">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-blue-700">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Class: {student.class} | Stream: {student.stream}
                </p>
                <p className="text-sm text-gray-600">
                  Total Quizzes: {student.totalQuizzes} | Avg Score:{" "}
                  {student.avgScore}%
                </p>
              </div>
              <Button
                className="mt-4 md:mt-0"
                onClick={() => handleView(student._id)}
              >
                View Performance
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {selectedStudent && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">
              {selectedStudent.name}'s Quiz History
            </h3>
            <CSVLink
              data={csvData}
              filename={`${selectedStudent.name}_performance.csv`}
            >
              <Button variant="outline">Download CSV</Button>
            </CSVLink>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto mt-6 border rounded-lg shadow-sm pb-3">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="p-3">Subject</th>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Time Taken</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.slice((page - 1) * 10, page * 10).map((res, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="p-3">{res.subject}</td>
                    <td>{res.topic}</td>
                    <td>{res.score}</td>
                    <td>{res.timeTaken} sec</td>
                    <td>{new Date(res.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnswers(res._id)}
                      >
                        View Answers
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                ‹
              </Button>
              <span className="px-3 py-1 border rounded bg-blue-50 text-blue-700">
                Page {page} of {Math.ceil(results.length / 10)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min(p + 1, Math.ceil(results.length / 10))
                  )
                }
                disabled={page === Math.ceil(results.length / 10)}
              >
                ›
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.ceil(results.length / 10))}
                disabled={page === Math.ceil(results.length / 10)}
              >
                »
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog
  open={answerModal.open}
  onOpenChange={(open) => setAnswerModal({ open, data: null })}
>
  <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
    <DialogTitle>Submitted Answers</DialogTitle>

    <div className="mt-4 space-y-3 text-sm">
      {answerModal.data?.length > 0 ? (
        answerModal.data.map((ans, i) => (
          <div key={i} className="border p-3 rounded bg-gray-50">
            <p>
              <strong>Q:</strong> {ans.question}
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {ans.options.map((opt, idx) => (
                <li
                  key={idx}
                  className={
                    idx === ans.correctIndex
                      ? "text-green-700 font-semibold"
                      : idx === ans.selectedIndex
                      ? "text-red-600"
                      : ""
                  }
                >
                  {opt}{" "}
                  {idx === ans.selectedIndex && "(Selected)"}{" "}
                  {idx === ans.correctIndex && "(Correct)"}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No answers found.</p>
      )}
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
}
