import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Home.css';

import { QUERY_PROFILES, QUERY_ALL_DECKS } from '../utils/queries';

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { loading: profilesLoading, data: profilesData } = useQuery<ProfilesData>(QUERY_PROFILES);
  const { loading: decksLoading, data: decksData } = useQuery<DecksData>(QUERY_ALL_DECKS);
  
  const profiles = profilesData?.profiles || [];
  const decks = decksData?.getAllDecks || [];
  const loading = profilesLoading || decksLoading;

  // Get some stats for the dashboard
  const totalFlashcards = decks.reduce((total, deck) => total + deck.flashcards.length, 0);
  const availableDecks = decks.filter(deck => deck.flashcards.length > 0);
  const memoryGameDecks = decks.filter(deck => deck.flashcards.length >= 2);
  const crosswordGameDecks = decks.filter(deck => deck.flashcards.length >= 6);

  const handleGameNavigation = (gameType: string) => {
    if (gameType === 'flashcard') {
      if (availableDecks.length === 0) {
        alert('No decks available! Create a deck first.');
        navigate('/game/flashCards/Decks');
      } else if (availableDecks.length === 1) {
        
        navigate(`/flashcard/${availableDecks[0]._id}`);
      } else {
        navigate('/game/flashCards/Decks'); // Let user choose from multiple decks
      }
    } else if (gameType === 'memory') {
      if (memoryGameDecks.length === 0) {
        alert('Need at least one deck with 2 or more cards for the memory game!');
        navigate('/game/flashCards/Decks');
      } else if (memoryGameDecks.length === 1) {
        navigate(`/matching/${memoryGameDecks[0]._id}`);
      } else {
        navigate('/game/flashCards/Decks'); // Let user choose from multiple decks
      }
    } else if (gameType === 'crossword') {
      if (crosswordGameDecks.length === 0) {
        alert('Need at least one deck with 6 or more cards for crosswords!');
        navigate('/game/flashCards/Decks');
      } else if (crosswordGameDecks.length === 1) {
        navigate(`/crossword/${crosswordGameDecks[0]._id}`);
      } else {
        navigate('/game/flashCards/Decks'); // Let user choose from multiple decks
      }
    }
  };

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

  return (
    <main className="home-container">
      <div className="hero-section">
        <h1 className="main-title">Welcome to Brain Games</h1>
        <p className="hero-subtitle">
          Challenge your mind with interactive learning games and flashcards!
        </p>
        
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
        <h3>Quick Start</h3>
        <div className="action-buttons">
          <button 
            className="ui large primary button"
            onClick={() => navigate('/game/flashCards/Decks')} 
          >
            <i className="clone outline icon"></i>
            View All Decks
          </button>
          <button 
            className="ui large secondary button"
            onClick={() => navigate('/decks/createNewDeck')}
          >
            <i className="plus icon"></i>
            Create New Deck
          </button>
        </div>
      </div>

      {/* Games Section */}
      <div className="games-section">
        <h2 className="section-title">Choose Your Game</h2>
        <div className="gameContainer">
          <div className="game-card homeFlashcard">
            <div className="game-icon">📚</div>
            <h3>Flashcard Study</h3>
            <p>Review and study your flashcards with our interactive study mode.</p>
            <div className="game-stats">
              <span className="game-stat">
                {availableDecks.length} decks available
              </span>
            </div>
            <button 
              className="ui violet button game-button"
              onClick={() => handleGameNavigation('flashcard')}
              disabled={availableDecks.length === 0}
            >
              {availableDecks.length === 0 ? 'No Decks Available' : 'Start Studying'}
            </button>
          </div>

          <div className="game-card homeMatching">
            <div className="game-icon">🎮</div>
            <h3>Memory Matching Game</h3>
            <p>Test your memory by matching terms with their definitions!</p>
            <div className="game-stats">
              <span className="game-stat">
                {memoryGameDecks.length} decks ready to play
              </span>
            </div>
            <button 
              className="ui violet button game-button"
              onClick={() => handleGameNavigation('memory')}
              disabled={memoryGameDecks.length === 0}
            >
              {memoryGameDecks.length === 0 ? 'Need 2+ Cards' : 'Play Memory Game'}
            </button>
          </div>

          <div className="game-card homeCrossword">
            <div className="game-icon">📝</div>
            <h3>Crossword Puzzle</h3>
            <p>Challenge yourself with crossword puzzles based on your flashcards!</p>
            <div className="game-stats">
              <span className="game-stat">
                {crosswordGameDecks.length} crossword-ready decks
              </span>
            </div>
            <button 
              className="ui violet button game-button"
              onClick={() => handleGameNavigation('crossword')}
              disabled={crosswordGameDecks.length === 0}
            >
              {crosswordGameDecks.length === 0 ? 'Need 6+ Cards' : 'Play Crosswords'}
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {decks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>Get Started!</h3>
          <p>Create your first flashcard deck to begin your learning journey.</p>
          <button 
            className="ui large primary button"
            onClick={() => navigate('/decks/createNewDeck')}
          >
            Create Your First Deck
          </button>
        </div>
      )}

    </main>
  );
};

export default Home;
