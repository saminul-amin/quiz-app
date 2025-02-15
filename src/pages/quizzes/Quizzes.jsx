import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";

const fetchQuizzes = async () => {
//   const { data } = await axios.get("http://localhost:5000/quizzes");
  const { data } = await axios.get("/quizzes.json");
  return data;
};

export default function Quizzes() {
  const { data: quizzes, isLoading, error } = useQuery({ queryKey: ["quizzes"], queryFn: fetchQuizzes });
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error fetching quizzes</div>;

  console.log(quizzes.quizzes);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Available Quizzes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.quizzes.map((quiz) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-white shadow-lg rounded-lg border"
          >
            <h2 className="text-lg font-semibold">{quiz.title}</h2>
            <p className="text-gray-600 mt-2">{quiz.shortDescription}</p>
            <button className="mt-4" onClick={() => setSelectedQuiz(quiz)}>See Details</button>
          </motion.div>
        ))}
      </div>
      
      {/* Quiz Details Modal using DaisyUI */}
      {selectedQuiz && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="font-bold text-lg">{selectedQuiz.title}</h2>
            <p className="py-4">{selectedQuiz.description}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedQuiz(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
