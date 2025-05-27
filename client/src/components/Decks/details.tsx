import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLEDECK } from "../../utils/queries";
import { DELETE_FLASHCARD } from "../../utils/mutations";
import { useState } from "react";

const DeckDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(QUERY_SINGLEDECK, {
    variables: { id },
     skip: !id,
     
  });

  const [deleteFlashcard] = useMutation(DELETE_FLASHCARD);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!selectedFlashcardId) return;
    try {
      await deleteFlashcard({
        variables: { id: selectedFlashcardId },
        refetchQueries: [
          {
            query: QUERY_SINGLEDECK,
            variables: { id },
          },
        ],
      });
      setIsModalOpen(false);
      setSelectedFlashcardId(null);
    } catch (err) {
      console.error("Failed to delete flashcard:", err);
    }
  };

  if (!id) return <p>Invalid Deck ID</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const deck = data.getSingleDeck;

  return (
    <main>
      <h1>{deck.title}</h1>
      <p>{deck.description}</p>

      <div className="ui cards">
        {deck.flashcards.map((card: any) => (
          <div className="card" key={card._id}>
            <div className="content">
              <div className="header">{card.term}</div>
              <div className="description">
                <p>
                  <strong>Definition:</strong> {card.definition}
                </p>
                <p>
                  <strong>Example:</strong> {card.example}
                </p>
              </div>
              <div className="meta">Created By: {card.createdByUsername}</div>
            </div>
            <div className="extra content">
              <div className="ui two buttons">
                <div className="ui basic green button">
                  {card.isFavorite ? "★ Favorite" : "☆ Add to Favorites"}
                </div>
                <div
                  className="ui basic red button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFlashcardId(card._id);
                    setIsModalOpen(true);
                  }}
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="ui dimmer modals visible active">
          <div className="ui standard modal visible active">
            <div className="header">Confirm Delete</div>
            <div className="content">
              <p>Are you sure you want to delete this flashcard?</p>
            </div>
            <div className="actions">
              <div className="ui red button" onClick={handleDelete}>
                Delete
              </div>
              <div
                className="ui button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFlashcardId(null);
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DeckDetail;
