import { gql } from '@apollo/client';

export const ADD_PROFILE = gql`
  mutation addProfile($input: ProfileInput!) {
    addProfile(input: $input) {
      token
      profile {
        _id
        name
      }
    }
  }
`;


export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const CREATE_FLASHCARD = gql`
  mutation createFlashcard($input: FlashcardInput!) {
    createFlashcard(input: $input) {
      _id
      term
      definition
      example
      deck
      isFavorite
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_FLASHCARD = gql`
  mutation updateFlashcard($id: ID!, $input: FlashcardInput!) {
    updateFlashcard(id: $id, input: $input) {
      _id
      term
      definition
      example
      deck
      isFavorite
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FLASHCARD = gql`
  mutation deleteFlashcard($id: ID!) {
    deleteFlashcard(id: $id) 
  }
`;
export const Create_DECK = gql`
  mutation CreateDeck($input: DeckInput!) {
    CreateDeck(input: $input) {
      _id   
      title
      description
      createdBy
      isPublic

      flashcards {
        _id
        term
        definition
        example
        deck
        isFavorite
        createdAt
        updatedAt
      }
    }
  }   
`;

export const DELETE_DECK = gql`
  mutation deleteDeck($id: ID!) {
    deleteDeck(id: $id) {
      _id
      title
      description
      createdBy
      isPublic

      flashcards {
        _id
        term
        definition
        deck
        isFavorite
        createdAt
        updatedAt
      }
    }
  }
`;