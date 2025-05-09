import { Schema, model } from 'mongoose';
// Define the schema for the Profile document
const deckSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    flashcards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Flashcard"
        }
    ]
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Deck = model('Deck', deckSchema);
export default Deck;
