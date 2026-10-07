import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Play, Clock, BarChart2, Layers } from 'lucide-react';
import mcqs from '../data/mcqs.json';
import { getCategories } from '../utils/examUtils';

const ExamSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Categories';

  const [category, setCategory] = useState(initialCategory);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('All');
  const [timer, setTimer] = useState(15);

  const categories = getCategories(mcqs);
  const questionCounts = [10, 20, 30, 50];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const timerOptions = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '20 min', value: 20 },
    { label: '30 min', value: 30 },
    { label: 'No Timer', value: 0 },
  ];

  // Calculate maximum available questions for the selected configuration
  const getMaxQuestions = () => {
    let filtered = mcqs;
    if (category !== 'All Categories') {
      filtered = filtered.filter(q => q.category === category);
    }
    if (difficulty !== 'All') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    return filtered.length;
  };

  const maxAvailable = getMaxQuestions();

  const handleStartExam = () => {
    // Navigate to exam page with state
    navigate('/exam', {
      state: {
        category,
        questionCount: Math.min(questionCount, maxAvailable),
        difficulty,
        timer
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
          <Settings className="w-8 h-8 mr-2 text-indigo-600 dark:text-indigo-400" />
          Exam Setup
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure your examination settings before starting.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 space-y-8">
        
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Layers className="w-4 h-4 mr-2" />
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                  category === cat
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <BarChart2 className="w-4 h-4 mr-2" />
            Difficulty
          </label>
          <div className="flex flex-wrap gap-3">
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`py-2 px-4 text-sm rounded-lg border transition-colors ${
                  difficulty === diff
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <span className="font-bold text-lg mr-2">#</span>
              Number of Questions
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Available: {maxAvailable}
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            {questionCounts.map(count => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                disabled={count > maxAvailable && maxAvailable > 0}
                className={`py-2 px-4 text-sm rounded-lg border transition-colors ${
                  questionCount === count
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : count > maxAvailable && maxAvailable > 0
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          {maxAvailable === 0 && (
            <p className="text-sm text-red-500 mt-1">No questions available for this selection.</p>
          )}
          {questionCount > maxAvailable && maxAvailable > 0 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Note: Only {maxAvailable} questions will be included.
            </p>
          )}
        </div>

        {/* Timer Selection */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            Timer
          </label>
          <div className="flex flex-wrap gap-3">
            {timerOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setTimer(option.value)}
                className={`py-2 px-4 text-sm rounded-lg border transition-colors ${
                  timer === option.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t dark:border-gray-700">
          <button
            onClick={handleStartExam}
            disabled={maxAvailable === 0}
            className="w-full flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
