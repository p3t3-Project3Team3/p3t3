import { Key, ReactNode } from 'react';
import Flashcard from './Flashcard';

interface Deck {
  _id: Key | null | undefined;
  title: ReactNode;
  flashcards: any;
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: Date;
}
export default Deck;