import { useQuery } from '@apollo/client';
import { QUERY_ALL_DECKS } from '../utils/queries';
import '../styles/deck.css';
import { useNavigate } from 'react-router-dom';
import { QUERY_PROFILES } from '../utils/queries';

const Decks = () => {
  const navigate = useNavigate();

  const { data: dataProfiles } = useQuery(QUERY_PROFILES);
  const profiles = dataProfiles?.profiles || [];

const { loading, error, data } = useQuery(QUERY_ALL_DECKS);

const handleDeckOpen = (deckId: string) => {
  if (deckId !== undefined) {
    navigate(`/decks/${deckId}`);
  } else {
    console.error("No deck Found");
  }
  console.log(`Opening deck ${deckId}`);
};

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

  return (
    <main>
      <h1>Welcome to your deck of FlashCards</h1>
      <div>
      <h1>All Decks</h1>
      {data.getAllDecks.map((deck: any) => (
        <div key={deck._id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
          <h2>{deck.title}</h2>
          <p>{deck.description}</p>
          <div onClick={() => handleDeckOpen(deck._id)} > 
          <ul>
            {deck.flashcards.map((card: any) => (
              <li key={card._id}>
                <strong>{card.term}</strong>: {card.definition}
              </li>
            ))}
          </ul>
          </div>
        </div>
      ))}
    </div>
    </main>
  );
};

export default Decks;
