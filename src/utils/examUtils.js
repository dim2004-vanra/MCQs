// Fisher-Yates shuffle algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get unique categories from MCQs
export const getCategories = (mcqs) => {
  const categories = new Set(mcqs.map((mcq) => mcq.category));
  return ["All Categories", ...Array.from(categories)];
};

// Filter MCQs by category
export const filterByCategory = (mcqs, category) => {
  if (category === "All Categories") return mcqs;
  return mcqs.filter((mcq) => mcq.category === category);
};

// Select random questions
export const getRandomQuestions = (mcqs, count, category = "All Categories", difficulty = "All") => {
  let filtered = filterByCategory(mcqs, category);
  
  if (difficulty !== "All") {
    filtered = filtered.filter(mcq => mcq.difficulty === difficulty);
  }

  const shuffled = shuffleArray(filtered);
  // Ensure we don't return more questions than available
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
