import { Settings, Users, Save } from "lucide-react";

const SettingsStep = ({
  quizData,
  onQuizDataChange,
  onPrevious,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Settings className="text-blue-500" />
        Quiz Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Maximum Attempts
          </label>
          <input
            type="number"
            value={quizData.max_attempts}
            onChange={(e) =>
              onQuizDataChange("max_attempts", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            min="0"
            placeholder="0 for unlimited"
          />
          <p className="text-sm text-slate-500 mt-1">
            Set to 0 for unlimited attempts
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Passing Score (%)
          </label>
          <input
            type="number"
            value={quizData.passing_score}
            onChange={(e) =>
              onQuizDataChange("passing_score", parseInt(e.target.value) || 70)
            }
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            min="0"
            max="100"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Users size={18} />
            Visibility & Behavior
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={quizData.is_public}
                onChange={(e) =>
                  onQuizDataChange("is_public", e.target.checked)
                }
                className="text-blue-500 focus:ring-blue-500 rounded"
              />
              <div>
                <span className="font-medium text-slate-800">Public Quiz</span>
                <p className="text-sm text-slate-600">
                  Anyone can take this quiz
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={quizData.randomize_questions}
                onChange={(e) =>
                  onQuizDataChange("randomize_questions", e.target.checked)
                }
                className="text-blue-500 focus:ring-blue-500 rounded"
              />
              <div>
                <span className="font-medium text-slate-800">
                  Randomize Questions
                </span>
                <p className="text-sm text-slate-600">Shuffle question order</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={quizData.show_correct_answers}
                onChange={(e) =>
                  onQuizDataChange("show_correct_answers", e.target.checked)
                }
                className="text-blue-500 focus:ring-blue-500 rounded"
              />
              <div>
                <span className="font-medium text-slate-800">
                  Show Correct Answers
                </span>
                <p className="text-sm text-slate-600">
                  Display answers after completion
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={quizData.show_score_immediately}
                onChange={(e) =>
                  onQuizDataChange("show_score_immediately", e.target.checked)
                }
                className="text-blue-500 focus:ring-blue-500 rounded"
              />
              <div>
                <span className="font-medium text-slate-800">
                  Show Score Immediately
                </span>
                <p className="text-sm text-slate-600">
                  Display score right after completion
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Creating Quiz...
            </>
          ) : (
            <>
              <Save size={18} />
              Create Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsStep;
