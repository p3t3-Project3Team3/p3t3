// This file contains the Deck component, which is responsible for rendering the deck of cards in the game.
import {QUERY_SINGLEDECK } from '../../utils/queries';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
const Deck = () => {
  const { id: id } = useParams();
    const { data, loading } = useQuery(QUERY_SINGLEDECK, {
      variables: { id: id },
    });

    if (loading) {
      return <div>Loading...</div>;
    }

    const deck = data?.singleDeck;

    if (!deck) {
      return <div>Deck not found.</div>;
    }
    
  return (
    <div className="deck">
      <h2 key={deck._id} >{deck.title}</h2>
      <div className="deck-box"> </div>
    </div>
  );
}

 
export default Deck;