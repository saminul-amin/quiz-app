import { useState } from "react";

export const useQuizData = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category_id: "",
    difficulty_level: "medium",
    max_attempts: 1,
    passing_score: 70,
    is_public: true,
    randomize_questions: false,
    show_correct_answers: true,
    show_score_immediately: true,
  });

  const handleQuizDataChange = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    quizData,
    handleQuizDataChange,
  };
};
