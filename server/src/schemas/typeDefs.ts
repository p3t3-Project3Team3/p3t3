const typeDefs = `
  type Profile {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    decks: [Deck]
    flashcards: [Flashcard]
  }

  type Auth {
    token: ID!
    profile: Profile
  }
  
  input ProfileInput {
    name: String!
    email: String!
    password: String!
  }

  type Flashcard {
    _id: ID!
    term: String!
    definition: String!
    deck: ID!
    isFavorite: Boolean
    createdAt: String
    updatedAt: String
  }

  type Deck {
    _id: ID!
    title: String!
    description: String
    createdBy: ID!
    isPublic: Boolean
    flashcards: [Flashcard]
    createdAt: String
    updatedAt: String
  }

  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    me: Profile
     getFlashcard(id: ID!): Flashcard
    getDeck(id: ID!): Deck
  }

  type Mutation {
    addProfile(input: ProfileInput!): Auth
    login(email: String!, password: String!): Auth
    removeProfile: Profile

    # deck mutations
    createFlashcard(term: String!, definition: String!, deck: ID!): Flashcard
    updateFlashcard(id: ID!, term: String, definition: String, isFavorite: Boolean): Flashcard
    deleteFlashcard(id: ID!): Boolean
    toggleFavorite(id: ID!): Flashcard
    createDeck(title: String!, description: String, createdBy: ID!): Deck
    deleteDeck(id: ID!): Boolean
    archiveDeck(id: ID!): Deck
  }
`;

export default typeDefs;
