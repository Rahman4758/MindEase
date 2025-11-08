
import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mood: { type: Number, required: true, min: 1, max: 5 }, // 1–5
  date: { type: Date, default: Date.now }
});

const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);

export default MoodEntry;

