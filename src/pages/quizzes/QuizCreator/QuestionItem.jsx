import { Trash2, Plus } from "lucide-react";
import AnswerOptions from "./AnswerOptions";

const QuestionItem = ({
  question,
  questionIndex,
  questionsLength,
  questionHandlers,
}) => {
  const { removeQuestion, updateQuestion } = questionHandlers;

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">
          Question {questionIndex + 1}
        </h3>
        {questionsLength > 1 && (
          <button
            onClick={() => removeQuestion(question.id)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Question Text *
          </label>
          <textarea
            value={question.question_text}
            onChange={(e) =>
              updateQuestion(question.id, "question_text", e.target.value)
            }
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your question..."
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <select
              value={question.question_type}
              onChange={(e) =>
                updateQuestion(question.id, "question_type", e.target.value)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="short_answer">Short Answer</option>
              <option value="essay">Essay</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Points
              </label>
              <input
                type="number"
                value={question.points}
                onChange={(e) =>
                  updateQuestion(
                    question.id,
                    "points",
                    parseInt(e.target.value) || 1
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time (s)
              </label>
              <input
                type="number"
                value={question.time_limit}
                onChange={(e) =>
                  updateQuestion(
                    question.id,
                    "time_limit",
                    parseInt(e.target.value) || 30
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      {(question.question_type === "multiple_choice" ||
        question.question_type === "true_false") && (
        <AnswerOptions
          question={question}
          questionHandlers={questionHandlers}
        />
      )}

      {/* Explanation */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={question.explanation}
          onChange={(e) =>
            updateQuestion(question.id, "explanation", e.target.value)
          }
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Explain the correct answer..."
        />
      </div>
    </div>
  );
};

export default QuestionItem;
