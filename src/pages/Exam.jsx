import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Clock, AlertCircle, Bookmark, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import mcqs from '../data/mcqs.json';
import { getRandomQuestions } from '../utils/examUtils';

const Exam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // If no state, redirect to setup
  if (!location.state) {
    return <Navigate to="/exam-setup" replace />;
  }

  const { category, questionCount, difficulty, timer: timerMinutes } = location.state;

  // Initialize exam data
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load questions on mount
  useEffect(() => {
    const selected = getRandomQuestions(mcqs, questionCount, category, difficulty);
    setQuestions(selected);
  }, [category, questionCount, difficulty]);

  // Handle submit logic
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    
    // Calculate score
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (userAnswer === undefined) {
        unanswered++;
      } else if (userAnswer === q.correctAnswer) {
        score++;
        correct++;
      } else {
        wrong++;
      }
    });

    const result = {
      score,
      correct,
      wrong,
      unanswered,
      total: questions.length,
      category,
      difficulty,
      timeSpent: timerMinutes * 60 - timeLeft,
      answers,
      questions
    };

    // Save to history in localStorage
    try {
      const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
      history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        ...result,
        answers: undefined, // Don't save full questions/answers to history to save space
        questions: undefined
      });
      localStorage.setItem('examHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
    } catch (e) {
      console.error("Failed to save history", e);
    }

    navigate('/result', { state: { result }, replace: true });
  }, [questions, answers, category, difficulty, timerMinutes, timeLeft, navigate]);

  // Timer effect
  useEffect(() => {
    if (timerMinutes === 0 || isSubmitting) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerMinutes, isSubmitting, handleSubmit]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const toggleReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) {
        newSet.delete(currentIndex);
      } else {
        newSet.add(currentIndex);
      }
      return newSet;
    });
  };

  if (questions.length === 0) {
    return <div className="text-center py-20">Loading questions...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeLow = timerMinutes > 0 && timeLeft < 60; // less than 1 minute

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* Main Question Area */}
      <div className="flex-grow space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">{category} Exam</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          
          {timerMinutes > 0 && (
            <div className={`flex items-center font-mono text-lg font-bold px-4 py-2 rounded-lg ${
              isTimeLow 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
                : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
            }`}>
              <Clock className="w-5 h-5 mr-2" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h3>
            <button
              onClick={toggleReview}
              className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${
                markedForReview.has(currentIndex)
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Mark for review"
            >
              <Bookmark className="w-5 h-5" fill={markedForReview.has(currentIndex) ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 border-2 rounded-lg flex items-center cursor-pointer transition-colors ${
                  answers[currentIndex] === index
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                  answers[currentIndex] === index
                    ? 'border-indigo-600 dark:border-indigo-400'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {answers[currentIndex] === index && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>}
                </div>
                <span className="text-base font-medium text-gray-800 dark:text-gray-200">{option}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t dark:border-gray-700">
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              disabled={currentIndex === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation Panel */}
      <div className="lg:w-72 flex-shrink-0 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Question Navigator</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isMarked = markedForReview.has(idx);
              const isCurrent = idx === currentIndex;
              
              let btnClass = "h-10 w-full rounded font-medium text-sm flex items-center justify-center border transition-colors ";
              
              if (isCurrent) {
                btnClass += "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-gray-800 ";
              }

              if (isMarked) {
                btnClass += "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
              } else if (isAnswered) {
                btnClass += "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
              } else {
                btnClass += "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={btnClass}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
              Answered ({answeredCount})
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              Marked for Review ({markedForReview.size})
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
              Not Answered ({questions.length - answeredCount})
            </div>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Submit Exam
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowConfirmModal(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full mx-4 p-6 shadow-xl border dark:border-gray-700">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
              Submit Exam?
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to submit? You won't be able to change your answers.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500 dark:text-gray-400">Answered:</span>
                <span className="font-bold text-gray-900 dark:text-white">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Unanswered:</span>
                <span className="font-bold text-gray-900 dark:text-white">{questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
