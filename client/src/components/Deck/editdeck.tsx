import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { QUERY_SINGLE_DECK } from "../../utils/queries";
import { UPDATE_DECK, DELETE_DECK } from "../../utils/mutations";
import { Modal, Button, Form, Message, Confirm } from "semantic-ui-react";

interface Deck {
  _id: string;
  title: string;
  description: string;
  createdByUsername?: { username: string };
}

interface EditDeckProps {
  selectedDeck?: Deck | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  refetch?: () => void;
  deckId?: string;
}

const EditDeck: React.FC<EditDeckProps> = ({ 
  modalOpen, 
  setModalOpen, 
  selectedDeck, 
  deckId, 
  refetch 
}) => {
  const navigate = useNavigate();
  
  // Form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // UI state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form validation
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [updateDeck] = useMutation(UPDATE_DECK, {
    refetchQueries: [
      { query: QUERY_SINGLE_DECK, variables: { id: deckId } },
      { query: QUERY_SINGLE_DECK, variables: { id: selectedDeck?._id } }
    ],
  });

  const [deleteDeck] = useMutation(DELETE_DECK, {
    onCompleted: () => {
      navigate("/game/flashDecks/Decks");
    }
  });

  // Initialize form when selectedDeck changes
  useEffect(() => {
    if (selectedDeck) {
      setEditTitle(selectedDeck.title);
      setEditDescription(selectedDeck.description);
    }
  }, [selectedDeck]);

  // Reset form when modal closes
  useEffect(() => {
    if (!modalOpen) {
      setIsEditing(false);
      setShowSuccess(false);
      setError(null);
      setFormErrors({});
      if (selectedDeck) {
        setEditTitle(selectedDeck.title);
        setEditDescription(selectedDeck.description);
      }
    }
  }, [modalOpen, selectedDeck]);

  const validateForm = (): boolean => {
    const errors: { title?: string; description?: string } = {};
    
    if (!editTitle.trim()) {
      errors.title = "Title is required";
    } else if (editTitle.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }
    
    if (!editDescription.trim()) {
      errors.description = "Description is required";
    } else if (editDescription.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitDeckEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateDeck({
        variables: {
          id: selectedDeck?._id,
          input: {
            title: editTitle.trim(),
            description: editDescription.trim(),
          },
        },
      });
      
      refetch?.();
      setShowSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => {
        setShowSuccess(false);
        setModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Error updating deck:", err);
      setError("Failed to update deck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeck = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteDeck({ 
        variables: { 
          deckId: deckId || selectedDeck?._id 
        } 
      });
    } catch (err) {
      console.error("Error deleting deck:", err);
      setError("Failed to delete deck. Please try again.");
      setIsLoading(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setError(null);
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
    setError(null);
    if (selectedDeck) {
      setEditTitle(selectedDeck.title);
      setEditDescription(selectedDeck.description);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setModalOpen(false);
    }
  };

  if (!selectedDeck) {
    return null;
  }

  return (
    <>
      <Modal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        size="small"
        closeOnDimmerClick={!isLoading}
      >
        <Modal.Header>
          {isEditing ? "Edit Deck" : "Deck Details"}
        </Modal.Header>
        
        <Modal.Content>
          {showSuccess && (
            <Message success>
              <Message.Header>Success!</Message.Header>
              <p>Deck updated successfully.</p>
            </Message>
          )}
          
          {error && (
            <Message error>
              <Message.Header>Error</Message.Header>
              <p>{error}</p>
            </Message>
          )}

          {!isEditing ? (
            <div>
              <h3>{selectedDeck.title}</h3>
              <p>
                <strong>Description:</strong> {selectedDeck.description}
              </p>
              {selectedDeck.createdByUsername && (
                <p>
                  <strong>Created by:</strong> {selectedDeck.createdByUsername.username}
                </p>
              )}
            </div>
          ) : (
            <Form onSubmit={handleSubmitDeckEdit} loading={isLoading}>
              <Form.Field error={!!formErrors.title}>
                <label>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter deck title..."
                  disabled={isLoading}
                />
                {formErrors.title && (
                  <div className="ui pointing red basic label">
                    {formErrors.title}
                  </div>
                )}
              </Form.Field>
              
              <Form.Field error={!!formErrors.description}>
                <label>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter deck description..."
                  rows={3}
                  disabled={isLoading}
                />
                {formErrors.description && (
                  <div className="ui pointing red basic label">
                    {formErrors.description}
                  </div>
                )}
              </Form.Field>
            </Form>
          )}
        </Modal.Content>

        <Modal.Actions>
          {!isEditing ? (
            <>
              <Button 
                primary 
                onClick={handleStartEdit}
                disabled={isLoading}
              >
                Edit
              </Button>
              <Button 
                color="red" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button 
                positive 
                onClick={handleSubmitDeckEdit}
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
              <Button 
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </>
          )}
          
          <Button 
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Actions>
      </Modal>

      <Confirm
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          handleDeleteDeck();
        }}
        header="Delete Deck"
        content="Are you sure you want to delete this deck? This action cannot be undone."
        confirmButton="Delete"
        cancelButton="Cancel"
      />
    </>
  );
};

export default EditDeck;