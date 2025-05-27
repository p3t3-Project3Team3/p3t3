import Flashcard from '../models/flashcard.js';
import Deck from '../models/Deck.js';
import { IFlashcard } from '../models/flashcard';
import { IDeck } from '../models/Deck';
import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface Profile {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
}

interface ProfileArgs {
  profileId: string;
}

interface AddProfileArgs {
  input: {
    name: string;
    email: string;
    password: string;
  };
}

// interface CreateDeckArgs {
//   title: string;
//   description?: string;
// }


interface Context {
  user?: Profile;
}

const resolvers = {
  Query: {
    profiles: async (): Promise<Profile[]> => {
      return await Profile.find();
    },
    profile: async (_parent: any, { profileId }: ProfileArgs): Promise<Profile | null> => {
      return await Profile.findOne({ _id: profileId });
    },
    me: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findById(context.user._id);
      }
      throw new AuthenticationError('Invalid credentials');
    },
    getFlashcard: async (_parent: unknown, { id }: { id: string }, _context: Context): Promise<IFlashcard | null> => {
      return Flashcard.findById(id).populate('createdByUsername').populate('deck');
    },
    getAllDecks: async (): Promise<IDeck[]> => {
      return Deck.find().populate('flashcards').populate('createdByUsername');
    },
    getSingleDeck: async (_parent: unknown, { id }: { id: string }, _context: Context): Promise<IDeck | null> => {
      return Deck.findById(id).populate('flashcards').populate('createdByUsername');
    },
    getFlashcardsByDeck: async (_parent: any, { deckId }: { deckId: string }) => {
    return await Flashcard.find({ deck: deckId }).populate('createdByUsername');
    },
  },

  Mutation: {
    addProfile: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: Profile }> => {
      const profile = await Profile.create({ ...input });
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },

    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: Profile }> => {
      const profile = await Profile.findOne({ email });
  if (!profile) {
    console.log("Login failed: user not found", email);
    throw new AuthenticationError('Invalid credentials');
  }
     const correctPw = await profile.isCorrectPassword(password);
  if (!correctPw) {
    console.log("Login failed: incorrect password", password);
    throw new AuthenticationError('Invalid credentials');
  }
    const token = signToken(profile.name, profile.email, profile._id);
  return { token, profile };
    },

    removeProfile: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findByIdAndDelete(context.user._id);
      }
      throw new AuthenticationError('Invalid credentials');
    },

   createFlashcard: async (
      _parent: any,
      { input }: { input: { term: string; definition: string; example?: string; deckId: string } },
      context: Context
    ): Promise<IFlashcard> => {
      if (!context.user) throw new AuthenticationError('You must be logged in to create a flashcard');

      const { term, definition, example, deckId } = input;

      const flashcard = await Flashcard.create({
        term,
        definition,
        example,
        deck: deckId,
        createdByUsername: context.user._id,
      });

      await Deck.findByIdAndUpdate(deckId, { $push: { flashcards: flashcard._id } });

      return flashcard;
    },


    updateFlashcard: async (
      _parent: unknown,
      { id, term, definition, isFavorite }: { id: string; term?: string; definition?: string; isFavorite?: boolean },
      context: Context
    ): Promise<IFlashcard> => {
      if (!context.user) throw new AuthenticationError('Unauthorized');

      const flashcard = await Flashcard.findById(id);
      if (!flashcard) throw new Error('Flashcard not found.');
      if (flashcard.createdByUsername.toString() !== context.user._id)
        throw new AuthenticationError('You can only update your own flashcards');

      const updated = await Flashcard.findByIdAndUpdate(
        id,
        { $set: { term, definition, isFavorite } },
        { new: true, runValidators: true }
      );
      return updated!;
    },
    
    deleteFlashcard: async (_parent: unknown, { id }: { id: string }, context: Context): Promise<boolean> => {
      if (!context.user) throw new AuthenticationError('Unauthorized');
      
      const flashcard = await Flashcard.findById(id);
      if (!flashcard) throw new Error('Flashcard not found.');
      if (flashcard.createdByUsername.toString() !== context.user._id)
        throw new AuthenticationError('You can only delete your own flashcards');
      
      await flashcard.deleteOne();
      await Deck.updateOne({ flashcards: id }, { $pull: { flashcards: id } });
      return true;
    },
    
    toggleFavorite: async (_parent: unknown, { id }: { id: string }, context: Context): Promise<IFlashcard> => {
      if (!context.user) throw new AuthenticationError('Unauthorized');
      
      const card = await Flashcard.findById(id);
      if (!card) throw new Error('Not found');
      if (card.createdByUsername.toString() !== context.user._id)
        throw new AuthenticationError('You can only toggle your own flashcards');
      
      card.isFavorite = !card.isFavorite;
      await card.save();
      return card;
    },

createDeck: async (
  _parent: any,
  { title, description }: { title: string; description?: string },
  context: Context
): Promise<IDeck> => {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in to create a deck');
  }

  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  const deck = new Deck({
    title,
    description,
    createdByUsername: context.user._id, // Use ObjectId from logged-in user
    isPublic: false,
    flashcards: [],
  });

  await deck.save();
  return deck;
},

    
    updateDeck: async (
  _parent: unknown,
  { id, title, description }: { id: string; title?: string; description?: string },
  context: Context
): Promise<IDeck> => {
  if (!context.user) throw new AuthenticationError('Unauthorized');

  const deck = await Deck.findById(id);
  if (!deck) throw new Error('Deck not found.');
  if (deck.createdByUsername.toString() !== context.user._id)
    throw new AuthenticationError('You can only update your own decks');

  const updated = await Deck.findByIdAndUpdate(
    id,
    { $set: { ...(title && { title }), ...(description && { description }) } },
    { new: true, runValidators: true }
  );
  return updated!;
},
    
    deleteDeck: async (_parent: unknown, { id }: { id: string }, context: Context): Promise<boolean> => {
      const userId = context.user?._id;
      if (!userId) throw new AuthenticationError('You must be logged in to delete a deck');

      const deck = await Deck.findById(id);
      if (!deck) throw new Error('Deck not found');
      if (deck.createdByUsername.toString() !== userId)
        throw new AuthenticationError('You can only delete your own decks');

      await deck.deleteOne();
      await Flashcard.deleteMany({ deck: id });
      return true;
    },
  },

  Flashcard: {
    createdByUsername: async (flashcard: IFlashcard) => {
      return await Profile.findById(flashcard.createdByUsername);
    },
  },

  Deck: {
  createdByUsername: async (deck: IDeck) => {
    return await Profile.findById(deck.createdByUsername);
  },
  flashcards: async (deck: IDeck) => {
    return await Flashcard.find({ deck: deck._id });
  },
},
};

export default resolvers;
