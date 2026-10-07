import { Link } from 'react-router-dom';
import { Play, BookOpen, Code, Trophy, Layout } from 'lucide-react';
import mcqs from '../data/mcqs.json';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Master Frontend with <span className="text-indigo-600 dark:text-indigo-400">Interactive MCQs</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Test your frontend development knowledge, prepare for interviews, and sharpen your coding skills with our comprehensive quiz platform.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            to="/exam-setup"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Exam
          </Link>
          <Link
            to="/practice"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3 text-lg font-medium text-indigo-600 bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 border border-indigo-200 dark:border-gray-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Practice Mode
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{mcqs.length}</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">Total Questions</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">8+</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">Categories</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">3</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">Difficulty Levels</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">Free & Offline</div>
        </div>
      </div>

      {/* Features */}
      <div className="w-full max-w-5xl pt-10">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Why Choose QuizMaster?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Frontend Focused</h3>
            <p className="text-gray-600 dark:text-gray-400">Questions specifically curated for modern frontend technologies like React, Tailwind, and core web basics.</p>
          </div>
          <div className="space-y-3 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-green-600 dark:text-green-300">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Two Modes</h3>
            <p className="text-gray-600 dark:text-gray-400">Learn at your own pace with Practice Mode, or test your skills under pressure in Exam Mode with a timer.</p>
          </div>
          <div className="space-y-3 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-300">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Detailed Results</h3>
            <p className="text-gray-600 dark:text-gray-400">Get instant feedback, detailed explanations for every answer, and review your mistakes easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
