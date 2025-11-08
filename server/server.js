// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import journalRoutes from "./routes/journalroutes.js";
import trendsRoutes from "./routes/moodRoutes.js";
import affirmationRoutes from "./routes/affirmationRoutes.js";
import historyRoutes from "./routes/historyRoutes.js"
import moodRoutes from "./routes/moodRoutes.js";

dotenv.config();
//console.log("Gemini key in main app length:", process.env.GROQ_API_KEY?.length || "Missing");

const app = express();
const PORT = process.env.PORT || 5001;

connectDB(); // MongoDB connection

app.use(cors({
  origin: "https://mind-ease-drab.vercel.app/",
  credentials:true,  // // allows cookies/credentials
}));
app.use(express.json());
//console.log("Exact key from backend:", JSON.stringify(process.env.GROQ_API_KEY));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/trends", trendsRoutes);
app.use("/api/affirmations", affirmationRoutes);
app.use("/api/history", historyRoutes)
app.use("/api/mood", moodRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

});
