import db from '../config/connection.js';
import { Profile } from '../models/index.js';
import { Deck } from '../models/index.js';
import { Flashcard } from '../models/index.js';
import profileSeeds from './profileData.json' with { type: "json" };
import deckSeeds from './deckData.json' with { type: "json" };
import flashcardSeeds from './flashcardData.json' with { type: "json" };
import cleanDB from './cleanDB.js';
import { toObjectId } from '../utils/objectId.js';
const seedDatabase = async () => {
    try {
        await db();
        await cleanDB();
        const createdProfiles = await Profile.insertMany(profileSeeds);
        const createdDecks = [];
        for (const deck of deckSeeds) {
            const user = createdProfiles.find((profile) => profile._id.toString() === deck.createdBy);
            if (!user) {
                console.error(`User ${deck.createdBy} not found for deck ${deck.title}`);
                continue;
            }
            const createdDeck = await Deck.create({
                ...deck,
                createdBy: toObjectId(user._id)
            });
            user.decks.push(toObjectId(createdDeck._id));
            await user.save();
            createdDecks.push(createdDeck);
            console.log(`Deck created: ${createdDeck.title}`);
        }
        const createdFlashcards = [];
        for (const flashcard of flashcardSeeds) {
            const deck = createdDecks.find((deck) => deck._id.toString() === flashcard.deck);
            if (!deck) {
                console.error(`Flashcard ${flashcard.term} not found in deck ${flashcard.deck}`);
                continue;
            }
            const createdFlashcard = await Flashcard.create({
                ...flashcard,
                deck: toObjectId(deck._id)
            });
            deck.flashcards.push(toObjectId(createdFlashcard._id));
            await deck.save();
            createdFlashcards.push(createdFlashcard);
            console.log(`Flashcard created: ${createdFlashcard.term}`);
        }
        console.log('Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error seeding database:', error.message);
        }
        else {
            console.error('Unknown error seeding database');
        }
        process.exit(1);
    }
};
seedDatabase();
