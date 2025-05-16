import { Schema, model, Document, Types, ObjectId } from 'mongoose';

// Define an interface for the flashcard document
export interface IFlashcard extends Document {
  _id: string;
  term: string;
  definition: string;
  deck: Types.ObjectId;
  createdBy: ObjectId;
  isFavorite?: boolean;
}

// Define the schema for the flashcard document
const flashcardSchema = new Schema<IFlashcard>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Flashcard = model<IFlashcard>('Flashcard', flashcardSchema);

export default Flashcard;

