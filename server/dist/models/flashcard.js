import { Schema, model } from 'mongoose';
// Define the schema for the flashcard document
const flashcardSchema = new Schema({
    term: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    definition: {
        type: String,
        required: true,
        unique: true,
    },
    deck: {
        type: Schema.Types.ObjectId,
        ref: "Deck",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },
    isFavorite: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Flashcard = model('Flashcard', flashcardSchema);
export default Flashcard;
