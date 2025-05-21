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
                return await Profile.findById(context.user._id);
            }
            throw new AuthenticationError('Invalid credentials');
        },
        getFlashcard: async (_parent, { id }, _context) => {
            return Flashcard.findById(id).populate('createdByUsername').populate('deck');
        },
        getAllDecks: async () => {
            return Deck.find().populate('flashcards').populate('createdByUsername');
        },
        getSingleDeck: async (_parent, { id }, _context) => {
            return Deck.findById(id).populate('flashcards').populate('createdByUsername');
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
        removeProfile: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findByIdAndDelete(context.user._id);
            }
            throw new AuthenticationError('Invalid credentials');
        },
        createFlashcard: async (_parent, { term, definition, deck }, context) => {
            if (!context.user)
                throw new AuthenticationError('You must be logged in to create a flashcard');
            const flashcard = await Flashcard.create({
                term,
                definition,
                deck,
                createdByUsername: context.user._id,
            });
            await Deck.findByIdAndUpdate(deck, { $push: { flashcards: flashcard._id } });
            return flashcard;
        },
        updateFlashcard: async (_parent, { id, term, definition, isFavorite }, context) => {
            if (!context.user)
                throw new AuthenticationError('Unauthorized');
            const flashcard = await Flashcard.findById(id);
            if (!flashcard)
                throw new Error('Flashcard not found.');
            if (flashcard.createdByUsername.toString() !== context.user._id)
                throw new AuthenticationError('You can only update your own flashcards');
            const updated = await Flashcard.findByIdAndUpdate(id, { $set: { term, definition, isFavorite } }, { new: true, runValidators: true });
            return updated;
        },
        deleteFlashcard: async (_parent, { id }, context) => {
            if (!context.user)
                throw new AuthenticationError('Unauthorized');
            const flashcard = await Flashcard.findById(id);
            if (!flashcard)
                throw new Error('Flashcard not found.');
            if (flashcard.createdByUsername.toString() !== context.user._id)
                throw new AuthenticationError('You can only delete your own flashcards');
            await flashcard.deleteOne();
            await Deck.updateOne({ flashcards: id }, { $pull: { flashcards: id } });
            return true;
        },
        toggleFavorite: async (_parent, { id }, context) => {
            if (!context.user)
                throw new AuthenticationError('Unauthorized');
            const card = await Flashcard.findById(id);
            if (!card)
                throw new Error('Not found');
            if (card.createdByUsername.toString() !== context.user._id)
                throw new AuthenticationError('You can only toggle your own flashcards');
            card.isFavorite = !card.isFavorite;
            await card.save();
            return card;
        },
        createDeck: async (_parent, { title, description }, context) => {
            const userId = context.user?._id;
            if (!userId)
                throw new AuthenticationError('You must be logged in to create a deck');
            const exists = await Deck.findOne({ title });
            if (exists)
                throw new Error('Deck title must be unique.');
            return Deck.create({ title, description, createdByUsername: userId });
        },
        deleteDeck: async (_parent, { id }, context) => {
            const userId = context.user?._id;
            if (!userId)
                throw new AuthenticationError('You must be logged in to delete a deck');
            const deck = await Deck.findById(id);
            if (!deck)
                throw new Error('Deck not found');
            if (deck.createdByUsername.toString() !== userId)
                throw new AuthenticationError('You can only delete your own decks');
            await deck.deleteOne();
            await Flashcard.deleteMany({ deck: id });
            return true;
        },
    },
    Flashcard: {
        createdByUsername: async (flashcard) => {
            return await Profile.findById(flashcard.createdByUsername);
        },
    },
    Deck: {
        createdByUsername: async (deck) => {
            return await Profile.findById(deck.createdByUsername);
        },
    },
};
export default resolvers;
