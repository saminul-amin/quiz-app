import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Clock, Target, Users, Settings, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const QuizCreator = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userDbId, setUserDbId] = useState(null);

  // Quiz basic information
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category_id: '',
    difficulty_level: 'medium',
    max_attempts: 1,
    passing_score: 70,
    is_public: true,
    randomize_questions: false,
    show_correct_answers: true,
    show_score_immediately: true
  });

  // Questions data
  const [questions, setQuestions] = useState([{
    id: Date.now(),
    question_text: '',
    question_type: 'multiple_choice',
    points: 1,
    time_limit: 30,
    explanation: '',
    order_index: 0,
    options: [
      { id: Date.now() + 1, option_text: '', is_correct: false, order_index: 0 },
      { id: Date.now() + 2, option_text: '', is_correct: false, order_index: 1 },
      { id: Date.now() + 3, option_text: '', is_correct: false, order_index: 2 },
      { id: Date.now() + 4, option_text: '', is_correct: false, order_index: 3 }
    ]
  }]);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      if (!user?.email) return;
      
      setIsLoading(true);
      try {
        await Promise.all([
          fetchCategories(),
          fetchTags(),
          createOrGetUser()
        ]);
      } catch (error) {
        showNotification('error', 'Failed to load initial data');
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  // Create or get user in database
  const createOrGetUser = async () => {
    if (!user?.email) return;

    try {
      const userData = {
        firebase_uid: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'user',
        email: user.email,
        name: user.displayName || 'User',
        role: 'user'
      };

      const response = await axios.post('/users', userData);
      setUserDbId(response.data.id);
    } catch (error) {
      console.error('Error creating/getting user:', error);
      // Try to get existing user
      try {
        const response = await axios.get(`/users/${user.uid}`);
        setUserDbId(response.data.id);
      } catch (getError) {
        console.error('Error getting user:', getError);
        showNotification('error', 'Authentication error. Please try again.');
      }
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('error', 'Failed to load categories');
    }
  };

  // Fetch tags from backend
  const fetchTags = async () => {
    try {
      const response = await axios.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      showNotification('error', 'Failed to load tags');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      time_limit: 30,
      explanation: '',
      order_index: questions.length,
      options: [
        { id: Date.now() + 1, option_text: '', is_correct: false, order_index: 0 },
        { id: Date.now() + 2, option_text: '', is_correct: false, order_index: 1 },
        { id: Date.now() + 3, option_text: '', is_correct: false, order_index: 2 },
        { id: Date.now() + 4, option_text: '', is_correct: false, order_index: 3 }
      ]
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    if (questions.length <= 1) {
      showNotification('error', 'Quiz must have at least one question');
      return;
    }
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));

    // If changing question type, reset options appropriately
    if (field === 'question_type') {
      setQuestions(prev => prev.map(q => {
        if (q.id !== questionId) return q;
        
        if (value === 'true_false') {
          return {
            ...q,
            options: [
              { id: Date.now() + 1, option_text: 'True', is_correct: false, order_index: 0 },
              { id: Date.now() + 2, option_text: 'False', is_correct: false, order_index: 1 }
            ]
          };
        } else if (value === 'short_answer' || value === 'essay') {
          return { ...q, options: [] };
        } else if (value === 'multiple_choice' && q.options.length < 4) {
          const newOptions = [
            { id: Date.now() + 1, option_text: '', is_correct: false, order_index: 0 },
            { id: Date.now() + 2, option_text: '', is_correct: false, order_index: 1 },
            { id: Date.now() + 3, option_text: '', is_correct: false, order_index: 2 },
            { id: Date.now() + 4, option_text: '', is_correct: false, order_index: 3 }
          ];
          return { ...q, options: newOptions };
        }
        return q;
      }));
    }
  };

  const updateOption = (questionId, optionId, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q, 
            options: q.options.map(opt => 
              opt.id === optionId ? { ...opt, [field]: value } : opt
            )
          }
        : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: [...q.options, {
              id: Date.now(),
              option_text: '',
              is_correct: false,
              order_index: q.options.length
            }]
          }
        : q
    ));
  };

  const removeOption = (questionId, optionId) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter(opt => opt.id !== optionId) }
        : q
    ));
  };

  // Validation functions
  const validateQuizData = () => {
    if (!quizData.title.trim()) {
      showNotification('error', 'Quiz title is required');
      return false;
    }
    if (!quizData.category_id) {
      showNotification('error', 'Please select a category');
      return false;
    }
    if (!userDbId) {
      showNotification('error', 'User authentication error. Please refresh and try again.');
      return false;
    }
    return true;
  };

  const validateQuestions = () => {
    if (questions.length === 0) {
      showNotification('error', 'Quiz must have at least one question');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.question_text.trim()) {
        showNotification('error', `Question ${i + 1} must have text`);
        return false;
      }

      if (question.question_type === 'multiple_choice') {
        if (question.options.length < 2) {
          showNotification('error', `Question ${i + 1} must have at least 2 options`);
          return false;
        }
        
        const hasCorrectAnswer = question.options.some(opt => opt.is_correct);
        if (!hasCorrectAnswer) {
          showNotification('error', `Question ${i + 1} must have a correct answer selected`);
          return false;
        }

        const hasEmptyOptions = question.options.some(opt => !opt.option_text.trim());
        if (hasEmptyOptions) {
          showNotification('error', `All options for Question ${i + 1} must have text`);
          return false;
        }
      }

      if (question.question_type === 'true_false') {
        const hasCorrectAnswer = question.options.some(opt => opt.is_correct);
        if (!hasCorrectAnswer) {
          showNotification('error', `Question ${i + 1} must have a correct answer selected`);
          return false;
        }
      }

      if (question.points < 1) {
        showNotification('error', `Question ${i + 1} must have at least 1 point`);
        return false;
      }

      if (question.time_limit < 10) {
        showNotification('error', `Question ${i + 1} must have at least 10 seconds time limit`);
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
        category_id: parseInt(quizData.category_id)
      };

      // Create the quiz first
      const quizResponse = await axios.post('/quizzes', quizPayload);
      const createdQuiz = quizResponse.data;

      showNotification('success', 'Quiz created! Adding questions...');

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
          options: question.question_type === 'short_answer' || question.question_type === 'essay' 
            ? [] 
            : question.options.map((opt, idx) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct,
                order_index: idx
              }))
        };

        await axios.post(`/quizzes/${createdQuiz.id}/questions`, questionPayload);
      }

      showNotification('success', 'Quiz created successfully! Redirecting...');
      
      // Navigate to quiz list after a brief delay
      setTimeout(() => {
        navigate('/quizzes');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating quiz:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create quiz. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info', icon: BookOpen },
    { id: 2, name: 'Questions', icon: Target },
    { id: 3, name: 'Settings', icon: Settings }
  ];

  // Show loading screen while initializing
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quiz creator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/quizzes')}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="text-slate-600" size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Create New Quiz</h1>
              <p className="text-slate-600 mt-1">Build an engaging quiz for your audience</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep === step.id 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : currentStep > step.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white text-slate-600 shadow-md'
                }`}>
                  <step.icon size={18} />
                  <span className="font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-4 transition-colors duration-300 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 animate-in slide-in-from-right">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quiz Title *</label>
                  <input
                    type="text"
                    value={quizData.title}
                    onChange={(e) => handleQuizDataChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter an engaging quiz title..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) => handleQuizDataChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe what this quiz covers..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                  <select
                    value={quizData.category_id}
                    onChange={(e) => handleQuizDataChange('category_id', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                  <select
                    value={quizData.difficulty_level}
                    onChange={(e) => handleQuizDataChange('difficulty_level', e.target.value)}
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
                  onClick={() => setCurrentStep(2)}
                  disabled={!quizData.title.trim() || !quizData.category_id}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next: Add Questions
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
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
                  <div key={question.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">Question {qIndex + 1}</h3>
                      {questions.length > 1 && (
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Question Text *</label>
                        <textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your question..."
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                          <select
                            value={question.question_type}
                            onChange={(e) => updateQuestion(question.id, 'question_type', e.target.value)}
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
                            <label className="block text-sm font-medium text-slate-700 mb-2">Points</label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Time (s)</label>
                            <input
                              type="number"
                              value={question.time_limit}
                              onChange={(e) => updateQuestion(question.id, 'time_limit', parseInt(e.target.value) || 30)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Options for multiple choice and true/false */}
                    {(question.question_type === 'multiple_choice' || question.question_type === 'true_false') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-slate-700">Answer Options</label>
                          {question.question_type === 'multiple_choice' && (
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
                              onChange={() => {
                                // Set all options to false first
                                setQuestions(prev => prev.map(q => 
                                  q.id === question.id 
                                    ? {
                                        ...q,
                                        options: q.options.map(opt => ({ ...opt, is_correct: false }))
                                      }
                                    : q
                                ));
                                // Then set this option to true
                                updateOption(question.id, option.id, 'is_correct', true);
                              }}
                              className="text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-600 w-8">{String.fromCharCode(65 + oIndex)}</span>
                            <input
                              type="text"
                              value={option.option_text}
                              onChange={(e) => updateOption(question.id, option.id, 'option_text', e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={question.question_type === 'true_false' ? (oIndex === 0 ? 'True' : 'False') : `Option ${String.fromCharCode(65 + oIndex)}`}
                              readOnly={question.question_type === 'true_false'}
                            />
                            {question.question_type === 'multiple_choice' && question.options.length > 2 && (
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
                    )}

                    {/* Explanation */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Explanation (Optional)</label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Explain the correct answer..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Next: Settings
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Settings className="text-blue-500" />
                Quiz Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Maximum Attempts</label>
                  <input
                    type="number"
                    value={quizData.max_attempts}
                    onChange={(e) => handleQuizDataChange('max_attempts', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="0"
                    placeholder="0 for unlimited"
                  />
                  <p className="text-sm text-slate-500 mt-1">Set to 0 for unlimited attempts</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    value={quizData.passing_score}
                    onChange={(e) => handleQuizDataChange('passing_score', parseInt(e.target.value) || 70)}
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
                        onChange={(e) => handleQuizDataChange('is_public', e.target.checked)}
                        className="text-blue-500 focus:ring-blue-500 rounded"
                      />
                      <div>
                        <span className="font-medium text-slate-800">Public Quiz</span>
                        <p className="text-sm text-slate-600">Anyone can take this quiz</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizData.randomize_questions}
                        onChange={(e) => handleQuizDataChange('randomize_questions', e.target.checked)}
                        className="text-blue-500 focus:ring-blue-500 rounded"
                      />
                      <div>
                        <span className="font-medium text-slate-800">Randomize Questions</span>
                        <p className="text-sm text-slate-600">Shuffle question order</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizData.show_correct_answers}
                        onChange={(e) => handleQuizDataChange('show_correct_answers', e.target.checked)}
                        className="text-blue-500 focus:ring-blue-500 rounded"
                      />
                      <div>
                        <span className="font-medium text-slate-800">Show Correct Answers</span>
                        <p className="text-sm text-slate-600">Display answers after completion</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizData.show_score_immediately}
                        onChange={(e) => handleQuizDataChange('show_score_immediately', e.target.checked)}
                        className="text-blue-500 focus:ring-blue-500 rounded"
                      />
                      <div>
                        <span className="font-medium text-slate-800">Show Score Immediately</span>
                        <p className="text-sm text-slate-600">Display score right after completion</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;