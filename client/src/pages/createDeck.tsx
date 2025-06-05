import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_DECK } from '../utils/mutations';
import {
  Container,
  div,
  Header,
  Form,
  TextArea,
  Button,
  Message
} from 'semantic-ui-react';

const CreateDeck = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [createDeckMutation, { loading }] = useMutation(CREATE_DECK, {
    onCompleted: (data) => {
      const newDeck = data.createDeck;
      console.log('Deck created:', newDeck);
      navigate(`/deck/${newDeck._id}/new-card`);
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

    const variables: { title: string; description?: string } = { title: title.trim() };
    if (description.trim()) {
      variables.description = description.trim();
    }

    try {
      await createDeckMutation({ variables });
    } catch (err) {
      // Already handled in onError
    }
  };

  return (
    <Container className="create-deck">
      <div className=" ui violet inverted raised segment">
        <Header as="h1" textAlign="center">Create a New Deck</Header>

        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Field required>
            <label>Deck Title</label>
            <Form.Input
              name="deckTitle"
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <TextArea
              name="deckDescription"
              placeholder="Enter a brief description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
            />
          </Form.Field>

          {errorMessage && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{errorMessage}</p>
            </Message>
          )}

          <Form.Group widths="equal">
            <Button type="submit" className="ui violet button" fluid disabled={loading}>
              {loading ? 'Creating...' : 'Create Deck'}
            </Button>
            <Button
              type="button"
              color="red"
              fluid
              onClick={() => navigate('/home')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
};

export default CreateDeck;
