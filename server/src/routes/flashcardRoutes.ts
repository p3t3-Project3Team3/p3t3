// routes/flashcardRoutes.ts
import express from "express";
import {
  createFlashcard,
  updateFlashcard,
  createFlashcardForDeck,
  getFlashcardsByDeck,
} from "../controllers/flashcardcontrollers";

const router = express.Router();

router.post("/", createFlashcard);
router.put("/:id", updateFlashcard);

// ✳️ New routes:
router.post("/deck/:deckId", createFlashcardForDeck);
router.get("/deck/:deckId", getFlashcardsByDeck);

export default router;

// Method	Route	Description
// GET	/	Get all flashcards
// GET	/:id	Get a flashcard by ID
// GET	/deck/:deckId	Get flashcards for a deck
// POST	/	Create a new flashcard
// PUT	/:id	Update a flashcard
// DELETE	/:id	Delete a flashcard