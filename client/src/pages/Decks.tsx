// import { useQuery } from '@apollo/client';
// import { QUERY_ALL_DECKS, QUERY_PROFILES } from '../utils/queries';
// import { useNavigate } from 'react-router-dom';
// import '../styles/deck.css';

// const Decks = () => {
//   const navigate = useNavigate();
//   const { data: dataProfiles } = useQuery(QUERY_PROFILES);
//   const { loading, error, data } = useQuery(QUERY_ALL_DECKS);


//   if (loading) return (
//     <div className="ui segment">
//       <div className="ui active dimmer">
//         <div className="ui indeterminate text loader">Preparing Files</div>
//       </div>
//     </div>
//   );

//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <main>
//       <h1>Welcome to your deck of FlashCards</h1>
//       <div>
//   <h1>All Decks</h1>
//   {data.getAllDecks.map((deck: any) => (
//     <div
//       key={deck._id}
//       style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem', cursor: 'pointer' }}
//     >
//       <h2>{deck.title}</h2>
//       <p>{deck.description}</p>
//       <p>{deck.createdByUsername.username}</p>
//       <div>
//       {deck.flashcards.map((card: any) => (
//         <div key={card._id} style={{ margin: '0.5rem 0' }}>
//           <strong>Definition:</strong> {card.definition}
//           <br />
//           <strong>Example:</strong> {card.example}
//            <div className="meta">Created By: {card.createdByUsername}</div>
//         </div>
//       ))}
//       </div>
//     </div>
//   ))}
// </div>
//     </main>
//   );
// };

// export default Decks;
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ALL_DECKS, QUERY_PROFILES } from '../utils/queries';
import { UPDATE_FLASHCARD} from '../utils/mutations'
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react';
import '../styles/deck.css';
import { div } from 'framer-motion/client';

interface Flashcard {
  _id: string;
  term: string;
  definition: string;
  example?: string;
  createdByUsername: string;
}

interface Deck {
  _id: string;
  title: string;
  description: string;
  createdByUsername: {
    username: string;
  };
  flashcards: Flashcard[];
}

interface DecksData {
  getAllDecks: Deck[];
}

