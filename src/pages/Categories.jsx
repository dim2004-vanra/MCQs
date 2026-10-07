import { Link } from 'react-router-dom';
import mcqs from '../data/mcqs.json';
import { getCategories } from '../utils/examUtils';

const Categories = () => {
  const categories = getCategories(mcqs);

  const getCategoryCount = (cat) => {
    if (cat === 'All Categories') return mcqs.length;
    return mcqs.filter(q => q.category === cat).length;
  };

  const getCategoryDescription = (cat) => {
    const descriptions = {
      'HTML': 'Structure of the web, semantic tags, forms, and accessibility.',
      'CSS': 'Styling, flexbox, grid, animations, and responsive design.',
      'JavaScript': 'ES6+, closures, promises, DOM manipulation, and core logic.',
      'React': 'Components, hooks, state management, and JSX.',
      'Tailwind CSS': 'Utility-first styling, configuration, and responsive classes.',
      'Git & GitHub': 'Version control, branching, committing, and remote repositories.',
      'DOM': 'Document Object Model traversal and manipulation.',
      'REST API/Web Basics': 'HTTP methods, status codes, JSON, and web architecture.',
      'All Categories': 'A mix of all frontend development topics.'
    };
    return descriptions[cat] || 'Test your knowledge in this category.';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Categories</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select a category to focus your practice, or choose "All Categories" for a comprehensive challenge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category}</h2>
              <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                {getCategoryCount(category)} Qs
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
              {getCategoryDescription(category)}
            </p>
            <div className="flex space-x-3 mt-auto">
              <Link
                to={`/practice?category=${encodeURIComponent(category)}`}
                className="flex-1 text-center bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-300 py-2 rounded font-medium hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
              >
                Practice
              </Link>
              <Link
                to={`/exam-setup?category=${encodeURIComponent(category)}`}
                className="flex-1 text-center bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors"
              >
                Exam
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
