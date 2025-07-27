// Main QuizCreator component - orchestrates the entire quiz creation flow
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

// Import sub-components
import ProgressSteps from "./ProgressSteps";
import BasicInfoStep from "./BasicInfoStep";
import QuestionsStep from "./QuestionsStep";
import SettingsStep from "./SettingsStep";
import LoadingScreen from "./LoadingScreen";
import Notification from "./Notification";

// Import hooks and utilities
import { useQuizData } from "./hooks/useQuizData";
import { useQuestions } from "./hooks/useQuestions";
import { useQuizSubmission } from "./hooks/useQuizSubmission";

const QuizCreator = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userDbId, setUserDbId] = useState(null);

  // Custom hooks for data management
  const { quizData, handleQuizDataChange } = useQuizData();
  const { questions, questionHandlers } = useQuestions();
  const { handleSubmit, isSubmitting } = useQuizSubmission({
    quizData,
    questions,
    userDbId,
    axios,
    navigate,
    showNotification,
  });

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      if (!user?.email) return;

      setIsLoading(true);
      try {
        await Promise.all([fetchCategories(), fetchTags(), createOrGetUser()]);
      } catch (error) {
        showNotification("error", "Failed to load initial data");
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  // Create or get user in database
  const createOrGetUser = async () => {
    if (!user?.email) return;

    try {
      const userData = {
        firebase_uid: user.uid,
        username: user.displayName || user.email?.split("@")[0] || "user",
        email: user.email,
        name: user.displayName || "User",
        role: "user",
      };

      const response = await axios.post("/users", userData);
      setUserDbId(response.data.id);
    } catch (error) {
      console.error("Error creating/getting user:", error);
      try {
        const response = await axios.get(`/users/${user.uid}`);
        setUserDbId(response.data.id);
      } catch (getError) {
        console.error("Error getting user:", getError);
        showNotification("error", "Authentication error. Please try again.");
      }
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotification("error", "Failed to load categories");
    }
  };

  // Fetch tags from backend
  const fetchTags = async () => {
    try {
      const response = await axios.get("/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      showNotification("error", "Failed to load tags");
    }
  };

  function showNotification(type, message) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  // Show loading screen while initializing
  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notification */}
      {notification && <Notification notification={notification} />}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/quizzes")}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="text-slate-600" size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Create New Quiz
              </h1>
              <p className="text-slate-600 mt-1">
                Build an engaging quiz for your audience
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <BasicInfoStep
              quizData={quizData}
              categories={categories}
              onQuizDataChange={handleQuizDataChange}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <QuestionsStep
              questions={questions}
              questionHandlers={questionHandlers}
              onPrevious={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <SettingsStep
              quizData={quizData}
              onQuizDataChange={handleQuizDataChange}
              onPrevious={() => setCurrentStep(2)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
