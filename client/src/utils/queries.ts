import { gql } from '@apollo/client';

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
    }
  }
`;

export const QUERY_FLASHCARD = gql`
  query getFlashcard($id: ID!) {
    getFlashcard(id: $id) {
      _id
      term
      definition
      deck
      isFavorite
      createdAt
      updatedAt
    }
  }
`;
export const QUERY_ALL_DECKS = gql`
  query getAllDecks {
    getAllDecks {
      _id
      title
      description
      isPublic
      createdBy
      flashcards {
        _id
        term
        definition
        isFavorite
      }
    }
  }
`;

export const QUERY_SINGLEDECK = gql`
  query getDeck($id: ID!) {
    getDeck(id: $id) {
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