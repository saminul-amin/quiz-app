import { useState } from "react";

export const useQuizSubmission = ({
  quizData,
  questions,
  userDbId,
  axios,
  navigate,
  showNotification,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateQuizData = () => {
    if (!quizData.title.trim()) {
      showNotification("error", "Quiz title is required");
      return false;
    }
    if (!quizData.category_id) {
      showNotification("error", "Please select a category");
      return false;
    }
    if (!userDbId) {
      showNotification(
        "error",
        "User authentication error. Please refresh and try again."
      );
      return false;
    }
    return true;
  };

  const validateQuestions = () => {
    if (questions.length === 0) {
      showNotification("error", "Quiz must have at least one question");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.question_text.trim()) {
        showNotification("error", `Question ${i + 1} must have text`);
        return false;
      }

      if (question.question_type === "multiple_choice") {
        if (question.options.length < 2) {
          showNotification(
            "error",
            `Question ${i + 1} must have at least 2 options`
          );
          return false;
        }

        const hasCorrectAnswer = question.options.some((opt) => opt.is_correct);
        if (!hasCorrectAnswer) {
          showNotification(
            "error",
            `Question ${i + 1} must have a correct answer selected`
          );
          return false;
        }

        const hasEmptyOptions = question.options.some(
          (opt) => !opt.option_text.trim()
        );
        if (hasEmptyOptions) {
          showNotification(
            "error",
            `All options for Question ${i + 1} must have text`
          );
          return false;
        }
      }

      if (question.question_type === "true_false") {
        const hasCorrectAnswer = question.options.some((opt) => opt.is_correct);
        if (!hasCorrectAnswer) {
          showNotification(
            "error",
            `Question ${i + 1} must have a correct answer selected`
          );
          return false;
        }
      }

      if (question.points < 1) {
        showNotification(
          "error",
          `Question ${i + 1} must have at least 1 point`
        );
        return false;
      }

      if (question.time_limit < 10) {
        showNotification(
          "error",
          `Question ${i + 1} must have at least 10 seconds time limit`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validate data
    if (!validateQuizData() || !validateQuestions()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare quiz data for submission
      const quizPayload = {
        ...quizData,
        creator_id: userDbId,
        category_id: parseInt(quizData.category_id),
      };

      // Create the quiz first
      const quizResponse = await axios.post("/quizzes", quizPayload);
      const createdQuiz = quizResponse.data;

      showNotification("success", "Quiz created! Adding questions...");

      // Add questions one by one
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        const questionPayload = {
          question_text: question.question_text,
          question_type: question.question_type,
          points: question.points,
          time_limit: question.time_limit,
          explanation: question.explanation || null,
          order_index: i,
          options:
            question.question_type === "short_answer" ||
            question.question_type === "essay"
              ? []
              : question.options.map((opt, idx) => ({
                  option_text: opt.option_text,
                  is_correct: opt.is_correct,
                  order_index: idx,
                })),
        };

        await axios.post(
          `/quizzes/${createdQuiz.id}/questions`,
          questionPayload
        );
      }

      showNotification("success", "Quiz created successfully! Redirecting...");

      // Navigate to quiz list after a brief delay
      setTimeout(() => {
        navigate("/quizzes");
      }, 2000);
    } catch (error) {
      console.error("Error creating quiz:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to create quiz. Please try again.";
      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};
