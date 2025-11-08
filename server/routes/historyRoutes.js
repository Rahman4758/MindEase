import express from "express";
const router = express.Router();
import  protect  from "../middleware/authMiddleware.js";
import { getHistory } from "../controllers/history.js";
router.get("/", protect, getHistory);

export default router;