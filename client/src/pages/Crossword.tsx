import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/CrosswordGame.css';

interface CrosswordWord {
  id: number;
  word: string;
  clue: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  number: number;
}

interface CrosswordCell {
  letter: string;
  userLetter: string;
  blocked: boolean;
  number?: number;
  wordIds: number[];
}

interface GameStats {
  startTime: number;
  completed: boolean;
  correctCells: number;
  totalCells: number;
}

const Crossword: React.FC = () => {
  // Sample crossword data - in a real app, this would come from props or API
  const sampleWords: CrosswordWord[] = [
    { id: 1, word: 'REACT', clue: 'JavaScript library for building user interfaces', direction: 'across', startRow: 0, startCol: 0, number: 1 },
    { id: 2, word: 'CODE', clue: 'Instructions written in a programming language', direction: 'down', startRow: 0, startCol: 2, number: 2 },
    { id: 3, word: 'HTML', clue: 'Markup language for web pages', direction: 'across', startRow: 2, startCol: 1, number: 3 },
    { id: 4, word: 'CSS', clue: 'Styling language for web design', direction: 'down', startRow: 1, startCol: 4, number: 4 },
    { id: 5, word: 'API', clue: 'Application Programming Interface', direction: 'across', startRow: 4, startCol: 0, number: 5 },
    { id: 6, word: 'DOM', clue: 'Document Object Model', direction: 'down', startRow: 2, startCol: 0, number: 6 },
  ];

  const gridSize = 6;
  const [words] = useState<CrosswordWord[]>(sampleWords);
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedWord, setSelectedWord] = useState<CrosswordWord | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [gameStats, setGameStats] = useState<GameStats>({
    startTime: Date.now(),
    completed: false,
    correctCells: 0,
    totalCells: 0
  });
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [timer, setTimer] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Initialize grid
  useEffect(() => {
    const newGrid: CrosswordCell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        userLetter: '',
        blocked: true,
        wordIds: []
      }))
    );

    let totalCells = 0;

    // Place words in grid
    words.forEach(word => {
      for (let i = 0; i < word.word.length; i++) {
        const row = word.direction === 'across' ? word.startRow : word.startRow + i;
        const col = word.direction === 'across' ? word.startCol + i : word.startCol;
        
        if (row < gridSize && col < gridSize) {
          newGrid[row][col] = {
            letter: word.word[i],
            userLetter: newGrid[row][col].userLetter || '',
            blocked: false,
            number: (i === 0) ? word.number : newGrid[row][col].number,
            wordIds: [...(newGrid[row][col].wordIds || []), word.id]
          };
          totalCells++;
        }
      }
    });

    setGrid(newGrid);
    setGameStats(prev => ({ ...prev, totalCells: totalCells / 2 })); // Divide by 2 because intersecting cells are counted twice
  }, [words]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameStats.completed) {
        setTimer(Math.floor((Date.now() - gameStats.startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStats.completed, gameStats.startTime]);

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (grid[row]?.[col]?.blocked) return;

    // If clicking the same cell, toggle direction
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }

    // Find and select the appropriate word
    const cell = grid[row][col];
    const wordInDirection = words.find(word => 
      cell.wordIds.includes(word.id) && word.direction === direction
    );
    
    if (wordInDirection) {
      setSelectedWord(wordInDirection);
    } else {
      // If no word in current direction, find any word containing this cell
      const anyWord = words.find(word => cell.wordIds.includes(word.id));
      if (anyWord) {
        setSelectedWord(anyWord);
        setDirection(anyWord.direction);
      }
    }
  }, [grid, selectedCell, direction, words]);

  // Handle key input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCell || !selectedWord) return;

    const { row, col } = selectedCell;

    if (e.key === 'Backspace') {
      // Clear current cell and move to previous
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[row][col] = { ...newGrid[row][col], userLetter: '' };
        return newGrid;
      });

      // Move to previous cell in word
      const wordCells = getWordCells(selectedWord);
      const currentIndex = wordCells.findIndex(cell => cell.row === row && cell.col === col);
      if (currentIndex > 0) {
        const prevCell = wordCells[currentIndex - 1];
        setSelectedCell({ row: prevCell.row, col: prevCell.col });
      }
    } else if (e.key.match(/^[a-zA-Z]$/)) {
      // Insert letter and move to next cell
      const letter = e.key.toUpperCase();
      
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[row][col] = { ...newGrid[row][col], userLetter: letter };
        return newGrid;
      });

      // Move to next cell in word
      const wordCells = getWordCells(selectedWord);
      const currentIndex = wordCells.findIndex(cell => cell.row === row && cell.col === col);
      if (currentIndex < wordCells.length - 1) {
        const nextCell = wordCells[currentIndex + 1];
        setSelectedCell({ row: nextCell.row, col: nextCell.col });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      // Handle arrow key navigation
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(gridSize - 1, row + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(gridSize - 1, col + 1);
          break;
      }

      if (!grid[newRow]?.[newCol]?.blocked) {
        setSelectedCell({ row: newRow, col: newCol });
      }
    }
  }, [selectedCell, selectedWord, grid]);

  // Add/remove keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Get cells for a word
  const getWordCells = (word: CrosswordWord) => {
    const cells = [];
    for (let i = 0; i < word.word.length; i++) {
      const row = word.direction === 'across' ? word.startRow : word.startRow + i;
      const col = word.direction === 'across' ? word.startCol + i : word.startCol;
      cells.push({ row, col });
    }
    return cells;
  };

  // Check if word is completed correctly
  const isWordCompleted = (word: CrosswordWord): boolean => {
    const cells = getWordCells(word);
    return cells.every(({ row, col }) => 
      grid[row]?.[col]?.userLetter === grid[row]?.[col]?.letter
    );
  };

  // Get highlighted cells for selected word
  const getHighlightedCells = (): Set<string> => {
    if (!selectedWord) return new Set();
    
    const cells = getWordCells(selectedWord);
    return new Set(cells.map(({ row, col }) => `${row}-${col}`));
  };

  // Handle clue click
  const handleClueClick = (word: CrosswordWord) => {
    setSelectedWord(word);
    setDirection(word.direction);
    setSelectedCell({ row: word.startRow, col: word.startCol });
  };

  // Show hint for current word
  const showWordHint = () => {
    if (!selectedWord) return;
    
    const wordCells = getWordCells(selectedWord);
    const emptyCell = wordCells.find(({ row, col }) => !grid[row][col].userLetter);
    
    if (emptyCell) {
      const correctLetter = grid[emptyCell.row][emptyCell.col].letter;
      setCurrentHint(`The ${selectedWord.direction} word "${selectedWord.clue}" has the letter "${correctLetter}" at position ${wordCells.indexOf(emptyCell) + 1}.`);
      setShowHint(true);
    }
  };

  // Check solution
  const checkSolution = () => {
    let correct = 0;
    let total = 0;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = grid[row][col];
        if (!cell.blocked && cell.letter) {
          total++;
          if (cell.userLetter === cell.letter) {
            correct++;
          }
        }
      }
    }

    const completed = correct === total && total > 0;
    setGameStats(prev => ({ ...prev, correctCells: correct, completed }));

    if (completed) {
      alert('Congratulations! You completed the crossword!');
    } else {
      alert(`${correct} out of ${total} letters correct.`);
    }
  };

  // Clear grid
  const clearGrid = () => {
    setGrid(prev => prev.map(row => 
      row.map(cell => ({ ...cell, userLetter: '' }))
    ));
  };

  // Reset game
  const resetGame = () => {
    clearGrid();
    setGameStats({ startTime: Date.now(), completed: false, correctCells: 0, totalCells: gameStats.totalCells });
    setSelectedCell(null);
    setSelectedWord(null);
    setTimer(0);
  };

  const highlightedCells = getHighlightedCells();
  const completedWords = words.filter(isWordCompleted);
  const progress = gameStats.totalCells > 0 ? (gameStats.correctCells / gameStats.totalCells) * 100 : 0;

  return (
    <div className="crossword-container">
      <div className="crossword-header">
        <h1 className="crossword-title">Crossword Puzzle</h1>
        <p className="crossword-subtitle">Click on a cell and start typing to fill in the answers</p>
      </div>

      <div className="crossword-main">
        <div>
          {/* Grid */}
          <div className="crossword-grid-container">
            <div 
              className="crossword-grid" 
              ref={gridRef}
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`crossword-cell ${
                      cell.blocked ? 'blocked' : ''
                    } ${
                      highlightedCells.has(`${rowIndex}-${colIndex}`) ? 'highlighted' : ''
                    } ${
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'active' : ''
                    } ${
                      cell.userLetter && cell.userLetter === cell.letter ? 'correct' : 
                      cell.userLetter && cell.userLetter !== cell.letter ? 'incorrect' : ''
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    tabIndex={cell.blocked ? -1 : 0}
                  >
                    {cell.number && (
                      <span className="cell-number">{cell.number}</span>
                    )}
                    {!cell.blocked && (cell.userLetter || '')}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="crossword-controls">
            <button onClick={checkSolution} className="control-button btn-primary">
              Check Solution
            </button>
            <button onClick={showWordHint} className="control-button btn-secondary" disabled={!selectedWord}>
              Show Hint
            </button>
            <button onClick={clearGrid} className="control-button btn-danger">
              Clear Grid
            </button>
            <button onClick={resetGame} className="control-button btn-success">
              New Game
            </button>
          </div>

          {/* Game Status */}
          <div className={`game-status ${gameStats.completed ? 'status-completed' : 'status-playing'}`}>
            {gameStats.completed ? 'Puzzle Completed!' : `${completedWords.length} of ${words.length} words completed`}
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">
            {gameStats.correctCells} of {gameStats.totalCells} letters correct
          </div>

          {/* Timer */}
          <div className="timer">
            Time: {formatTime(timer)}
          </div>
        </div>

        {/* Clues Panel */}
        <div className="clues-panel">
          <div className="clues-section">
            <h3 className="clues-title">Across</h3>
            <ul className="clues-list">
              {words
                .filter(word => word.direction === 'across')
                .map(word => (
                  <li
                    key={word.id}
                    className={`clue-item ${
                      selectedWord?.id === word.id ? 'active' : ''
                    } ${
                      isWordCompleted(word) ? 'completed' : ''
                    }`}
                    onClick={() => handleClueClick(word)}
                  >
                    <span className="clue-number">{word.number}.</span>
                    <span className="clue-text">{word.clue}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="clues-section">
            <h3 className="clues-title">Down</h3>
            <ul className="clues-list">
              {words
                .filter(word => word.direction === 'down')
                .map(word => (
                  <li
                    key={word.id}
                    className={`clue-item ${
                      selectedWord?.id === word.id ? 'active' : ''
                    } ${
                      isWordCompleted(word) ? 'completed' : ''
                    }`}
                    onClick={() => handleClueClick(word)}
                  >
                    <span className="clue-number">{word.number}.</span>
                    <span className="clue-text">{word.clue}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      {showHint && (
        <div className="hint-overlay" onClick={() => setShowHint(false)}>
          <div className="hint-modal" onClick={e => e.stopPropagation()}>
            <h3 className="hint-title">Hint</h3>
            <p className="hint-text">{currentHint}</p>
            <div className="hint-buttons">
              <button onClick={() => setShowHint(false)} className="control-button btn-primary">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crossword;