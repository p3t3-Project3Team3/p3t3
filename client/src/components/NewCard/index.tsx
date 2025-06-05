import React, { useState } from 'react';
import { CardFront } from "../CardFront";
import { CardBack } from "../CardBack";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SINGLE_DECK } from '../../utils/queries';  
import { CREATE_FLASHCARD } from '../../utils/mutations';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Flashcard } from '../../interfaces/Flashcard';
import { Deck } from '../../interfaces/Deck';
import '../../styles/AddFlashcard.css';  



interface NewCardProps {
  onAdd: (newFlashcard: { term: string; definition: string }) => void;
}

const NewCard: React.FC<NewCardProps> = ({ onAdd }) => {
  const { id } = useParams<{ id: string }>();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFlipped, setPreviewFlipped] = useState(false);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(QUERY_SINGLE_DECK, {
    variables: { id: id },
    skip: !id,
  });

const [createFlashcard] = useMutation(CREATE_FLASHCARD, {
  onCompleted: (data) => {
    console.log('Flashcard created, server returned:', data);
    setTerm('');
    setDefinition('');
    setExample('');
    setIsCreating(false);
    setShowPreview(false);
  },
  onError: (error) => {
    console.error('Error creating flashcard:', error);
    setIsCreating(false);
  }
});

const handleCreate = async () => {
  if (!term.trim() || !definition.trim()) {
    alert('Please fill in both term and definition');
    return;
  }

  setIsCreating(true);
  try {
    await createFlashcard({
      variables: {
        input: {
          term,
          definition,
          example,
      deckId: id, 
        }
      },
      refetchQueries: [{ query: QUERY_SINGLE_DECK, variables: { id } }],
    });

    // Notify parent component
    onAdd({ term: term.trim(), definition: definition.trim() });

    // Reset form
    setTerm('');
    setDefinition('');
    setIsCreating(false);
    setShowPreview(false);
  } catch (error) {
    console.error('Failed to create flashcard:', error);
    setIsCreating(false);
  }
};

  const handlePreview = () => {
    if (!term.trim() || !definition.trim()) {
      alert('Please fill in both term and definition to preview');
      return;
    }
    setShowPreview(true);
    setPreviewFlipped(false);
  };

  const handleClearForm = () => {
    setTerm('');
    setDefinition('');
    setShowPreview(false);
  };

 const handleDone = () => {
    navigate(`/deck/${id}`); 
  };

  if (loading) return <div className="flex justify-center p-8"><p>Loading deck...</p></div>;
  if (error) return <div className="flex justify-center p-8 text-red-600"><p>Error loading deck: {error.message}</p></div>;
  if (!data?.getSingleDeck) return <div className="flex justify-center p-8"><p>Deck not found</p></div>;

  const deck: Deck = data.getSingleDeck;

  return (
    <div className=" justify-center container-lg">
      {/* Header */}
      <div className="form-header">
        <h1 className="form-create">Add Flashcards to "{deck.title}"</h1>
        <p className="form-subtitle">
          Current cards in deck: {deck.flashcards.length}
        </p>
      </div>

      {/* New Card Form */}
      <form className="form">
        <div className="form-group">
          <h3 className="form-create">Create New Flashcard:</h3>
          
          <div className="form-field">
            {/* Term Input */}
            <div className="field">
              <label className="form-label">Term or Question: </label>
              <textarea
                className="form-textarea form-success"
                name="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Enter the term, question, or prompt..."
                rows={4}
                maxLength={500}
              />
            </div>
            
            {/* Definition Input */}
            <div className="field">
              <label className='form-label'>
                Definition or Answer: 
              </label>
              <textarea
                className="form-textarea form-success "
                name="definition"
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                placeholder="Enter the definition, answer, or explanation..."
                rows={4}
                maxLength={500}
              />
            </div>
  
            {/* Example Input */}
            <div className="field">
              <label className='form-label'>
                Example: 
              </label>
              <textarea
                className="form-textarea form-success"
                name="example"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Enter an example..."
                rows={4}
                maxLength={500}
              />
            </div>
  
          </div>
          {/* Action Buttons */}
          <div className="">
            <button
              onClick={handleCreate}
              disabled={isCreating || !term.trim() || !definition.trim()}
              className="btn-primary btn-lg"
            >
              {isCreating ? 'Creating...' : 'Add Flashcard'}
            </button>
            
            <button
              onClick={handlePreview}
              disabled={!term.trim() || !definition.trim()}
              className="btn-secondary btn-lg"
            >
              Preview Card
            </button>
            
            <button
              onClick={handleClearForm}
              className="btn-danger btn-lg"
            >
              Clear Form
            </button>
              
            <button onClick={handleDone} className="btn-success btn-lg">Done</button>
  
          </div>
        </div>
      </form>

      {/* Preview Modal */}
       
          <div className="flashcard-list">
            {deck.flashcards.map((card: Flashcard) => (
             <div
              key={card._id}
              className="flashcard-item"
            >
              <div className="flashcard-header">
                <div>
                  <label className="flashcard-label">Term</label>
                  <p className="flashcard-text">{card.term}</p>
                </div>
                <div>
                  <label className="flashcard-label">Definition</label>
                  <p className="flashcard-text">{card.definition}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        
      </div>
    
  );
};

export default NewCard;