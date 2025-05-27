import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_DECK } from '../utils/mutations';

const CreateDeck = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [createDeckMutation, { loading }] = useMutation(CREATE_DECK, {
  onCompleted: (data) => {
    const newDeck = data.createDeck;  // note: 'createDeck', lowercase 'c'
    console.log('Deck created:', newDeck);
    navigate(`/deck/${newDeck._id}/new-card`);
  },
  onError: (error) => {
  console.error('Error creating deck:', error.message, error.graphQLErrors, error.networkError);
  if (error.graphQLErrors) {
  error.graphQLErrors.forEach(({ message }) => {
    console.error('GraphQL error message:', message);
  });
}
  setErrorMessage('Failed to create deck. Please try again.');
},
});
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim()) {
    setErrorMessage('Title is required');
    return;
  }

  const variables: { title: string; description?: string } = { title: title.trim() };
  if (description.trim()) {
    variables.description = description.trim();
  }

  try {
    await createDeckMutation({ variables });
  } catch (err) {
    // Optional additional error handling here
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1>Create a New Deck</h1>
      <form onSubmit={handleSubmit} className="ui form">
        <div className="field">
          <label>Deck Title</label>
          <input
            name="deckTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            maxLength={100}
          />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            name="deckDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description (optional)"
            rows={4}
            maxLength={500}
          />
        </div>

        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

        <div className="field">
          <button type="submit" className="ui primary button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Deck'}
          </button>
          <button type="button" className='ui negative button' onClick={() => navigate('/home')} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDeck;
