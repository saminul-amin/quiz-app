import { Plus, Trash2 } from "lucide-react";

const AnswerOptions = ({ question, questionHandlers }) => {
  const { updateOption, addOption, removeOption } = questionHandlers;

  const handleCorrectAnswerChange = (optionId) => {
    // Set all options to false first, then set the selected one to true
    question.options.forEach((opt) => {
      updateOption(question.id, opt.id, "is_correct", opt.id === optionId);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Answer Options
        </label>
        {question.question_type === "multiple_choice" && (
          <button
            onClick={() => addOption(question.id)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <Plus size={16} />
            Add Option
          </button>
        )}
      </div>

      {question.options.map((option, oIndex) => (
        <div key={option.id} className="flex items-center gap-3">
          <input
            type="radio"
            name={`correct-${question.id}`}
            checked={option.is_correct}
            onChange={() => handleCorrectAnswerChange(option.id)}
            className="text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-slate-600 w-8">
            {String.fromCharCode(65 + oIndex)}
          </span>
          <input
            type="text"
            value={option.option_text}
            onChange={(e) =>
              updateOption(
                question.id,
                option.id,
                "option_text",
                e.target.value
              )
            }
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={
              question.question_type === "true_false"
                ? oIndex === 0
                  ? "True"
                  : "False"
                : `Option ${String.fromCharCode(65 + oIndex)}`
            }
            readOnly={question.question_type === "true_false"}
          />
          {question.question_type === "multiple_choice" &&
            question.options.length > 2 && (
              <button
                onClick={() => removeOption(question.id, option.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            )}
        </div>
      ))}
    </div>
  );
};

export default AnswerOptions;
