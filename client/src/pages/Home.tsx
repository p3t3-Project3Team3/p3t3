import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { 
  QUERY_PROFILES,
  QUERY_ALL_DECKS 
} from '../utils/queries';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Home.css'; // Assuming you have a CSS file for styles
import SelectDeck from '../components/SelectDeck';  

interface Profile {
  _id: string;
  username: string;
}

interface Deck {
  _id: string;
  title: string;
  description: string;
  flashcards: Array<{
    _id: string;
    term: string;
    definition: string;
  }>;
}

interface ProfilesData {
  profiles: Profile[];
}

interface DecksData {
  getAllDecks: Deck[];
}

interface GameStats {
  totalFlashcards: number;
  availableDecks: Deck[];
  memoryGameDecks: Deck[];
  crosswordGameDecks: Deck[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { loading: profilesLoading, data: profilesData } = useQuery<ProfilesData>(QUERY_PROFILES);
  const { loading: decksLoading, data: decksData } = useQuery<DecksData>(QUERY_ALL_DECKS);
  
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const waveRef = useRef<HTMLParagraphElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const profiles = profilesData?.profiles || [];
  const decks = decksData?.getAllDecks || [];
  const loading = profilesLoading || decksLoading;

  // Memoize expensive calculations
  const gameStats = useMemo<GameStats>(() => {
    const totalFlashcards = decks.reduce((total, deck) => total + deck.flashcards.length, 0);
    const availableDecks = decks.filter(deck => deck.flashcards.length > 0);
    const memoryGameDecks = decks.filter(deck => deck.flashcards.length >= 2);
    const crosswordGameDecks = decks.filter(deck => deck.flashcards.length >= 6);
    
    return {
      totalFlashcards,
      availableDecks,
      memoryGameDecks,
      crosswordGameDecks
    };
  }, [decks]);

  // Improved wave animation with cleanup
  useEffect(() => {
    const waveText = waveRef.current;
    if (!waveText) return;

    const text = waveText.textContent || "";
    waveText.textContent = ""; // clear existing text

    const words = text.split(" ");
    const timeouts: NodeJS.Timeout[] = [];

    words.forEach((word: string, index: number) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      span.style.transition = "all 0.5s ease";

      waveText.appendChild(span);

      if (index < words.length - 1) {
        waveText.appendChild(document.createTextNode(" "));
      }

      // Animate with cleanup tracking
      const timeout = setTimeout(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, index * 100);
      
      timeouts.push(timeout);
    });

    animationTimeoutRef.current = timeouts;

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      animationTimeoutRef.current = [];
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Early returns for different states
  if (selectedGame) {
    return <SelectDeck gamePath={selectedGame} />;
  }

  if (loading) {
    return (
      <main>
        <div className="ui segment">
          <div className="ui active dimmer">
            <div className="ui indeterminate text loader">Loading Brain Games...</div>
          </div>
        </div>
      </main>
    );
  }

  // Game button handler
  const handleGameSelection = (gameType: string) => {
    setSelectedGame(gameType);
  };

  // Navigation handler
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const { totalFlashcards, availableDecks, memoryGameDecks, crosswordGameDecks } = gameStats;

  return (
    <main className="home-container">
      <div className="hero-section">
        <div className="hero-header">
          <h1 className="main-title">Welcome to StudyQuest</h1>
          <p ref={waveRef} className="hero-subtitle">
            Challenge your mind with interactive learning games and flashcards!
          </p>
        </div>
        
        {/* Quick Stats Dashboard */}
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{decks.length}</div>
            <div className="stat-label">Decks</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{totalFlashcards}</div>
            <div className="stat-label">Flashcards</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{profiles.length}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-buttons">
          <button 
            className="ui large yellow button"
            onClick={() => handleNavigation('/game/flashCards/Decks')} 
          >
            <i className="clone outline icon"></i>
            View All Decks
          </button>
        </div>
      </div>

      {/* Games Section */}
      <div className="games-section">
        <h2 className="section-title">Choose Your Game</h2>
        <div className="gameContainer">
          
          {/* Flashcard Study Game */}
          <div className="game-card homeFlashcard">
            <div className="game-icon" role="img" aria-label="Books">📚</div>
            <h3>Flashcard Study</h3>
            <p>Review and study your flashcards with our interactive study mode.</p>
            <div className="game-stats">
              <span className="game-stat">
                {availableDecks.length} deck{availableDecks.length !== 1 ? 's' : ''} available
              </span>
            </div>
            <button 
              className="ui violet button"
              onClick={() => handleGameSelection('flashcard')}
              disabled={availableDecks.length === 0}
              aria-label={availableDecks.length === 0 ? 'No decks available for flashcard study' : 'Start flashcard study'}
            >
              {availableDecks.length === 0 ? 'No Decks Available' : 'Start Studying'}
            </button>
          </div>

          {/* Memory Matching Game */}
          <div className="game-card homeMatching">
            <div className="game-icon" role="img" aria-label="Game controller">🎮</div>
            <h3>Memory Matching Game</h3>
            <p>Test your memory by matching terms with their definitions!</p>
            <div className="game-stats">
              <span className="game-stat">
                {memoryGameDecks.length} deck{memoryGameDecks.length !== 1 ? 's' : ''} ready to play
              </span>
            </div>
            <button 
              className="ui violet button"
              onClick={() => handleGameSelection('memory')}
              disabled={memoryGameDecks.length === 0}
              aria-label={memoryGameDecks.length === 0 ? 'Need at least 2 cards per deck for memory game' : 'Start memory matching game'}
            >
              {memoryGameDecks.length === 0 ? 'Need 2+ Cards' : 'Play Memory Game'}
            </button>
          </div>

          {/* Crossword Puzzle Game */}
          <div className="game-card homeCrossword">
            <div className="game-icon" role="img" aria-label="Memo">📝</div>
            <h3>Crossword Puzzle</h3>
            <p>Challenge yourself with crossword puzzles based on your flashcards!</p>
            <div className="game-stats">
              <span className="game-stat">
                {crosswordGameDecks.length} crossword-ready deck{crosswordGameDecks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button 
              className="ui violet button"
              onClick={() => handleGameSelection('crossword')}
              disabled={crosswordGameDecks.length === 0}
              aria-label={crosswordGameDecks.length === 0 ? 'Need at least 6 cards per deck for crossword puzzles' : 'Start crossword puzzle'}
            >
              {crosswordGameDecks.length === 0 ? 'Need 6+ Cards' : 'Play Crosswords'}
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {decks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" role="img" aria-label="Memo">📝</div>
          <h3>Get Started!</h3>
          <p>Create your first flashcard deck to begin your learning journey.</p>
          <button 
            className="ui large primary button"
            onClick={() => handleNavigation('/decks/createNewDeck')}
            aria-label="Create your first flashcard deck"
          >
            Create Your First Deck
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;