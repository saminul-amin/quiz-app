import { useState, useEffect, useRef } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  User,
  Calendar,
  Target,
  BarChart3,
  Play,
  RefreshCw,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

const Quiz = () => {
  const { id: quizId } = useParams();
  // Mock navigation functions for demo
  const navigateToQuizzes = () => console.log("Navigate to /quizzes");
  const navigateToLeaderboard = (quizId) =>
    console.log(`Navigate to /leaderboard/quiz/${quizId}`);

  // State management
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [attempt, setAttempt] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);

  // Mock user - replace with actual user context
  const { user } = useAuth();
  console.log(user?.email);

  // Helper function to get user ID from database
  const getUserId = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.uid}`
      );
      if (response.ok) {
        const userData = await response.json();
        return userData.id;
      } else {
        // User doesn't exist, create them first
        const createResponse = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebase_uid: user.uid,
            username: user.displayName || user.email.split("@")[0],
            email: user.email,
            name: user.displayName || user.email.split("@")[0],
            role: "user",
          }),
        });

        if (createResponse.ok) {
          const newUser = await createResponse.json();
          return newUser.id;
        } else {
          throw new Error("Failed to create user");
        }
      }
    } catch (error) {
      throw new Error("Failed to get user ID: " + error.message);
    }
  };

  // Fetch quiz data
  useEffect(() => {
    if (user && quizId) {
      fetchQuiz();
    }
  }, [quizId, user]);

  // Mock API calls for demo - replace with actual API calls
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/quizzes/${quizId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch quiz");
      }

      const quizData = await response.json();
      console.log(quizData);
      setQuiz(quizData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Start quiz attempt
  const startQuiz = async () => {
    try {
      if (!user) {
        setError("Please log in to start the quiz");
        return;
      }

      // Get database user ID
      const userId = await getUserId();

      const response = await fetch(
        `http://localhost:3000/api/quizzes/${quizId}/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start quiz");
      }

      const attemptData = await response.json();
      setAttempt(attemptData);
      setQuizStarted(true);

      // Set question timer
      if (quiz.questions[0]) {
        setQuestionTimeLeft(quiz.questions[0].time_limit);
        startQuestionTimer(quiz.questions[0].time_limit);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Timer functions
  const startQuestionTimer = (timeLimit) => {
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);

    questionTimerRef.current = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle option selection
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionId,
    }));
  };

  // Submit answer and move to next question
  const handleNextQuestion = async () => {
    if (isSubmitting) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const timeSpent = currentQuestion.time_limit - questionTimeLeft;

    setIsSubmitting(true);

    try {
      // Submit answer to API
      const response = await fetch(
        `http://localhost:3000/api/attempts/${attempt.id}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_id: currentQuestion.id,
            selected_option_id: selectedOption,
            text_answer: null, // For multiple choice, this is null
            time_taken: timeSpent,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit answer");
      }

      if (currentQuestionIndex < quiz.questions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        const nextQuestion = quiz.questions[currentQuestionIndex + 1];
        setQuestionTimeLeft(nextQuestion.time_limit);
        startQuestionTimer(nextQuestion.time_limit);
      } else {
        // Complete quiz
        await completeQuiz();
      }
    } catch (err) {
      setError("Failed to submit answer: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete quiz
  const completeQuiz = async () => {
    try {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);

      const response = await fetch(
        `http://localhost:3000/api/attempts/${attempt.id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete quiz");
      }

      const resultsData = await response.json();
      setResults(resultsData);
      setQuizCompleted(true);
      setShowResults(true);
    } catch (err) {
      setError("Failed to complete quiz: " + err.message);
    }
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            Please log in to access this quiz.
          </p>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
  //       <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
  //         <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2">
  //           Oops! Something went wrong
  //         </h2>
  //         <p className="text-gray-600 mb-6">{error}</p>
  //         <button
  //           onClick={navigateToQuizzes}
  //           className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
  //         >
  //           Back to Quizzes
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Quiz results screen
  if (showResults && results) {
    const passed = results.score >= quiz.passing_score;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div
              className={`px-8 py-12 text-center ${
                passed
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-orange-500 to-red-600"
              } text-white`}
            >
              <div className="mb-6">
                {passed ? (
                  <Trophy className="h-20 w-20 mx-auto animate-bounce" />
                ) : (
                  <RefreshCw className="h-20 w-20 mx-auto" />
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">
                {passed ? "Congratulations!" : "Keep Trying!"}
              </h1>
              <p className="text-xl opacity-90">
                {passed ? "You passed the quiz!" : "You can retake this quiz"}
              </p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Your Results
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Score</span>
                      <span
                        className={`text-2xl font-bold ${
                          passed ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {results.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Points Earned
                      </span>
                      <span className="text-xl font-semibold text-gray-800">
                        {results.earned_points} / {results.total_points}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Time Taken
                      </span>
                      <span className="text-xl font-semibold text-gray-800">
                        {Math.floor(results.total_time_taken / 60)}m{" "}
                        {results.total_time_taken % 60}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Attempt</span>
                      <span className="text-xl font-semibold text-gray-800">
                        #{results.attempt_number}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Quiz Info
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        {quiz.title}
                      </h4>
                      <p className="text-blue-600">{quiz.description}</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Difficulty
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
                        {quiz.difficulty_level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Passing Score
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        {quiz.passing_score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={navigateToQuizzes}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                >
                  Back to Quizzes
                </button>
                {!passed && quiz.max_attempts !== 1 && (
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={() => navigateToLeaderboard(quiz.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white text-center">
              <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
              <p className="text-xl opacity-90">{quiz.description}</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Quiz Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Difficulty:{" "}
                        </span>
                        <span className="capitalize font-semibold text-blue-600">
                          {quiz.difficulty_level}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <Target className="h-6 w-6 text-green-600" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Passing Score:{" "}
                        </span>
                        <span className="font-semibold text-green-600">
                          {quiz.passing_score}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <RefreshCw className="h-6 w-6 text-purple-600" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Max Attempts:{" "}
                        </span>
                        <span className="font-semibold text-purple-600">
                          {quiz.max_attempts === 0
                            ? "Unlimited"
                            : quiz.max_attempts}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Quiz Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <User className="h-6 w-6 text-yellow-600" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Created by:{" "}
                        </span>
                        <span className="font-semibold text-yellow-600">
                          {quiz.creator_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-indigo-600" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Questions:{" "}
                        </span>
                        <span className="font-semibold text-indigo-600">
                          {quiz.questions.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                      <Clock className="h-6 w-6 text-red-600" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Each Question Timed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
                >
                  <Play className="h-6 w-6" />
                  Start Quiz
                </button>
                <p className="text-gray-600 mt-4">
                  Good luck! Take your time and read each question carefully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question screen
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleApiError = (error) => {
    if (error.status === 401) {
      setError("Please log in again to continue");
    } else if (error.status === 403) {
      setError("You do not have permission to access this quiz");
    } else if (error.status === 404) {
      setError("Quiz not found");
    } else {
      setError(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-in">
          {/* Timer */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4 text-white">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-bold">
                {Math.floor(questionTimeLeft / 60)}:
                {(questionTimeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                  {currentQuestion.question_text}
                </h2>
                <div className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  {currentQuestion.points}{" "}
                  {currentQuestion.points === 1 ? "point" : "points"}
                </div>
              </div>
            </div>

            {/* Answer options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                    selectedOption === option.id
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option.id
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOption === option.id && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-800">
                      {option.option_text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  currentQuestionIndex > 0 &&
                  setCurrentQuestionIndex((prev) => prev - 1)
                }
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={!selectedOption || isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    {currentQuestionIndex === quiz.questions.length - 1
                      ? "Finish Quiz"
                      : "Next Question"}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Quiz;
