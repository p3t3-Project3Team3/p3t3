import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
// You'll need to create these GraphQL operations
import { Create_DECK } from '../../utils/mutations';
import { QUERY_ALL_DECKS } from '../../utils/queries'; // For refetching after creation

interface Deck {
  _id: string;
  title: string;
  description?: string;
  flashcards: any[];
  createdAt: string;
}

const NewDeck = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Get existing decks for display (optional)
  const { data: existingDecks, loading: decksLoading } = useQuery(QUERY_ALL_DECKS);

  const [createDeck] = useMutation(Create_DECK, {
    onCompleted: (data) => {
      console.log('Deck created successfully:', data);
      // Navigate to the new deck or card creation page
      if (data.createDeck._id) {
        navigate(`/deck/${data.createDeck._id}`);
      }
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Error creating deck:', error);
      alert('Failed to create deck. Please try again.');
      setIsCreating(false);
    },
    // Refetch all decks after creating a new one
    refetchQueries: [{ query: QUERY_ALL_DECKS }],
  });

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a deck title');
      return;
    }

    setIsCreating(true);
    try {
      await createDeck({
        variables: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      });
    } catch (error) {
      console.error('Failed to create deck:', error);
    }
  };

  const handleClearForm = () => {
    setTitle('');
    setDescription('');
  };

  const handleCancel = () => {
    navigate('/decks'); // Navigate back to decks list
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Deck</h1>
        <p className="text-gray-600">Build a new flashcard deck for studying</p>
      </div>

      {/* New Deck Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Deck Information</h2>
        
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Deck Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Spanish Vocabulary, Biology Chapter 5, History Terms"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this deck covers (optional)..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={handleCreate}
            disabled={isCreating || !title.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="animate-spin">⟳</span>
                Creating...
              </>
            ) : (
              'Create Deck'
            )}
          </button>
          
          <button
            onClick={handleClearForm}
            disabled={isCreating}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
          >
            Clear Form
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isCreating}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Form Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for creating a good deck:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Choose a clear, descriptive title</li>
            <li>• Add a description to help you remember the deck's purpose</li>
            <li>• After creating, you'll be able to add flashcards immediately</li>
          </ul>
        </div>
      </div>

      {/* Existing Decks Preview (Optional) */}
      {existingDecks && existingDecks.getDecks && existingDecks.getDecks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Your Existing Decks ({existingDecks.getDecks.length})
          </h3>
          
          {decksLoading ? (
            <p className="text-gray-500">Loading decks...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingDecks.getDecks.slice(0, 6).map((deck: Deck) => (
                <div key={deck._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-800 mb-1">{deck.title}</h4>
                  {deck.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{deck.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {deck.flashcards?.length || 0} cards
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {existingDecks.getDecks.length > 6 && (
            <button
              onClick={() => navigate('/decks')}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              View all decks →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NewDeck;