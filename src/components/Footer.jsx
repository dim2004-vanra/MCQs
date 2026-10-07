const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 max-w-5xl py-6 text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Frontend Quiz Master. All rights reserved.</p>
        <p className="text-sm mt-1">Built as a frontend-only practice project.</p>
      </div>
    </footer>
  );
};

export default Footer;
