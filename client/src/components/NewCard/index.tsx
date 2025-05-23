import React, { useState } from 'react';
import { CardFront } from "../CardFront";
import { CardBack } from "../CardBack";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ALL_DECKS } from '../../utils/queries';
import { CREATE_FLASHCARD } from '../../utils/mutations';
import { useParams } from 'react-router-dom';

interface Flashcard {
  _id: string;
  term: string;
  definition: string;
}

interface Deck {
  _id: string;
  title: string;
  flashcards: Flashcard[];
}

const NewCard = () => {
  const { id } = useParams<{ id: string }>();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFlipped, setPreviewFlipped] = useState(false);

  const { data, loading, error } = useQuery(QUERY_ALL_DECKS, {
    variables: { id: id },
  });

  const [createFlashcard] = useMutation(CREATE_FLASHCARD, {
    onCompleted: () => {
      setTerm('');
      setDefinition('');
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
          term: term.trim(),
          definition: definition.trim(),
          deck: id,
        },
        refetchQueries: [{ query: QUERY_ALL_DECKS, variables: { id: id } }],
      });
    } catch (error) {
      console.error('Failed to create flashcard:', error);
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

  if (loading) return <div className="flex justify-center p-8"><p>Loading deck...</p></div>;
  if (error) return <div className="flex justify-center p-8 text-red-600"><p>Error loading deck: {error.message}</p></div>;
  if (!data?.getDeck) return <div className="flex justify-center p-8"><p>Deck not found</p></div>;

  const deck: Deck = data.getDeck;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Card</h1>
        <h2 className="text-xl text-gray-600">to "{deck.title}"</h2>
        <p className="text-sm text-gray-500 mt-1">
          Current cards in deck: {deck.flashcards.length}
        </p>
      </div>

      {/* New Card Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Flashcard</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Term Input */}
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
              Term/Question (Front of card)
            </label>
            <textarea
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter the term, question, or prompt..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Definition Input */}
          <div>
            <label htmlFor="definition" className="block text-sm font-medium text-gray-700 mb-2">
              Definition/Answer (Back of card)
            </label>
            <textarea
              id="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter the definition, answer, or explanation..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleCreate}
            disabled={isCreating || !term.trim() || !definition.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creating...' : 'Add Flashcard'}
          </button>
          
          <button
            onClick={handlePreview}
            disabled={!term.trim() || !definition.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Preview Card
          </button>
          
          <button
            onClick={handleClearForm}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Card Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div 
              className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 min-h-32 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-100"
              onClick={() => setPreviewFlipped(!previewFlipped)}
            >
              {previewFlipped ? (
                <CardBack definition={definition} />
              ) : (
                <CardFront term={term} />
              )}
            </div>
            
            <p className="text-sm text-gray-600 text-center mt-3">
              Click card to flip • Currently showing: {previewFlipped ? 'Back' : 'Front'}
            </p>
          </div>
        </div>
      )}

      {/* Existing Cards List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Cards in "{deck.title}" ({deck.flashcards.length})
        </h3>
        
        {deck.flashcards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No cards in this deck yet. Add your first card above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deck.flashcards.map((card: Flashcard) => (
              <div key={card._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Term</label>
                    <p className="text-sm bg-blue-50 p-2 rounded border">{card.term}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Definition</label>
                    <p className="text-sm bg-green-50 p-2 rounded border">{card.definition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCard;