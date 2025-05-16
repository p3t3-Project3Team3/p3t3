import { useQuery } from '@apollo/client';
import { QUERY_ALL_DECKS } from '../utils/queries';
import '../styles/deck.css';
// import { useQuery } from '@apollo/client';
// import { Navigate } from 'react-router-dom';

// import { QUERY_PROFILES } from '../utils/queries';

//   const { loading, data } = useQuery(QUERY_PROFILES);
//   const profiles = data?.profiles || [];

//     const handleDeckOpen = (deckId: string) => {
  //         // Logic to open the deck goes here
  //         if(deckId !== undefined) {
    //             Navigate(`/decks/${deckId}`);
    //         } else {
      //             console.error("No deck Found");
      //         }
      //         console.log(`Opening deck ${deckId}`);
      //     };
 const Decks = () => {

  const { loading, error, data } = useQuery(QUERY_ALL_DECKS);
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
          <ul>
            {deck.flashcards.map((card: any) => (
              <li key={card._id}>
                <strong>{card.term}</strong>: {card.definition}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </main>
  );
};

export default Decks;
