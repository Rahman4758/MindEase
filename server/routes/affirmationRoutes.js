import express from "express";
const router = express.Router();
import  protect  from "../middleware/authMiddleware.js";
import { getAffirmation, saveAffirmation, getUserAffirmations } from "../controllers/affirmationController.js";
router.get("/", protect, getAffirmation);
router.post("/save", protect, saveAffirmation);
router.get("/favorites", protect, getUserAffirmations);
export default router;