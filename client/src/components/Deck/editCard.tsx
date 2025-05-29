import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { QUERY_ALL_DECKS, QUERY_SINGLE_DECK } from "../../utils/queries";
import { UPDATE_FLASHCARD, DELETE_FLASHCARD } from "../../utils/mutations";
import { Modal, Button } from "semantic-ui-react";


interface Flashcard {
  _id: string;
  term: string;
  definition: string;
  example?: string;
  createdByUsername?: {
    username: string;
  };
  isFavorite?: boolean;
}

interface FlashcardEditProps {
    selectedCard: Flashcard;
    deckId: string;
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    refetch?: () => void;
}

const FlashcardEdit: React.FC<FlashcardEditProps> = ({ selectedCard, deckId, modalOpen, setModalOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTerm, setEditTerm] = useState(selectedCard.term);
  const [editDefinition, setEditDefinition] = useState(selectedCard.definition);
  const [editExample, setEditExample] = useState(selectedCard.example || "");
  
const [updateFlashcard] = useMutation(UPDATE_FLASHCARD, {
  refetchQueries: [
    { query: QUERY_SINGLE_DECK, variables: { id: deckId } },
    { query: QUERY_ALL_DECKS },
  ],
});

 const [deleteFlashcard] = useMutation(DELETE_FLASHCARD, {
    refetchQueries: [{ query: QUERY_SINGLE_DECK, variables: { id: deckId } }],
  });

  const handleEditSubmit = async (updatedData: {
    term: string;
    definition: string;
    example: string;
  }) => {
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
      setIsEditing(false);
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating flashcard:", err);
    }
  };

    const handleDelete = async (id: string) => {
    try {
      await deleteFlashcard({ variables: { id } });
      setModalOpen(false);
    } catch (err) {
      console.error("Error deleting flashcard:", err);
    }
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="tiny">
      <Modal.Header>Flashcard Details</Modal.Header>

      <Modal.Content>
        {!isEditing ? (
          <>
            <h3>{selectedCard.term}</h3>
            <p><strong>Definition:</strong> {selectedCard.definition}</p>
            {selectedCard.example && (
              <p><strong>Example:</strong> {selectedCard.example}</p>
            )}
          </>
        ) : (
          <div className="ui form success" style={{ width: "100%" }}>
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
        )}
      </Modal.Content>

      <Modal.Actions>
        {!isEditing ? (
          <>
            <Button color="green" basic>
              {selectedCard.isFavorite ? "★ Favorite" : "☆ Add to Favorites"}
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
          <div className="ui success message">
              <div className="header">Form Completed</div>
    <p>Edit completed</p>
  </div>  
            <Button
              color="blue"
              onClick={() =>
                handleEditSubmit({
                  term: editTerm,
                  definition: editDefinition,
                  example: editExample,
                })
              }
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
  );
};

export default FlashcardEdit;