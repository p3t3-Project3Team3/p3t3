import Flashcard from '../models/flashcard.js';
import Deck from '../models/Deck.js';
import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        profiles: async () => {
            return await Profile.find();
        },
        profile: async (_parent, { profileId }) => {
            return await Profile.findOne({ _id: profileId });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
        getFlashcard: async (_parent, args, _context) => {
            return Flashcard.findById(args.id).populate('createdBy').populate('deck');
        },
        getAllDecks: async () => {
            return Deck.find().populate('flashcards').populate('createdBy');
        },
        getSingleDeck: async (_parent, args, _context) => {
            return Deck.findById(args.id).populate('flashcards');
        },
    },
    Mutation: {
        addProfile: async (_parent, { input }) => {
            const profile = await Profile.create({ ...input });
            const token = signToken(profile.name, profile.email, profile._id);
            return { token, profile };
        },
        login: async (_parent, { email, password }) => {
            const profile = await Profile.findOne({ email });
            if (!profile)
                throw AuthenticationError;
            const correctPw = await profile.isCorrectPassword(password);
            if (!correctPw)
                throw AuthenticationError;
            const token = signToken(profile.name, profile.email, profile._id);
            return { token, profile };
        },
        removeProfile: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findOneAndDelete({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
        createFlashcard: async (_parent, { term, definition, deck }, context) => {
            if (!context.user)
                throw new AuthenticationError('Not logged in');
            const flashcard = await Flashcard.create({
                term,
                definition,
                deck,
                createdBy: context.user._id,
            });
            await Deck.findByIdAndUpdate(deck, { $push: { flashcards: flashcard._id } });
            return flashcard;
        },
        updateFlashcard: async (_parent, { id, term, definition, isFavorite }, _context) => {
            const updated = await Flashcard.findByIdAndUpdate(id, { $set: { term, definition, isFavorite } }, { new: true, runValidators: true });
            if (!updated)
                throw new Error('Flashcard not found.');
            return updated;
        },
        deleteFlashcard: async (_parent, { id }, _context) => {
            const deleted = await Flashcard.findByIdAndDelete(id);
            if (!deleted)
                throw new Error('Flashcard not found.');
            await Deck.updateOne({ flashcards: id }, { $pull: { flashcards: id } });
            return true;
        },
        toggleFavorite: async (_parent, { id }, _context) => {
            const card = await Flashcard.findById(id);
            if (!card)
                throw new Error('Not found');
            card.isFavorite = !card.isFavorite;
            await card.save();
            return card;
        },
        createDeck: async (_parent, { title, description, createdBy }, _context) => {
            const exists = await Deck.findOne({ title });
            if (exists)
                throw new Error('Deck title must be unique.');
            return Deck.create({ title, description, createdBy });
        },
        deleteDeck: async (_parent, { id }, _context) => {
            const deck = await Deck.findByIdAndDelete(id);
            if (!deck)
                throw new Error('Deck not found');
            await Flashcard.deleteMany({ deck: id });
            return true;
        },
    },
    Flashcard: {
        createdBy: async (flashcard) => {
            return await Profile.findById(flashcard.createdBy);
        },
    },
    Deck: {
        createdBy: async (deck) => {
            return await Profile.findById(deck.createdBy);
        },
    },
};
export default resolvers;
