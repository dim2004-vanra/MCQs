import { useState } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, MinusCircle, RotateCcw, Home, Award, Clock } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All'); // All, Correct, Wrong, Unanswered

  if (!location.state || !location.state.result) {
    return <Navigate to="/categories" replace />;
  }

  const { result } = location.state;
  const { score, correct, wrong, unanswered, total, category, timeSpent, answers, questions } = result;

  const percentage = Math.round((score / total) * 100);

  const getPerformanceMessage = (percent) => {
    if (percent >= 90) return { text: "Excellent! You have a strong understanding of frontend development.", color: "text-green-600 dark:text-green-400" };
    if (percent >= 75) return { text: "Very Good! You're on the right track.", color: "text-blue-600 dark:text-blue-400" };
    if (percent >= 50) return { text: "Good effort, but keep practicing to improve your fundamentals.", color: "text-yellow-600 dark:text-yellow-400" };
    return { text: "Keep Practicing! Review the concepts and try again.", color: "text-red-600 dark:text-red-400" };
  };

  const message = getPerformanceMessage(percentage);

  const formatTime = (seconds) => {
    if (seconds === 0) return "No timer";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const filteredQuestions = questions.filter((q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === q.correctAnswer;
    const isUnanswered = userAnswer === undefined;
    
    if (filter === 'All') return true;
    if (filter === 'Correct') return isCorrect && !isUnanswered;
    if (filter === 'Wrong') return !isCorrect && !isUnanswered;
    if (filter === 'Unanswered') return isUnanswered;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Section - Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-indigo-600 dark:bg-indigo-900 p-8 text-center text-white">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-2">Exam Completed!</h1>
          <p className="text-indigo-100 text-lg">{category} Assessment</p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                {percentage}%
              </div>
              <p className={`text-lg font-medium ${message.color}`}>
                {message.text}
              </p>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 mr-2" />
              <span>Time Taken: <span className="font-bold text-gray-900 dark:text-white">{formatTime(timeSpent)}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center border dark:border-gray-600">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Questions</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center border border-green-100 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correct}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center border border-red-100 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{wrong}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Wrong</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center border border-yellow-100 dark:border-yellow-800">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{unanswered}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Unanswered</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Link
              to="/exam-setup"
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Exam
            </Link>
            <Link
              to="/"
              className="flex items-center px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Answers</h2>
          
          {/* Filters */}
          <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {['All', 'Correct', 'Wrong', 'Unanswered'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === f
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">No questions match the selected filter.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              // Find the original index in the questions array to get the correct user answer
              const originalIndex = questions.findIndex(orig => orig.id === q.id);
              const userAnswerIndex = answers[originalIndex];
              const isCorrect = userAnswerIndex === q.correctAnswer;
              const isUnanswered = userAnswerIndex === undefined;

              let statusColor = "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
              let statusIcon = <MinusCircle className="w-5 h-5 text-gray-500" />;
              let statusText = "Not Answered";
              
              if (isCorrect && !isUnanswered) {
                statusColor = "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800";
                statusIcon = <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />;
                statusText = "Correct";
              } else if (!isCorrect && !isUnanswered) {
                statusColor = "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
                statusIcon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
                statusText = "Incorrect";
              }

              return (
                <div key={q.id} className={`p-6 rounded-xl border shadow-sm ${statusColor}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-4">
                      {originalIndex + 1}. {q.question}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm">
                      {statusIcon}
                      <span className="font-semibold text-sm dark:text-gray-200">{statusText}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Your Answer:</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {isUnanswered ? (
                          <span className="italic text-gray-400">Not answered</span>
                        ) : (
                          q.options[userAnswerIndex]
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Correct Answer:</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {q.options[q.correctAnswer]}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white dark:bg-gray-800/80 rounded-lg text-sm border dark:border-gray-700">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">Explanation:</span>
                    <span className="text-gray-600 dark:text-gray-400">{q.explanation}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
