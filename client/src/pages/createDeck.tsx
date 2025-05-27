import React from "react";
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Create_DECK } from '../utils/mutations';



const createDeck = () => {
  const navigate = useNavigate();
 const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
//   const [isPublic, setIsPublic] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [createDeck, { loading }] = useMutation(Create_DECK, {
    onCompleted: (data) => {
      const newDeck = data.CreateDeck;
      console.log('Deck created:', newDeck);
      navigate(`/deck/${newDeck._id}`);
    },
    onError: (error) => {
      console.error('Error creating deck:', error.message);
      setErrorMessage('Failed to create deck. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title is required');
      return;
    }

    try {
      await createDeck({
        variables: {
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            // isPublic,
          },
        },
      });
    } catch (err) {

    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1>Create a New Deck</h1>
      <form onSubmit={handleSubmit} className="ui form">
        <div className="field">
          <label>Deck Title </label>
          <input
            name="deckTitle"
            type="deckTitle"
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

        {/* <div className="field">
          <div className="ui checkbox">
             <input type="checkbox" name="example"  onChange={() => setIsPublic(!isPublic)}/>
         <label>Make this deck public</label>
          </div>
        </div> */}

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

export default createDeck;