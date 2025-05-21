import { gql } from '@apollo/client';

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
      username
      email
      flashcards {
        _id
        term
        definition
        example
        deck
        isFavorite
        createdAt
        updatedAt
        createdBy {
          username
      }
    }
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      username
      email
      flashcards {
        _id
        term
        definition
        example
        deck
        isFavorite
        createdAt
        updatedAt
        createdBy {
          username
      }
}
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
      example
      deck
      isFavorite
      createdAt
      updatedAt
      createdBy {
        username
      }
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
      createdBy {
      username}
      flashcards {
        _id
        term
        definition
        isFavorite
        createdBy {
        username
      }
      }
    }
  }
`;

export const QUERY_SINGLEDECK = gql`
  query getSingleDeck($id: ID!) {
    getSingleDeck(id: $id) {
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