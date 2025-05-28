import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { QUERY_SINGLE_DECK } from '../utils/queries'; // Fixed import
import '../styles/FlashcardGame.css';

interface Flashcard {
  _id: string;
  term: string;
  definition: string;
}

interface StudyStats {
  correct: number;
  incorrect: number;
  total: number;
  currentStreak: number;
  bestStreak: number;
}

const FlashCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fixed: Use correct query and data access
  const { data, loading, error } = useQuery(QUERY_SINGLE_DECK, {
    variables: { id: id },
    skip: !id,
  });

  // Study state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'sequential' | 'random' | 'incorrect'>('sequential');
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    incorrect: 0,
    total: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [incorrectCards, setIncorrectCards] = useState<Flashcard[]>([]);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [isStudyComplete, setIsStudyComplete] = useState(false);

  // Initialize study cards when data loads
  useEffect(() => {
    // Fixed: Use correct data path
    if (data?.getSingleDeck?.flashcards) {
      const cards = [...data.getSingleDeck.flashcards];
      if (studyMode === 'random') {
        // Shuffle cards for random mode
        for (let i = cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cards[i], cards[j]] = [cards[j], cards[i]];
        }
      } else if (studyMode === 'incorrect' && incorrectCards.length > 0) {
        setStudyCards(incorrectCards);
        return;
      }
      setStudyCards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  }, [data, studyMode, incorrectCards]);

  // Card flip animation variants
  const cardVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  const cardTransition = {
    duration: 0.6,
    type: "spring",
    stiffness: 300,
    damping: 20,
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!showAnswer) return;

    const newStats = { ...studyStats };
    newStats.total += 1;
    
    if (isCorrect) {
      newStats.correct += 1;
      newStats.currentStreak += 1;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
    } else {
      newStats.incorrect += 1;
      newStats.currentStreak = 0;
      // Add to incorrect cards for review
      const currentCard = studyCards[currentCardIndex];
      if (!incorrectCards.find(card => card._id === currentCard._id)) {
        setIncorrectCards([...incorrectCards, currentCard]);
      }
    }
    
    setStudyStats(newStats);
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    } else {
      setIsStudyComplete(true);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setIsStudyComplete(false);
    setStudyStats({
      correct: 0,
      incorrect: 0,
      total: 0,
      currentStreak: 0,
      bestStreak: 0
    });
  };

  const switchStudyMode = (mode: 'sequential' | 'random' | 'incorrect') => {
    if (mode === 'incorrect' && incorrectCards.length === 0) {
      alert('No incorrect cards to review yet!');
      return;
    }
    setStudyMode(mode);
    restartStudy();
  };

  if (loading) return <div className="loading-container"><p>Loading deck...</p></div>;
  if (error) return <div className="error-container"><p className="error-text">Error: {error.message}</p></div>;
  if (!data?.getSingleDeck) return <div className="not-found-container"><p>Deck not found</p></div>;

  // Fixed: Use correct data path
  const deck = data.getSingleDeck;
  const currentCard = studyCards[currentCardIndex];

  if (isStudyComplete) {
    return (
      <div className="study-complete-container">
        <h1 className="complete-title">Study Complete! 🎉</h1>
        
        <div className="results-card">
          <h2 className="results-title">Final Results</h2>
          <div className="results-grid">
            <div className="stat-card stat-card-green">
              <div className="stat-number stat-number-green">{studyStats.correct}</div>
              <div className="stat-label stat-label-green">Correct</div>
            </div>
            <div className="stat-card stat-card-red">
              <div className="stat-number stat-number-red">{studyStats.incorrect}</div>
              <div className="stat-label stat-label-red">Incorrect</div>
            </div>
            <div className="stat-card stat-card-blue">
              <div className="stat-number stat-number-blue">
                {studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0}%
              </div>
              <div className="stat-label stat-label-blue">Accuracy</div>
            </div>
            <div className="stat-card stat-card-purple">
              <div className="stat-number stat-number-purple">{studyStats.bestStreak}</div>
              <div className="stat-label stat-label-purple">Best Streak</div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button onClick={restartStudy} className="btn-primary">
            Study Again
          </button>
          
          {incorrectCards.length > 0 && (
            <button onClick={() => switchStudyMode('incorrect')} className="btn-secondary">
              Review Incorrect Cards ({incorrectCards.length})
            </button>
          )}
          
          <button onClick={() => navigate(`/deck/${id}`)} className="btn-tertiary">
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return <div className="no-cards-container"><p>No cards to study</p></div>;
  }

  return (
    <div className="study-container">
      {/* Header */}
      <div className="study-header">
        <h1 className="study-title">Studying: {deck.title}</h1>
        <div className="study-info">
          <div className="card-counter">
            Card {currentCardIndex + 1} of {studyCards.length}
          </div>
          <div className="stats-display">
            <span className="stat-correct">✓ {studyStats.correct}</span>
            <span className="stat-incorrect">✗ {studyStats.incorrect}</span>
            <span className="stat-streak">🔥 {studyStats.currentStreak}</span>
          </div>
        </div>
      </div>

      {/* Study Mode Selector */}
      <div className="mode-selector">
        <div className="mode-buttons">
          <button
            onClick={() => switchStudyMode('sequential')}
            className={`mode-button ${
              studyMode === 'sequential' ? 'mode-button-active' : 'mode-button-inactive'
            }`}
          >
            Sequential
          </button>
          <button
            onClick={() => switchStudyMode('random')}
            className={`mode-button ${
              studyMode === 'random' ? 'mode-button-active' : 'mode-button-inactive'
            }`}
          >
            Random
          </button>
          <button
            onClick={() => switchStudyMode('incorrect')}
            disabled={incorrectCards.length === 0}
            className={`mode-button ${
              studyMode === 'incorrect' 
                ? 'mode-button-active' 
                : incorrectCards.length === 0
                ? 'mode-button-disabled'
                : 'mode-button-inactive'
            }`}
          >
            Review Incorrect ({incorrectCards.length})
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentCardIndex) / studyCards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="card-container">
        <div className="card-wrapper">
          <motion.div
            className="card"
            initial={isFlipped ? "back" : "front"}
            animate={isFlipped ? "back" : "front"}
            variants={cardVariants}
            transition={cardTransition}
            onClick={handleFlip}
          >
            {/* Front of Card */}
            <div className="card-face card-front">
              <div className="card-content">
                <div className="card-label">Term</div>
                <div className="card-text">{currentCard.term}</div>
                <div className="card-instruction">Click to reveal answer</div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="card-face card-back">
              <div className="card-content">
                <div className="card-label">Definition</div>
                <div className="card-text">{currentCard.definition}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Answer Buttons */}
      {showAnswer && (
        <div className="answer-buttons">
          <button onClick={() => handleAnswer(false)} className="answer-button answer-incorrect">
            ✗ Incorrect
          </button>
          <button onClick={() => handleAnswer(true)} className="answer-button answer-correct">
            ✓ Correct
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="navigation">
        <button
          onClick={previousCard}
          disabled={currentCardIndex === 0}
          className="nav-button nav-button-gray"
        >
          Previous
        </button>

        <button onClick={() => navigate(`/deck/${id}`)} className="nav-button nav-button-light-gray">
          Exit Study
        </button>

        <button
          onClick={nextCard}
          disabled={currentCardIndex === studyCards.length - 1}
          className="nav-button nav-button-gray"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default FlashCard;