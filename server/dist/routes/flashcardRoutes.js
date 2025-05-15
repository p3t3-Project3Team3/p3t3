// routes/flashcardRoutes.ts
import express from "express";
import { createFlashcard, updateFlashcard } from "../controllers/flashcardcontrollers";
const router = express.Router();
router.post("/", createFlashcard);
router.put("/:id", updateFlashcard);
export default router;
