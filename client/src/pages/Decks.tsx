// export default Decks;
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ALL_DECKS, QUERY_SINGLE_DECK } from "../utils/queries";
import { UPDATE_FLASHCARD, DELETE_FLASHCARD } from "../utils/mutations";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "semantic-ui-react";
import "../styles/deck.css";
import { div } from "framer-motion/client";

interface Flashcard {
  _id: string;
  term: string;
  definition: string;
  example?: string;
  createdByUsername: {
    username: string;
  };
  isFavorite?: boolean;
}

interface Deck {
  _id: string;
  title: string;
  description: string;
  createdByUsername: {
    username: string;
  };
  flashcards: Flashcard[];
}

interface DecksData {
  getAllDecks: Deck[];
}

const Decks: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data: allDecksData } = useQuery<DecksData>(QUERY_ALL_DECKS);
 const [updateFlashcard, { error: updateError }] = useMutation(UPDATE_FLASHCARD, {
  refetchQueries: [{ query: QUERY_ALL_DECKS }],
  awaitRefetchQueries: true,
});
  const [deleteFlashcard] = useMutation(DELETE_FLASHCARD);
  const [expandedDeckId, setExpandedDeckId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [editExample, setEditExample] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleDeckClick = (deckId: string) => {
    navigate(`/deck/${deckId}`);
  };

  const handleCardClick = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handleMemoryGameClick = (deckId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/matching/${deckId}`);
  };

  const handleStudyClick = (deckId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent deck click from firing
    navigate(`/flashcard/${deckId}`);
  };

  const handleEdit = async (card: Flashcard) => {
    setSelectedCard(card);
    setEditTerm(card.term);
    setEditDefinition(card.definition);
    setEditExample(card.example || "");
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditSubmit = async (updatedData: {term: string; definition: string; example: string}) => {
    if (!selectedCard) {
      console.error("No card selected for editing.");
      return;
    }
    try {
      await updateFlashcard({
        variables: {
          id: selectedCard._id,
          input: {
            term: updatedData.term,
            definition: updatedData.definition,
            example: updatedData.example,
            isFavorite: selectedCard.isFavorite || false,
          },
        },
      });
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating flashcard:", err);
    }
  };

  const handleDelete = async (cardId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this flashcard?"
    );
    if (!confirmDelete) return;

    try {
      await deleteFlashcard({
  variables: { id: cardId },
  update(cache, { data: { deleteFlashcard } }) {
    if (deleteFlashcard) {
      const existingData = cache.readQuery<{ getAllDecks: Deck[] }>({ query: QUERY_ALL_DECKS });
      if (!existingData) return;

      const updatedDecks = existingData.getAllDecks.map(deck => ({
        ...deck,
        flashcards: deck.flashcards.filter(card => card._id !== cardId),
      }));

      cache.writeQuery({
        query: QUERY_ALL_DECKS,
        data: { getAllDecks: updatedDecks },
      });
    }
  }
});
    } catch (err) {
      console.error("Error deleting flashcard:", err);
    }
  };

  if (loading)
    return (
      <div className="ui segment">
        <div className="ui active dimmer">
          <div className="ui indeterminate text loader">Preparing Files</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <h2>Error Loading Decks</h2>
        <p>Error: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <main className="decks-container">
      <div className="decks-header">
        <h1>Welcome to your deck of FlashCards</h1>
        <button
          onClick={() => navigate("/decks/createNewDeck")}
          className="ui inverted yellow button"
        >
          Create New Deck
        </button>
      </div>

      <div className="decks-grid">
        <h2 className="section-title">
          All Decks ({allDecksData?.getAllDecks.length})
        </h2>

        {allDecksData?.getAllDecks.map((deck) => {
          const showAll = expandedDeckId === deck._id;
          const flashcardsToShow = showAll
            ? deck.flashcards
            : deck.flashcards.slice(0, 3);

          return (
            <div
              key={deck._id}
              className="deck-card"
              onClick={() => handleDeckClick(deck._id)}
            >
              <div className="deck-header">
                <h3 className="deck-title">{deck.title}</h3>
                <div className="deck-meta">
                  <span className="card-count">
                    {deck.flashcards.length}{" "}
                    {deck.flashcards.length === 1 ? "card" : "cards"}
                  </span>
                  <span className="created-by">
                    by {deck.createdByUsername.username}
                  </span>
                </div>
              </div>

              <div className="deck-description">
                <p>{deck.description}</p>
              </div>

              <div className="small ui buttons">
                <button
                  onClick={(e) => handleStudyClick(deck._id, e)}
                  className="ui violet button"
                  disabled={deck.flashcards.length === 0}
                >
                  📚 FlashCard
                </button>
                <button
                  onClick={(e) => handleMemoryGameClick(deck._id, e)}
                  className="ui teal button"
                  disabled={deck.flashcards.length < 2}
                >
                  🎮 Memory Game
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/crossword/${deck._id}`);
                  }}
                  className="ui orange button"
                  disabled={deck.flashcards.length < 2}
                >
                  📝 Crossword Game
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/deck/${deck._id}/new-card`);
                  }}
                  className="ui pink button"
                >
                  📝 Add Cards
                 Deck</button>
              </div>

              {deck.flashcards.length > 0 && (
                <div className="ui cards">
                  {flashcardsToShow.map((card) => (
                    <div
                      className={`card ${
                        expandedCardId === card._id ? "expanded-card" : ""
                      }`}
                      key={card._id}
                      onClick={(e) => handleCardClick(card._id, e)}
                    >
                      <div className="content">
                        <div className="header">
                          {card.term}
                          <button
                            className="mini ui right floated basic grey button "
                            onClick={(e) => {
                              e.stopPropagation(); // prevent deck click
                              setSelectedCard(card);
                              setModalOpen(true);
                            }}
                          >
                            Expand
                          </button>
                        </div>
                        <div className="description">
                          <p>
                            <strong>Definition:</strong> {card.definition}
                          </p>
                          {expandedCardId === card._id && (
                            <p>
                              <strong>Example:</strong>{" "}
                              {card.example || "No example provided."}
                            </p>
                          )}
                        </div>
                        <div className="meta">
                          Created By: {card.createdByUsername.username}
                        </div>
                      </div>

                      {expandedCardId === card._id && (
                        <div className="extra content">
                          <div className="ui three buttons">
                            <div className="ui basic green button">
                              {card.isFavorite
                                ? "★ Favorite"
                                : "☆ Add to Favorites"}
                            </div>
                            <div
                              className="ui basic blue button"
                              onClick={(e) => {
                                e.stopPropagation();
                               handleEdit(card);
                              }}
                            >
                              <i className="pencil alternate icon"></i>Edit
                            </div>
                            <div
                              className="ui basic red button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(card._id);
                              }}
                            >
                              <i className="trash alternate icon"></i>
                              Delete
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {deck.flashcards.length > 3 && (
                <div style={{ marginTop: "1em" }}>
                  <button
                    className="ui button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDeckId((prevId) =>
                        prevId === deck._id ? null : deck._id
                      );
                    }}
                  >
                    {showAll ? "Hide Full Deck" : "View Full Deck"}
                  </button>
                </div>
              )}
              {deck.flashcards.length === 0 && (
                <div className="empty-deck-message">
                  <p>This deck is empty. Add some flashcards to get started!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="large"
        closeIcon
      >
        <Modal.Header>{selectedCard?.term}</Modal.Header>
        <Modal.Content>
          <p>
            <strong>Definition:</strong> {selectedCard?.definition}
          </p>
          <p>
            <strong>Example:</strong>{" "}
            {selectedCard?.example || "No example provided."}
          </p>
          <p>
            <em>Created by: {selectedCard?.createdByUsername?.username}</em>
          </p>
        </Modal.Content>
        <Modal.Actions>
  {!isEditing ? (
    <>
      <Button color="green" basic>
        {selectedCard?.isFavorite ? "★ Favorite" : "☆ Add to Favorites"}
      </Button>
      <Button color="blue" basic onClick={() => setIsEditing(true)}>
        <i className="pencil alternate icon"></i> Edit
      </Button>
      <Button
        color="red"
        basic
        onClick={() => handleDelete(selectedCard._id)}
      >
        <i className="trash alternate icon"></i> Delete
      </Button>
    </>
  ) : (
    <>
      <div className="ui form" style={{ width: "100%", marginBottom: "1em" }}>
        <div className="field">
          <label>Term</label>
          <input
            type="text"
            value={editTerm}
            onChange={(e) => setEditTerm(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Definition</label>
          <textarea
            value={editDefinition}
            onChange={(e) => setEditDefinition(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Example</label>
          <textarea
            value={editExample}
            onChange={(e) => setEditExample(e.target.value)}
          />
        </div>
      </div>
      <Button
        color="blue"
        onClick={() => {
          handleEditSubmit({
            term: editTerm,
            definition: editDefinition,
            example: editExample,
          });
          setIsEditing(false);
        }}
      >
        ✅ Save Edit
      </Button>
      <Button basic onClick={() => setIsEditing(false)}>
        Cancel
      </Button>
    </>
  )}
  <Button onClick={() => setModalOpen(false)}>Close</Button>
</Modal.Actions>

      </Modal>
    </main>
  );
};

export default Decks;
