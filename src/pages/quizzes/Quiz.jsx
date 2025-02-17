import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Rules from "./Rules";
import axios from "axios";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

const fetchQuizzes = async () => {
  const { data } = await axios.get("/quizzes.json");
  return data;
};

export default function Quiz() {
  const { id } = useParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery({ queryKey: ["quizzes"], queryFn: fetchQuizzes });

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

  const quizDetails = quizzes.quizzes.filter((q) => q.id === parseInt(id))[0];
  const questions = quizDetails.questions;

  const handleSelectOption = (option) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-white to-stone-300 py-12 min-h-screen">
      <motion.div
        className="w-2/3 bg-white p-8 rounded-lg shadow-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!quizStarted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-2">{quizDetails.title}</h2>
            <p className="text-gray-700 mb-2">{quizDetails.description}</p>
            <p className="text-gray-600 mb-4">
              Total Questions: {quizDetails.total_questions} | Time Limit:{" "}
              {quizDetails.time_limit}
            </p>
            <Rules />
            <div className="flex justify-between mt-6">
              <Link to="/quizzes">
                <button className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">
                  Go Back
                </button>
              </Link>
              <button
                className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
                onClick={() => setQuizStarted(true)}
              >
                Start Now
              </button>
            </div>
          </motion.div>
        ) : quizCompleted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-gray-700 mb-4">
              Your final score: {calculateScore()} / {questions.length}
            </p>
            <Link to="/quizzes">
              <button className="btn mt-4 bg-stone-500 text-white rounded-full px-6 hover:bg-stone-700 text-md">
                Quizzes Page
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              {questions[currentQuestion].question}
            </h3>
            <ul className="mb-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.li
                  key={index}
                  className={`border p-2 rounded mb-2 cursor-pointer ${
                    selectedAnswers[currentQuestion] === option
                      ? "bg-stone-300"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleSelectOption(option)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option}
                </motion.li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button
                className={`px-4 py-2 rounded ${
                  currentQuestion === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-700 text-white"
                }`}
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {currentQuestion === questions.length - 1 ? (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => setQuizCompleted(true)}
                >
                  Submit
                </button>
              ) : (
                <button
                  className={`px-4 py-2 rounded ${
                    currentQuestion === questions.length - 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-stone-500 hover:bg-stone-700 text-white"
                  }`}
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(questions.length - 1, prev + 1)
                    )
                  }
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
