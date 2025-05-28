import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_SINGLE_DECK, QUERY_FLASHCARDS_BY_DECK } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import { DELETE_DECK } from '../utils/mutations';

interface Flashcard {
  _id: string;
  term: string;
  definition: string;
  example?: string;
}

interface Deck {
  _id: string;
  title: string;
  description: string;
}

const DeckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: deckData, loading: deckLoading, error: deckError } = useQuery(QUERY_SINGLE_DECK, {
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

  if (deckLoading || cardsLoading) return <p>Loading...</p>;
  if (deckError) return <p>Error loading deck!</p>;

  const deck: Deck = deckData?.getSingleDeck;
  if (!deck) return <p>Deck not found.</p>;

  const flashcards: Flashcard[] = cardsData?.getFlashcardsByDeck || [];

  return (
    <div>
      <h2>{deck.title}</h2>
      <p>{deck.description}</p>

      <h3>Flashcards</h3>
      <ul>
        {flashcards.length === 0 && <p>No flashcards yet.</p>}
        {flashcards.map((card) => (
          <li key={card._id}>
            <strong>{card.term}</strong>: {card.definition}
            {card.example && <em> (Example: {card.example})</em>}
          </li>
        ))}
      </ul>
     <button
        onClick={handleAddNewCardClick}
        className="ui blue button"
      >Add New Flashcard</button>
       <button
        onClick={handleDeleteDeck}
        className="ui red button"
        disabled={deleting}
      >
        {deleting ? 'Deleting...' : 'Delete Deck'}
        {deleteError && <p style={{ color: 'red' }}>Error deleting deck: {deleteError.message}</p>}
      </button>
    </div>
  );
};

export default DeckDetail;
