
import express from "express";
import { getMoodTrends } from "../controllers/moodController.js";
import  protect  from "../middleware/authMiddleware.js";


const router = express.Router();

//router.post("/add", protect,addMood);
router.get("/trends", protect, getMoodTrends);

export default router;
