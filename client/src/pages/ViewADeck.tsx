import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_SINGLE_DECK, QUERY_FLASHCARDS_BY_DECK } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import { DELETE_DECK } from '../utils/mutations';
import { Flashcard } from '../interfaces/Flashcard';
import FlashcardEdit from '../components/Deck/editCard';
import EditDeck from '../components/Deck/editdeck';
import '../styles/ViewADeck.css';

interface Deck {
  _id: string;
  title: string;
  description: string;
  createdByUsername?: {
    username: string;
  };
}

const DeckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = React.useState<'grid' | 'carousel'>('grid');
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleDelete = (cardId: string) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      console.log(`Deleting flashcard with ID: ${cardId}`);
    }
  };

  const [selectedCard, setSelectedCard] = React.useState<Flashcard | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deckModalOpen, setDeckModalOpen] = React.useState(false);

  const { data: deckData, loading: deckLoading, error: deckError, refetch: refetchDeck } = useQuery(QUERY_SINGLE_DECK, {
    variables: { id },
  });

  const { data: cardsData, loading: cardsLoading, refetch: refetchCards } = useQuery(QUERY_FLASHCARDS_BY_DECK, {
    variables: { deckId: id },
  });

  const [deleteDeck, { loading: deleting, error: deleteError }] = useMutation(DELETE_DECK, {
    onCompleted: () => {
      navigate('/game/flashCards/Decks');
    },
    onError: (error) => {
      console.error("Error deleting deck:", error);
    }
  });

  const handleAddNewCardClick = () => {
    navigate(`/deck/${id}/new-card`);
  };

  const handleDeleteDeck = () => {
    if(window.confirm('Are you sure you want to delete this deck?')) {
      deleteDeck({ variables: { id } });
    }
  };

  // Carousel navigation functions
  const nextCard = () => {
    const flashcards = cardsData?.getFlashcardsByDeck || [];
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    const flashcards = cardsData?.getFlashcardsByDeck || [];
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const goToCard = (index: number) => {
    setCurrentCardIndex(index);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode === 'carousel') {
        if (e.key === 'ArrowLeft') {
          prevCard();
        } else if (e.key === 'ArrowRight') {
          nextCard();
        } else if (e.key === ' ') {
          e.preventDefault();
          flipCard();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode]);

  if (deckLoading || cardsLoading) return <p>Loading...</p>;
  if (deckError) return <p>Error loading deck!</p>;

  const deck: Deck = deckData?.getSingleDeck;
  if (!deck) return <p>Deck not found.</p>;

  const flashcards: Flashcard[] = cardsData?.getFlashcardsByDeck || [];

  const renderCarousel = () => {
    if (flashcards.length === 0) {
      return <p>No flashcards yet.</p>;
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="carousel-container">
        {/* Carousel Controls */}
        <div className="carousel-controls">
          <button 
            className="ui circular icon button"
            onClick={prevCard}
            disabled={flashcards.length <= 1}
          >
            <i className="chevron left icon"></i>
          </button>
          
          <div className="carousel-counter">
            <span>
              {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>
          
          <button 
            className="ui circular icon button"
            onClick={nextCard}
            disabled={flashcards.length <= 1}
          >
            <i className="chevron right icon"></i>
          </button>
        </div>

        {/* Card */}
        <div className="card-container">
          <div 
            className={`ui card flip-card ${isFlipped ? 'flipped' : ''}`}
            onClick={flipCard}
          >
            {/* Front of card */}
            <div className="card-face front">
              <div className="header card-term">
                {currentCard.term}
              </div>
              <div className="card-flip-hint">
                Click to reveal definition
              </div>
            </div>

            {/* Back of card */}
            <div className="card-face back">
              <div className="card-definition">
                <strong>Definition:</strong> {currentCard.definition}
              </div>
              {currentCard.example && (
                <div className="card-example">
                  <strong>Example:</strong> {currentCard.example}
                </div>
              )}
              <div className="card-creator">
                Created by: {currentCard.createdByUsername?.username || "Unknown"}
              </div>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <div className="ui three buttons">
            <button
              className="ui inverted yellow button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCard(currentCard);
                setModalOpen(true);
              }}
            >
              <i className="pencil alternate icon"></i> Edit
            </button>
            <button
              className="ui inverted green button"
              onClick={flipCard}
            >
              <i className="refresh icon"></i> Flip
            </button>
            <button
              className="ui inverted red button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(currentCard._id);
              }}
            >
              <i className="trash alternate icon"></i> Delete
            </button>
          </div>
        </div>

        {/* Dots indicator */}
        {flashcards.length > 1 && (
          <div className="dots-container">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`dot ${index === currentCardIndex ? 'active' : 'inactive'}`}
              />
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="carousel-instructions">
          Use arrow keys to navigate • Spacebar to flip • Click card to flip
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    return (
      <>
        {flashcards.length === 0 ? (
          <p>No flashcards yet.</p>
        ) : (
          <div className="ui cards">
            {flashcards.map((card) => (
              <div
                className= 'card'
                key={card._id}
              >
                <div className="content">
                  <div className="header">
                    {card.term}
                  </div>
                  <div className="description">
                    <p><strong>Definition:</strong> {card.definition}</p>
                      <p><strong>Example:</strong> {card.example || "No example provided."}</p>
                  </div>
                  <div className="meta">
                    Created By: {card.createdByUsername?.username || "Unknown"}
                  </div>
                </div>
                    <button
                      className="huge ui inverted grey button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card);
                        setModalOpen(true);
                      }}
                    >
                      Expand
                    </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className='view-a-deck'>
      <h2 className='deck-title'>{deck.title}</h2>
      <p className='deck-description'> {deck.description}</p>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <div className="ui buttons">
          <button 
            className={`ui button ${viewMode === 'grid' ? 'black ' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="grid layout icon"></i> Grid View
          </button>
          <button 
            className={`ui button ${viewMode === 'carousel' ? 'black' : ''}`}
            onClick={() => setViewMode('carousel')}
          >
            <i className="images icon"></i> Carousel View
          </button>
        </div>
      </div>

      <h3>Flashcards</h3>
      
      {viewMode === 'grid' ? renderGrid() : renderCarousel()}

      {selectedCard && (
        <FlashcardEdit
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedCard={selectedCard}
          deckId={deck._id}
          refetch={refetchCards}
        />
      )}
      
      {deckModalOpen && (
        <EditDeck
          modalOpen={deckModalOpen}
          setModalOpen={setDeckModalOpen}
          selectedDeck={deck || undefined}
          deckId={deck._id}
          refetch={refetchDeck}
        />
      )}

      <div className="action-buttons-container">
        <button onClick={handleAddNewCardClick} className="ui blue button">
          Add New Flashcard
        </button>
        <button onClick={handleDeleteDeck} className="ui red button" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Deck'}
        </button>
        <button onClick={() => setDeckModalOpen(true)} className="ui pink button">
          Edit Deck
        </button>
        {deleteError && <p className="error-message">Error deleting deck: {deleteError.message}</p>}
      </div>
    </div>
  );
};

export default DeckDetail;