const Decks: React.FC = () => {
  const navigate = useNavigate();
  const { data: dataProfiles } = useQuery(QUERY_PROFILES);
  const { loading, error, data } = useQuery<DecksData>(QUERY_ALL_DECKS);
  const edit = useMutation(UPDATE_FLASHCARD)
  
  const [expandedDeckId, setExpandedDeckId] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeckClick = (deckId: string) => {
    navigate(`/deck/${deckId}`);
  };

  const handleCardClick = (cardId: string, e: React.MouseEvent) => {
  e.stopPropagation(); 
  setExpandedCardId(prev => prev === cardId ? null : cardId);
};

  const handleMemoryGameClick = (deckId: string, event: React.MouseEvent) => {
    event.stopPropagation(); 
    navigate(`/memory-game/${deckId}`);
  };
  
  const handleStudyClick = (deckId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent deck click from firing
    navigate(`/study/${deckId}`);
  };
  
  if (loading) return (
    <div className="ui segment">
      <div className="ui active dimmer">
        <div className="ui indeterminate text loader">Preparing Files</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Error Loading Decks</h2>
      <p>Error: {error.message}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Try Again
      </button>
    </div>
  );
  
  // if (!data?.getAllDecks || data.getAllDecks.length === 0) {
    //   return (
      //     <main className="decks-container">
      //       <div className="decks-header">
      //         <h1>Welcome to your deck of FlashCards</h1>
      //       </div>
      //       <div className="no-decks-message">
      //         <h2>No Decks Available</h2>
      //         <p>You haven't created any flashcard decks yet.</p>
      //         <button 
      //           onClick={() => navigate('/decks/createNewDeck')} 
      //           className="create-deck-button"
      //         >
      //           Create Your First Deck
      //         </button>
      //       </div>
      //     </main>
      //   );
      // }

  return (
    <main className="decks-container">
      <div className="decks-header">
        <h1>Welcome to your deck of FlashCards</h1>
        <button 
          onClick={() => navigate('/decks/createNewDeck')} 
          className="ui inverted yellow button"
        >
          Create New Deck
        </button>
      </div>

      <div className="decks-grid">
        <h2 className="section-title">All Decks ({data?.getAllDecks.length})</h2>

        {data?.getAllDecks.map((deck) => {
          const showAll = expandedDeckId === deck._id;
          const flashcardsToShow = showAll ? deck.flashcards : deck.flashcards.slice(0, 3);

          return (
            <div
              key={deck._id}
              className="deck-card"
              onClick={() => handleDeckClick(deck._id)}
            >
              <div className="deck-header">
                <h3 className="deck-title">{deck.title}</h3>
                <div className="deck-meta">
                  <span className="card-count">
                    {deck.flashcards.length} {deck.flashcards.length === 1 ? 'card' : 'cards'}
                  </span>
                  <span className="created-by">by {deck.createdByUsername.username}</span>
                </div>
              </div>

              <div className="deck-description">
                <p>{deck.description}</p>
              </div>

              <div className="small ui buttons">
                <button
                  onClick={(e) => handleStudyClick(deck._id, e)}
                  className="ui violet button"
                  disabled={deck.flashcards.length === 0}
                >
                  📚 FlashCard
                </button>
                <button
                  onClick={(e) => handleMemoryGameClick(deck._id, e)}
                  className="ui teal button"
                  disabled={deck.flashcards.length < 2}
                >
                  🎮 Memory Game
                </button>
                <button
                  className="ui orange button"
                  disabled={deck.flashcards.length < 2}
                >
                  📝 Crossword Game
                </button>
                <button className="ui pink button">📝 Edit</button>
              </div>

              {deck.flashcards.length > 0 && (
                <div className="ui cards">
                  {flashcardsToShow.map((card) => (
                   <div
  className={`card ${expandedCardId === card._id ? 'expanded-card' : ''}`}
  key={card._id}
onClick={(e) => handleCardClick(card._id, e)}
> 

  <div className="content">
    <div className="header">{card.term}
      <button
  className="mini ui right floated basic grey button "
  onClick={(e) => {
    e.stopPropagation(); // prevent deck click
    setSelectedCard(card);
    setModalOpen(true);
  }}
>
  Expand
</button>
    </div>
    <div className="description">
      <p><strong>Definition:</strong> {card.definition}</p>
      {expandedCardId === card._id && (
        <p><strong>Example:</strong> {card.example || "No example provided."}</p>
      )}
    </div>
    <div className="meta">Created By: {card.createdByUsername.username}</div>
  </div>

  {expandedCardId === card._id && (
    <div className="extra content">
      <div className="ui three buttons">
        <div className="ui basic green button">
          {card.isFavorite ? "★ Favorite" : "☆ Add to Favorites"}
        </div>
        <div
          className="ui basic blue button"
          onClick={(e) => {
            e.stopPropagation();
            // handle delete
          }}
        >
          Edit
        </div>
        <div
          className="ui basic red button"
          onClick={(e) => {
            e.stopPropagation();
            // handle delete
          }}
        >
          Delete
        </div>
      </div>
    </div>
  )}
</div>
                  ))}
                </div>
              )}

              {deck.flashcards.length > 3 && (
                <div style={{ marginTop: '1em' }}>
                  <button
                    className="ui button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDeckId((prevId) => prevId === deck._id ? null : deck._id);
                    }}
                  >
                    {showAll ? 'Hide Full Deck' : 'View Full Deck'}
                  </button>
                </div>
              )}
            {/*<div className="deck-preview">
              <h4 className="preview-title">Preview Cards:</h4>
              <div className="cards-preview">
                {deck.flashcards.slice(0, 3).map((card: Flashcard) => (
                  <div key={card._id} className="card-preview">
                    <div className='ui instant move reveal'>
                    <div className="card-term visible content">
                      <strong>Term:</strong>
                    <div>{card.term}</div>
                    </div>
                    <div className="hidden content">
                      <strong>Definition:</strong>
                      {card.definition}
                    </div>
                    </div>
                    {card.example && (
                      <div className="card-example">
                        <strong>Example:</strong> {card.example}
                      </div>
                    )}
                  </div>
                ))}
                {deck.flashcards.length > 3 && (
                  <div className="more-cards-indicator">
                    +{deck.flashcards.length - 3} more cards
                  </div>
                )}
              </div>
            </div>
          )} */}

           {deck.flashcards.length === 0 && (
                <div className="empty-deck-message">
                  <p>This deck is empty. Add some flashcards to get started!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="large" closeIcon>
  <Modal.Header>{selectedCard?.term}</Modal.Header>
  <Modal.Content>
    <p><strong>Definition:</strong> {selectedCard?.definition}</p>
    <p><strong>Example:</strong> {selectedCard?.example || 'No example provided.'}</p>
    <p><em>Created by: {selectedCard?.createdByUsername?.username}</em></p>
  </Modal.Content>
  <Modal.Actions>
    <Button color="green" basic>
      {selectedCard?.isFavorite ? '★ Favorite' : '☆ Add to Favorites'}
    </Button>
    <Button color="blue" basic>
      Edit
    </Button>
    <Button color="red" basic>
      Delete
    </Button>
    <Button onClick={() => setModalOpen(false)}>
      Close
    </Button>
  </Modal.Actions>
</Modal>
    </main>
  );
};

export default Decks;