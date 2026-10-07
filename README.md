# Frontend MCQ Examination Website

A complete, modern, responsive Frontend MCQ Examination application built with React and Tailwind CSS. It is designed as an educational tool for practicing frontend development concepts without relying on any backend infrastructure.

## Features

- **Practice Mode**: Answer questions one by one with immediate feedback and detailed explanations.
- **Exam Mode**: Take a timed assessment with a set number of questions.
- **Category Filtering**: Focus on specific topics like HTML, CSS, JavaScript, or React.
- **Difficulty Levels**: Choose between Easy, Medium, and Hard questions.
- **Detailed Results**: Review your performance, see correct answers, and understand your mistakes.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices.
- **No Backend Required**: All data is loaded from a local JSON file.

## Technologies Used

- **React 18**: UI Library
- **Vite**: Build Tool
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Lucide React**: Icons

## Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, Footer, etc.)
├── pages/            # Main application views
├── data/             # Contains mcqs.json (the question database)
├── utils/            # Utility functions (shuffling, filtering)
├── App.jsx           # Main routing component
├── main.jsx          # Entry point
└── index.css         # Global styles and Tailwind directives
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Adding New MCQs

To add new questions to the application, you simply need to edit the `src/data/mcqs.json` file. 

### JSON Data Structure

Each question object must follow this structure:

```json
{
  "id": 1, // Must be unique
  "category": "JavaScript", // Matches one of the categories
  "difficulty": "Medium", // "Easy", "Medium", or "Hard"
  "question": "What is closure in JavaScript?",
  "options": [
    "A function having access to the parent scope",
    "A closed browser tab",
    "A closed block of code",
    "None of the above"
  ],
  "correctAnswer": 0, // The index of the correct option (0-based)
  "explanation": "A closure is the combination of a function bundled together with references to its surrounding state."
}
```

### Tips for Adding 100+ Questions

1. **Maintain Valid JSON**: Ensure there are no trailing commas and all strings are double-quoted.
2. **Unique IDs**: Use sequential numbers or generate UUIDs for the `id` field.
3. **Consistency**: Ensure categories match existing ones to avoid creating accidental duplicates (e.g., use "React", not "ReactJS").
4. **Validation**: You can use a JSON linter before saving to catch syntax errors.

## How Exam Scoring Works

- Correct answers award **+1 point**.
- Wrong answers award **0 points** (no negative marking).
- Unanswered questions award **0 points**.
- The final score percentage is calculated as `(correct answers / total questions) * 100`.

## Local Storage Usage

The application uses `localStorage` for:
1. **Theme Preference**: Saving the user's choice of Light or Dark mode (`theme: 'dark' | 'light'`).
2. **Exam History**: Storing previous exam results so the user can track their progress over time. (Note: Only metadata and scores are saved, not the full questions, to save space).

*The original MCQ database is strictly loaded from the JSON file and is not modified in `localStorage`.*

## Future Improvements

- User authentication (if backend is added)
- Leaderboard
- Exporting results as PDF
- More diverse question types (e.g., multiple select)
