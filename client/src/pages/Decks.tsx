import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ALL_DECKS } from "../utils/queries";
import { DELETE_FLASHCARD } from "../utils/mutations";
import { useNavigate } from "react-router-dom";
import { Modal, } from "semantic-ui-react";
import FlashcardEdit from "../components/Deck/editCard";
import { Flashcard } from "../interfaces/Flashcard";
import { Deck } from "../interfaces/Deck";
import "../styles/deck.css";

interface DecksData {
  getAllDecks: Deck[];
}

const Decks: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data: allDecksData } = useQuery<DecksData>(QUERY_ALL_DECKS);

  // const [deleteFlashcard] = useMutation(DELETE_FLASHCARD);
  const [expandedDeckId, setExpandedDeckId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [modalOpen, setModalOpen] = useState(false);


  const handleDeckClick = (deckId: string) => {
    navigate(`/deck/${deckId}`);
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
          className="large ui inverted green button"
        >
          Create New Deck
        </button>
      </div>

      <div className="decks-grid">
        <h2 className="section-title">
         Deck Count ({allDecksData?.getAllDecks.length})
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
              onClick={() => deck._id && handleDeckClick(deck._id as string)}
            >
              <div className="deck-header">
                <button className=" fluid massive inverted ui yellow button ">{deck.title}</button>
                <div className="deck-meta">
                  <span className="card-count">
                    {deck.flashcards.length}{" "}
                    {deck.flashcards.length === 1 ? "card" : "cards"}
                  </span>
                  <span className="created-by">
                    by {deck.createdByUsername?.username}
                  </span>
                </div>
              </div>

              <div className="deck-description">
                <p>{deck.description}</p>
              </div>

              {deck.flashcards.length > 0 && (
                <div className="ui cards">
                  {flashcardsToShow.map((card: Flashcard) => (
                    <div className="card" key={card._id}>
                      <div className="content">
                        <div className="header">
                          {card.term}
                        </div>
                        <div className="description">
                          <p>
                            <strong>Definition:</strong> {card.definition}
                            <p><strong>Example:</strong> {card.example || "No example provided."}</p>
                          </p>
                        </div>
                        <div className="meta">
                          Created By: {card.createdByUsername?.username ?? "Unknown"}
                        </div>
                      </div>
                          <button
                            className="huge ui inverted grey button "
                            onClick={(e) => {
                              e.stopPropagation(); // prevent deck click
                              setSelectedCard(card);
                              setModalOpen(true);
                            }}
                          >
                            Expand
                          </button>
                    </div>
                  ))}
                </div>
              )}

              {deck.flashcards.length > 3 && (
                <div style={{ marginTop: "1em" }}>
                  <button
                    className="ui violet button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDeckId((prevId) =>
                        prevId === deck._id ? null : (deck._id as string)
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
        </Modal>
        {selectedCard && (
        <FlashcardEdit
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedCard={selectedCard}
          deckId={selectedCard._id}
          refetch={() => {
            setModalOpen(false);
          }
          }
        /> 
        )}
       </main>  
  );
}; 

export default Decks;
