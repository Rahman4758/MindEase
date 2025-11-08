import Journal from  '../models/JournalEntry.js';
import analyzeWithGroq from '../utils/analyzeWithGroq.js';

export const createJournal = async (req, res) => {
  const { entry,text } = req.body;
  try {
    console.log("Incoming body:", req.body);
    console.log("User from token:", req.user);
    const journalEntry = entry || text;
     if (!journalEntry) {
      return res.status(400).json({ message: "No journal content provided" });
    }
    const analysisText = await analyzeWithGroq(journalEntry);
   // console.log("analysis text:",analysisText)
  
    // Clean and parse the analysisText.text
    let parsed = {};
try {
  const clean = analysisText.text
    .replace(/```/g, '') // remove code fences
    .trim();
  parsed = JSON.parse(clean);
} catch (err) {
  console.error("Failed to parse analysisText.text:", err);
}

  
    const newJournal = await Journal.create({
      user: req.user._id || null, //fallback
      content: journalEntry,
      mood: analysisText?.moodd || parsed?.mood || " ",
      advice: parsed?.advice || " ",
      quote: parsed?.quote || " ",
      // emoji: analysisText?.emoji || "📝",
    });


    res.status(201).json({
      mood: newJournal.mood,
      // emoji: newJournal.emoji,
      content: newJournal.content,
      advice: newJournal.advice,
      quote: newJournal.quote,
    });
  } catch (err) {
    console.log("Error creating journal", err)
    res.status(500).json({ message: 'Failed to save journal', error: err.message });
  }
};

export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    const shaped = journals.map(j => ({
      
       mood: j.mood || "Neutral",
      emoji: j.emoji || "📝",
      advice: j.advice || "Saved entry",
      quote: j.quote || j.content,
    }));

    res.status(200).json(shaped);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch journals', error: err.message });
  }
};
