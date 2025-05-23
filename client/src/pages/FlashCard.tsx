import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLEDECK } from "../utils/queries";

const FlashCards = () => {
  const { deckId } = useParams<{ deckId: string }>();
  console.log("deckId from params:", deckId);

  const { data, loading, error } = useQuery(QUERY_SINGLEDECK, {
    variables: { id: deckId },
    skip: !deckId, // don't run the query if deckId is undefined
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching deck:", error);
    return <div>Error loading deck.</div>;
  }

  if (!data || !data.getSingleDeck) {
    return <div>Deck not found.</div>;
  }

  const deck = data.getSingleDeck;

  return (
    <main>
      <div>
        <h1>Play Flashcards with your "{deck.title}" deck!</h1>
        <p>{deck.description}</p>
        <button className="ui violet button">Play Now</button>

        <div style={{ marginTop: "2rem" }}>
          <h2>Flashcards:</h2>
          {deck.flashcards.length === 0 ? (
            <p>No flashcards in this deck yet.</p>
          ) : (
            <ul>
              {deck.flashcards.map((card: any) => (
                <li key={card._id}>
                  <strong>{card.term}</strong>: {card.definition}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default FlashCards;
