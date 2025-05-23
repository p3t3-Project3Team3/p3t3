
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { QUERY_SINGLEDECK } from "../utils/queries";

const FlashCards = () => {
//   const { deckId } = useParams<{ deckId: string }>();
// console.log("deckId from params:", deckId)

// const { deckId } = useParams<{ deckId: string }>();
// console.log("deckId from URL:", deckId); // <--- check this!


//   const { data, loading, error } = useQuery(QUERY_SINGLEDECK, {
//     variables: { id: deckId },
//   });
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     console.error("Error fetching deck:", error);
//   }
  
  
// if (!data || !data.getSingleDeck) {
//   return <div>Deck not found.</div>;
// }

// const deck = data.getSingleDeck;

  return (
    <main>
      <div>
        {/* <h1>Play Flashcards with your {deck.title} deck!</h1> */}
        <button className="ui violet button">Play Now</button>
      </div>
    </main>
  );
}
export default FlashCards;