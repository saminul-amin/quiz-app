import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const quizDetails = {
  title: "Sample Quiz",
  description:
    "This quiz tests your knowledge on various topics. Answer carefully and try your best!",
  totalQuestions: 5,
  timeLimit: "10 minutes",
};

const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correct: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correct: "Mars",
  },
  {
    id: 3,
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"],
    correct: "Harper Lee",
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: "Pacific",
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Olive"],
    correct: "Oxygen",
  },
];

export default function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

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
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-white to-stone-300">
      <motion.div
        className="w-96 lg:w-1/3 bg-white p-8 rounded-lg shadow-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!quizStarted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-2">{quizDetails.title}</h2>
            <p className="text-gray-700 mb-2">{quizDetails.description}</p>
            <p className="text-gray-600 mb-4">
              Total Questions: {quizDetails.totalQuestions} | Time Limit:{" "}
              {quizDetails.timeLimit}
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => alert("Going back")}
              >
                Go Back
              </button>
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
