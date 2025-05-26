import express from "express";
import { createDeck, updateDeck } from "../controllers/deckcontrollers";
const router = express.Router();
router.post("/", createDeck);
router.put("/:id", updateDeck);
export default router;
