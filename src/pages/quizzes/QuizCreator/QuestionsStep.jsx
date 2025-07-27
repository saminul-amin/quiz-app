import { Target, Plus } from "lucide-react";
import QuestionItem from "./QuestionItem";

const QuestionsStep = ({ questions, questionHandlers, onPrevious, onNext }) => {
  const { addQuestion } = questionHandlers;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Target className="text-blue-500" />
          Questions ({questions.length})
        </h2>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105"
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {questions.map((question, qIndex) => (
          <QuestionItem
            key={question.id}
            question={question}
            questionIndex={qIndex}
            questionsLength={questions.length}
            questionHandlers={questionHandlers}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Next: Settings
        </button>
      </div>
    </div>
  );
};

export default QuestionsStep;
