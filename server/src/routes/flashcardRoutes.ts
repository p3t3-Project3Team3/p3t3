// routes/flashcardRoutes.ts
import express from "express";
import { createFlashcard, updateFlashcard } from "../controllers/flashcardcontrollers";

const router = express.Router();

router.post("/", createFlashcard);
router.put("/:id", updateFlashcard);

export default router;

// Method	Route	Description
// GET	/	Get all flashcards
// GET	/:id	Get a flashcard by ID
// GET	/deck/:deckId	Get flashcards for a deck
// POST	/	Create a new flashcard
// PUT	/:id	Update a flashcard
// DELETE	/:id	Delete a flashcard