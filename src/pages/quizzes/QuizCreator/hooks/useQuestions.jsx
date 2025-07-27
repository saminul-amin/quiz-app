import { useState } from "react";

const createDefaultOptions = (questionType = "multiple_choice") => {
  if (questionType === "true_false") {
    return [
      {
        id: Date.now() + 1,
        option_text: "True",
        is_correct: false,
        order_index: 0,
      },
      {
        id: Date.now() + 2,
        option_text: "False",
        is_correct: false,
        order_index: 1,
      },
    ];
  }

  if (questionType === "short_answer" || questionType === "essay") {
    return [];
  }

  // Default multiple choice options
  return [
    {
      id: Date.now() + 1,
      option_text: "",
      is_correct: false,
      order_index: 0,
    },
    {
      id: Date.now() + 2,
      option_text: "",
      is_correct: false,
      order_index: 1,
    },
    {
      id: Date.now() + 3,
      option_text: "",
      is_correct: false,
      order_index: 2,
    },
    {
      id: Date.now() + 4,
      option_text: "",
      is_correct: false,
      order_index: 3,
    },
  ];
};

export const useQuestions = () => {
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      time_limit: 30,
      explanation: "",
      order_index: 0,
      options: createDefaultOptions("multiple_choice"),
    },
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      time_limit: 30,
      explanation: "",
      order_index: questions.length,
      options: createDefaultOptions("multiple_choice"),
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        // If changing question type, reset options appropriately
        if (field === "question_type") {
          return {
            ...q,
            [field]: value,
            options: createDefaultOptions(value),
          };
        }

        return { ...q, [field]: value };
      })
    );
  };

  const updateOption = (questionId, optionId, field, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      )
    );
  };

  const addOption = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                {
                  id: Date.now(),
                  option_text: "",
                  is_correct: false,
                  order_index: q.options.length,
                },
              ],
            }
          : q
      )
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) }
          : q
      )
    );
  };

  const questionHandlers = {
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateOption,
    addOption,
    removeOption,
  };

  return {
    questions,
    questionHandlers,
  };
};
