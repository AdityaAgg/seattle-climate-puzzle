import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);

  const puzzles = [
    {
      id: 1,
      question: "What's Seattle's rainiest month?",
      options: ["December", "November", "January", "February"],
      correct: 1,
      explanation: "November is typically Seattle's rainiest month, with an average of 6.2 inches of rainfall."
    },
    {
      id: 2,
      question: "Which season has the most daylight hours in Seattle?",
      options: ["Spring", "Summer", "Fall", "Winter"],
      correct: 1,
      explanation: "Summer has the most daylight hours, with the summer solstice bringing nearly 16 hours of daylight."
    },
    {
      id: 3,
      question: "What's the average temperature in Seattle during July?",
      options: ["65°F", "75°F", "85°F", "95°F"],
      correct: 1,
      explanation: "July is Seattle's warmest month with an average high temperature of 75°F."
    }
  ];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === puzzles[currentPuzzle].correct) {
      setScore(score + 1);
    }
    
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
    }
  };

  const resetGame = () => {
    setCurrentPuzzle(0);
    setScore(0);
  };

  const currentPuzzleData = puzzles[currentPuzzle];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌧️ Seattle Climate Puzzle</h1>
        <p>Test your knowledge about Seattle's weather and climate!</p>
        <div className="score">Score: {score}/{puzzles.length}</div>
      </header>

      <main className="App-main">
        {currentPuzzle < puzzles.length ? (
          <div className="puzzle-container">
            <h2>Puzzle {currentPuzzleData.id}</h2>
            <p className="question">{currentPuzzleData.question}</p>
            
            <div className="options">
              {currentPuzzleData.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="results">
            <h2>🎉 Quiz Complete!</h2>
            <p>Your final score: {score}/{puzzles.length}</p>
            <p className="score-message">
              {score === puzzles.length ? "Perfect! You're a Seattle weather expert!" :
               score >= puzzles.length * 0.7 ? "Great job! You know Seattle well!" :
               "Good effort! Keep learning about Seattle's climate!"}
            </p>
            <button className="reset-button" onClick={resetGame}>
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Learn more about Seattle's unique climate patterns and weather history</p>
      </footer>
    </div>
  );
}

export default App;
