// import { useQuery } from '@apollo/client';
// import 'semantic-ui-css/semantic.min.css';
// import '../styles/Home.css';

// import { QUERY_PROFILES } from '../utils/queries';

// const Home = () => {
//   const { loading, data } = useQuery(QUERY_PROFILES);
//   const profiles = data?.profiles || [];

//   return (
//     <main>
//       <div>
//         <h1>Welcome to the Brain games Page</h1>
//         <h4>This is the home page. It can display the games and the different decks here.</h4>
//         {/* <div>
//           {loading ? (
//             <div>Loading...</div>
//           ) : (
//             <h3>There are {profiles.length} users.</h3>
//           )}
//         </div> */}
//         <div className='gameContainer'> 
//           <div className="homeFlashcard">
//             <h2>Flashcard Game</h2>
//             <p>Test your knowledge with our flashcard game!</p>
//             <button className="ui violet button">Play Now</button>
//           </div>
//           <div className="homeMatching">
//             <h2>Matching Game</h2>
//             <p>Test your knowledge with our Matching game!</p>
//             <button className="ui violet button">Play Now</button>
//           </div>
//           <div className="homeCrossword">
//             <h2>Crossword Game</h2>
//             <p>Test your knowledge with our Crossword game!</p>
//             <button className="ui violet button">Play Now</button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Home;

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
        navigate('/game/flashCards/Decks'); // Fixed: Use your existing route
      } else if (availableDecks.length === 1) {
        // Fixed: Navigate to specific deck flashcard route
        navigate(`/flashcard/${availableDecks[0]._id}/flashCards`);
      } else {
        navigate('/game/flashCards/Decks'); // Let user choose from multiple decks
      }
    } else if (gameType === 'memory') {
      if (memoryGameDecks.length === 0) {
        alert('Need at least one deck with 2 or more cards for the memory game!');
        navigate('/game/flashCards/Decks');
      } else if (memoryGameDecks.length === 1) {
        // Fixed: Navigate to specific deck matching route
        navigate(`/matching/${memoryGameDecks[0]._id}`);
      } else {
        navigate('/game/flashCards/Decks'); // Let user choose from multiple decks
      }
    } else if (gameType === 'crossword') {
      if (crosswordGameDecks.length === 0) {
        alert('Need at least one deck with 6 or more cards for crosswords!');
        navigate('/game/flashCards/Decks');
      } else if (crosswordGameDecks.length === 1) {
        // Fixed: Navigate to specific deck crossword route
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

      {/* Recent Decks Preview */}
      {/* {decks.length > 0 && (
        <div className="recent-decks-section">
          <h3>Recent Decks</h3>
          <div className="decks-preview">
            {decks.slice(0, 3).map((deck) => (
              <div key={deck._id} className="deck-preview-card">
                <h4>{deck.title}</h4>
                <p>{deck.description}</p>
                <div className="deck-preview-stats">
                  <span>{deck.flashcards.length} cards</span>
                </div>
                <div className="deck-preview-actions">
                  <button 
                    className="ui small button"
                    onClick={() => navigate(`/deck/${deck._id}`)}
                  >
                    View
                  </button>
                  {deck.flashcards.length >= 2 && (
                    <button 
                      className="ui small violet button"
                      onClick={() => navigate(`/matching/${deck._id}`)} // Fixed: Use correct route
                    >
                      Play Memory
                    </button>
                  )}
                  {deck.flashcards.length >= 1 && (
                    <button 
                      className="ui small blue button"
                      onClick={() => navigate(`/flashcard/${deck._id}/flashCards`)} // Fixed: Use correct route
                    >
                      Study
                    </button>
                  )}
                  {deck.flashcards.length >= 1 && (
                    <button 
                      className="ui small red button"
                      onClick={() => navigate(`/crossword/${deck._id}`)} // Fixed: Use correct route
                    >
                      Crossword
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {decks.length > 3 && (
            <div className="view-all-link">
              <button 
                className="ui basic button"
                onClick={() => navigate('/game/flashCards/Decks')} // Fixed: Use your existing route
              >
                View All {decks.length} Decks →
              </button>
            </div>
          )}
        </div>
      )} */}

      {/* Empty State */}
      {decks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>Get Started!</h3>
          <p>Create your first flashcard deck to begin your learning journey.</p>
          <button 
            className="ui large primary button"
            onClick={() => navigate('/decks/createNewDeck')} // Fixed: Use your existing route
          >
            Create Your First Deck
          </button>
        </div>
      )}

    </main>
  );
};

export default Home;
