import { useQuery } from '@apollo/client';
import { QUERY_ALL_DECKS, QUERY_PROFILES } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import '../styles/deck.css';

const Decks = () => {
  const navigate = useNavigate();
  const { data: dataProfiles } = useQuery(QUERY_PROFILES);
  const { loading, error, data } = useQuery(QUERY_ALL_DECKS);

  const handleDeckOpen = (deckId: string) => {
    navigate(`/decks/${deckId}`);
  };

  if (loading) return (
    <div className="ui segment">
      <div className="ui active dimmer">
        <div className="ui indeterminate text loader">Preparing Files</div>
      </div>
    </div>
  );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <main>
      <h1>Welcome to your deck of FlashCards</h1>
      <div>
  <h1>All Decks</h1>
  {data.getAllDecks.map((deck: any) => (
    <div
      key={deck._id}
      style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem', cursor: 'pointer' }}
    >
      <h2>{deck.title}</h2>
      <p>{deck.description}</p>
      <button onClick={() => handleDeckOpen(deck._id)}>View flashcards</button>
    </div>
  ))}
</div>
    </main>
  );
};

export default Decks;
