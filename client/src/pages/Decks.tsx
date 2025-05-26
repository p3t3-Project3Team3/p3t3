import { useQuery } from '@apollo/client';
import { QUERY_ALL_DECKS, QUERY_PROFILES } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import '../styles/deck.css';

const Decks = () => {
  const navigate = useNavigate();
  const { data: dataProfiles } = useQuery(QUERY_PROFILES);
  const { loading, error, data } = useQuery(QUERY_ALL_DECKS);


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
      <p>{deck.createdByUsername.username}</p>
      <div>
      {deck.flashcards.map((card: any) => (
        <div key={card._id} style={{ margin: '0.5rem 0' }}>
          <strong>Definition:</strong> {card.definition}
          <br />
          <strong>Example:</strong> {card.example}
           <div className="meta">Created By: {card.createdByUsername}</div>
        </div>
      ))}
      </div>
    </div>
  ))}
</div>
    </main>
  );
};

export default Decks;
