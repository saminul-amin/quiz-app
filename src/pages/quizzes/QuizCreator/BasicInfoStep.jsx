import { BookOpen } from "lucide-react";

const BasicInfoStep = ({ quizData, categories, onQuizDataChange, onNext }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 animate-in slide-in-from-right">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BookOpen className="text-blue-500" />
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Quiz Title *
          </label>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => onQuizDataChange("title", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter an engaging quiz title..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={quizData.description}
            onChange={(e) => onQuizDataChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Describe what this quiz covers..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category *
          </label>
          <select
            value={quizData.category_id}
            onChange={(e) => onQuizDataChange("category_id", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={quizData.difficulty_level}
            onChange={(e) =>
              onQuizDataChange("difficulty_level", e.target.value)
            }
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!quizData.title.trim() || !quizData.category_id}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Next: Add Questions
        </button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
