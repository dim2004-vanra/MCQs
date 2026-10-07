import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import mcqs from '../data/mcqs.json';
import { getCategories } from '../utils/examUtils';

const Practice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Categories';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const categories = getCategories(mcqs);
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter questions based on search, category, and difficulty
  const filteredQuestions = useMemo(() => {
    return mcqs.filter((q) => {
      const matchCategory = selectedCategory === 'All Categories' || q.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        q.question.toLowerCase().includes(searchLower) ||
        q.category.toLowerCase().includes(searchLower) ||
        q.difficulty.toLowerCase().includes(searchLower);

      return matchCategory && matchDifficulty && matchSearch;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Reset state when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    
    // Update URL params
    if (selectedCategory !== 'All Categories') {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, selectedCategory, selectedDifficulty, setSearchParams]);

  // Handle navigation
  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption !== null) {
      setIsAnswerChecked(true);
    }
  };

  const currentQuestion = filteredQuestions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions, categories, difficulty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="block w-full md:w-32 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
        >
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      {/* Practice Area */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No questions found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5">
            <div 
              className="bg-indigo-600 h-1.5 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Header info */}
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <div className="flex space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium">
                  {currentQuestion.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let optionStyle = "border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer";
                let icon = null;

                if (isAnswerChecked) {
                  if (index === currentQuestion.correctAnswer) {
                    optionStyle = "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500 text-green-700 dark:text-green-300";
                    icon = <CheckCircle className="w-5 h-5 text-green-500" />;
                  } else if (index === selectedOption) {
                    optionStyle = "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500 text-red-700 dark:text-red-300";
                    icon = <XCircle className="w-5 h-5 text-red-500" />;
                  } else {
                    optionStyle = "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed";
                  }
                } else if (selectedOption === index) {
                  optionStyle = "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400";
                }

                return (
                  <div
                    key={index}
                    onClick={() => !isAnswerChecked && setSelectedOption(index)}
                    className={`p-4 border-2 rounded-lg flex justify-between items-center transition-colors ${optionStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-base font-medium dark:text-gray-200">{option}</span>
                    </div>
                    {icon}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswerChecked && (
              <div className={`p-4 rounded-lg mt-6 ${
                selectedOption === currentQuestion.correctAnswer 
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <h4 className="font-bold mb-1">
                  {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                </h4>
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t dark:border-gray-700">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredQuestions.length - 1}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
