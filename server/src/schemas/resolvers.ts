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
  }
}

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
        return await Profile.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    getFlashcard: async (_parent: unknown, args: { id: string }, _context: Context): Promise<IFlashcard | null> => {
      return Flashcard.findById(args.id);
    },
    getAllDecks: async (): Promise<IDeck[]> => {
  return Deck.find().populate('flashcards');
},
    getSingleDeck: async (_parent: unknown, args: { id: string }, _context: Context): Promise<IDeck | null> => {
      return Deck.findById(args.id).populate('flashcards');
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
        throw AuthenticationError;
      }
      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },
    removeProfile: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },

    createFlashcard: async (
      _parent: unknown,
      { term, definition, deck }: { term: string; definition: string; deck: string },
      _context: Context
    ): Promise<IFlashcard> => {
      const exists = await Flashcard.findOne({ term, definition, deck });
      if (exists) throw new Error('Duplicate flashcard.');
      const flashcard = await Flashcard.create({ term, definition, deck });
      await Deck.findByIdAndUpdate(deck, { $push: { flashcards: flashcard._id } });
      return flashcard;
    },

    updateFlashcard: async (
      _parent: unknown,
      { id, term, definition, isFavorite }: { id: string; term?: string; definition?: string; isFavorite?: boolean },
      _context: Context
    ): Promise<IFlashcard> => {
      const updated = await Flashcard.findByIdAndUpdate(
        id,
        { $set: { term, definition, isFavorite } },
        { new: true, runValidators: true }
      );
      if (!updated) throw new Error('Flashcard not found.');
      return updated;
    },

    deleteFlashcard: async (_parent: unknown, { id }: { id: string }, _context: Context): Promise<boolean> => {
      const deleted = await Flashcard.findByIdAndDelete(id);
      if (!deleted) throw new Error('Flashcard not found.');
      await Deck.updateOne({ flashcards: id }, { $pull: { flashcards: id } });
      return true;
    },

    toggleFavorite: async (_parent: unknown, { id }: { id: string }, _context: Context): Promise<IFlashcard> => {
      const card = await Flashcard.findById(id);
      if (!card) throw new Error('Not found');
      card.isFavorite = !card.isFavorite;
      await card.save();
      return card;
    },

    createDeck: async (
      _parent: unknown,
      { title, description, createdBy }: { title: string; description?: string; createdBy: string },
      _context: Context
    ): Promise<IDeck> => {
      const exists = await Deck.findOne({ title });
      if (exists) throw new Error('Deck title must be unique.');
      return Deck.create({ title, description, createdBy });
    },

    deleteDeck: async (_parent: unknown, { id }: { id: string }, _context: Context): Promise<boolean> => {
      const deck = await Deck.findByIdAndDelete(id);
      if (!deck) throw new Error('Deck not found');
      await Flashcard.deleteMany({ deck: id });
      return true;
    },
  },
};

export default resolvers;
