import { Schema, model, Document, ObjectId, Types } from 'mongoose';
// import  { IFlashcard } from "./flashcard.js";


// Define an interface for the Profile document
export interface IDeck extends Document {
  _id: string;
  title: string;
  description?: string;
  createdByUsername: ObjectId;
  isPublic: boolean;
  flashcards: Types.ObjectId[];
  updatedAt: Date;
}

// Define the schema for the Profile document
const deckSchema = new Schema<IDeck>(
  {
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
    createdByUsername: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    flashcards:[
      {
        type: Schema.Types.ObjectId,
        ref: "Flashcard"
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);



const Deck = model<IDeck>('Deck', deckSchema);

export default Deck;
