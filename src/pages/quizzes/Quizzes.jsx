import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Clock, 
  Users, 
  Trophy, 
  Star, 
  BookOpen, 
  Target,
  Filter,
  Search,
  X,
  Play,
  Award,
  Calendar
} from "lucide-react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import "@fontsource/galada";
import "@fontsource/tiro-bangla";

// API base URL - adjust according to your backend
const API_BASE_URL = "http://localhost:3000/api";

const fetchQuizzes = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/quizzes`);
  return data;
};

const fetchCategories = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/categories`);
  return data;
};

// Difficulty color mapping
const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  hard: "bg-red-100 text-red-800 border-red-200"
};

// Category color mapping
const categoryColors = [
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
  "bg-gradient-to-br from-yellow-400 to-yellow-600"
];

export default function Quizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch quizzes and categories
  const {
    data: quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuery({ 
    queryKey: ["quizzes"], 
    queryFn: fetchQuizzes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useQuery({ 
    queryKey: ["categories"], 
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes?.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || quiz.category_name === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || quiz.difficulty_level === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  }) || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const filterVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3
      }
    }
  };

  if (quizzesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner />
        </motion.div>
      </div>
    );
  }

  if (quizzesError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600">Unable to fetch quizzes. Please try again later.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Available Quizzes
          </h1>
          <p className="text-xl text-slate-600 mb-8" style={{ fontFamily: "Tiro Bangla, serif" }}>
            Challenge yourself and expand your knowledge! 🧠✨
          </p>
          
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{quizzes?.length || 0}</div>
              <div className="text-slate-600">Total Quizzes</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{categories?.length || 0}</div>
              <div className="text-slate-600">Categories</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">∞</div>
              <div className="text-slate-600">Learning Fun</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-white/50"
                />
              </div>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 shadow-lg"
              >
                <Filter className="h-5 w-5" />
                Filters
              </motion.button>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-6"
                >
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-white/50"
                    >
                      <option value="">All Categories</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-white/50"
                    >
                      <option value="">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <p className="text-slate-600 text-lg">
            Found <span className="font-bold text-indigo-600">{filteredQuizzes.length}</span> quiz{filteredQuizzes.length !== 1 ? 'es' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Quiz Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              variants={cardVariants}
              whileHover="hover"
              className="group cursor-pointer"
              onClick={() => setSelectedQuiz(quiz)}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 group-hover:shadow-2xl">
                {/* Quiz Header with Category Color */}
                <div className={`h-2 ${categoryColors[index % categoryColors.length]}`} />
                
                <div className="p-6">
                  {/* Quiz Title */}
                  <h2 
                    className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200"
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {quiz.title}
                  </h2>

                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[quiz.difficulty_level]}`}>
                      {quiz.difficulty_level?.charAt(0).toUpperCase() + quiz.difficulty_level?.slice(1)}
                    </span>
                    <div className="flex items-center text-slate-500">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-slate-600 mb-4 line-clamp-3 leading-relaxed"
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {quiz.description}
                  </p>

                  {/* Quiz Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-600">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{quiz.category_name || 'General'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-600">
                        <Target className="h-4 w-4 mr-1" />
                        <span>Pass: {quiz.passing_score}%</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span>By {quiz.creator_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      View Details
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No quizzes found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedDifficulty("");
              }}
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Quiz Details Modal */}
      <AnimatePresence>
        {selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedQuiz(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 
                    className="text-3xl font-bold text-slate-800 mb-2"
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {selectedQuiz.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${difficultyColors[selectedQuiz.difficulty_level]}`}>
                      {selectedQuiz.difficulty_level?.charAt(0).toUpperCase() + selectedQuiz.difficulty_level?.slice(1)}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-600">{selectedQuiz.category_name}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedQuiz(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Quiz Description */}
              <div className="mb-8">
                <p 
                  className="text-slate-700 text-lg leading-relaxed"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {selectedQuiz.description}
                </p>
              </div>

              {/* Quiz Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Target className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{selectedQuiz.passing_score}%</div>
                  <div className="text-slate-600 text-sm">Passing Score</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">
                    {selectedQuiz.max_attempts || '∞'}
                  </div>
                  <div className="text-slate-600 text-sm">Max Attempts</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl col-span-2 md:col-span-1">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-800">{selectedQuiz.creator_name}</div>
                  <div className="text-slate-600 text-sm">Created By</div>
                </div>
              </div>

              {/* Quiz Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Quiz Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedQuiz.randomize_questions && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Randomized Questions
                    </div>
                  )}
                  {selectedQuiz.show_correct_answers && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      Shows Correct Answers
                    </div>
                  )}
                  {selectedQuiz.show_score_immediately && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                      Immediate Score Display
                    </div>
                  )}
                  {selectedQuiz.is_public && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      Public Quiz
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuiz(null)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors duration-200"
                >
                  Close
                </motion.button>
                <Link to={`/quiz/${selectedQuiz.id}`} className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    Start Quiz
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}