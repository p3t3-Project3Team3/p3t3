import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_SINGLE_DECK, QUERY_FLASHCARDS_BY_DECK } from '../utils/queries';
import { useNavigate } from 'react-router-dom';

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


  const handleAddNewCardClick = () => {
    navigate(`/deck/${id}/new-card`);
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
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
      >Add New Flashcard</button>
    </div>
  );
};

export default DeckDetail;
