import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import LoadingSpinner from "../../shared/LoadingSpinner";

import "@fontsource/galada";
import "@fontsource/tiro-bangla";
import { Link } from "react-router-dom";

const fetchQuizzes = async () => {
  const { data } = await axios.get("/quizzes.json");
  return data;
};

export default function Quizzes() {
  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery({ queryKey: ["quizzes"], queryFn: fetchQuizzes });
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  if (isLoading)
    return (
      <div className="text-center mt-10">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Error fetching quizzes
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-stone-600">
        Available Quizzes
      </h1>
      <p className="text-center mb-6 text-stone-600">
        A Fun Way to Learn—Select Your Quiz Now!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.quizzes.map((quiz) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gradient-to-b from-stone-200 to-slate-200 shadow-xl rounded-2xl border transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <h2
              className="text-xl font-semibold text-stone-800"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {quiz.title}
            </h2>
            <p className="text-xs bg-slate-300 px-4 py-1 rounded-full object-fit badge mb-2">
              {quiz.difficulty}
            </p>
            <p className="text-stone-700 mb-2">{quiz.description}</p>
            <p className="text-stone-700 mb-2 font-bold">
              Total Questions:{" "}
              <span
                className="font-normal"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {quiz.questions}
              </span>
            </p>
            <p className="text-stone-700 mb-4 font-bold">
              Setter: <span className="font-normal">{quiz.setter}</span>
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-stone-500 text-white font-semibold rounded-full shadow-md hover:bg-stone-700 transition"
                onClick={() => setSelectedQuiz(quiz)}
              >
                See Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quiz Details Modal */}
      {selectedQuiz && (
        <div
          className="modal modal-open fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelectedQuiz(null)}
        >
          <div
            className="modal-box bg-white shadow-lg rounded-lg p-6"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="font-bold text-lg text-stone-800">
              {selectedQuiz.title}
            </h2>
            <p className="py-4 text-stone-700">{selectedQuiz.description}</p>
            <p className="text-stone-700 mb-2 font-bold">
              Difficulty:{" "}
              <span className="font-normal">{selectedQuiz.difficulty}</span>
            </p>
            <p className="text-stone-700 mb-2 font-bold">
              Total Questions:{" "}
              <span className="font-normal">{selectedQuiz.questions}</span>
            </p>
            <p className="text-stone-700 mb-4 font-bold">
              Setter: <span className="font-normal">{selectedQuiz.setter}</span>
            </p>
            <div className="modal-action flex justify-center gap-4">
              <button
                className="btn bg-stone-200 rounded-full px-4 py-2 hover:bg-stone-400 text-md"
                onClick={() => setSelectedQuiz(null)}
              >
                Cancel
              </button>
              <Link to="/quiz">
                <button className="btn bg-stone-500 text-white rounded-full px-4 py-2 hover:bg-stone-700 text-md">
                  Start Quiz
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
