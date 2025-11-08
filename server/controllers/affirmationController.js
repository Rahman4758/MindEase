import {Affirmation} from "../models/affirmation.js";
import Groq from "groq-sdk";
       const groq = new Groq({ apiKey:process.env.GROQ_API_KEY });

// ✅ Generate Affirmation (general or by category)
export const getAffirmation = async (req, res) => {
  try {
    const category = req.query.category || null;

    const prompt = category
      ? `Give me a short and powerful positive daily affirmation related to "${category}". Just the affirmation text only.`
      : `Give me a short and powerful positive daily affirmation. Just the affirmation text only.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an uplifting assistant who gives positive affirmations." },
        { role: "user", content: prompt },
      ],
      max_tokens: 50,
      temperature: 0.8,
    });

    const text = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      affirmation: text || "You are enough, just as you are.",
      category: category || "General",
    });
  } catch (error) {
    console.error("Error generating affirmation:", error);
    res.status(500).json({ message: "Failed to generate affirmation" });
  }
};

// ✅ Save affirmation to favorites
export const saveAffirmation = async (req, res) => {
  try {
    const { text, category } = req.body;

    const newAffirmation = await Affirmation.create({
      user: req.user._id,
      text,
      category: category || "General",
    });

    res.status(201).json(newAffirmation);
  } catch (error) {
    console.error("Error saving affirmation:", error);
    res.status(500).json({ message: "Failed to save affirmation" });
  }
};

// ✅ Get all saved affirmations of a user
export const getUserAffirmations = async (req, res) => {
  try {
    const affirmations = await Affirmation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(affirmations);
  } catch (error) {
    console.error("Error fetching affirmations:", error);
    res.status(500).json({ message: "Failed to fetch affirmations" });
  }
};
